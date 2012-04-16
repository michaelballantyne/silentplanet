define(['libraries/jquery', 'libraries/jquery.jticker', 'libraries/sammy', 'models/problems', 'models/problemreports', 'models/rooms', 'models/students', 'controllers/login', 'models/items', 'controllers/inventorycommands', 'controllers/lookcommands', 'controllers/movecommands', 'controllers/problems', 'controllers/rooms', 'controllers/display'], function ($, jticker, sammy, problemSet, problemReports, roomSet, studentSet, login, items, inventory, look, move, probLogic, roomLogic, display) {
    var story = {},
    displayIntro = function () {
        display.clear();
        display.append("Greetings " + login.currentStudent.username + ".");
        display.append("You are about to embark on a journey of epic proportions.");
        display.append("Prepare thyself!");
        display.append("One day at the lab, one of your colleagues approaches you and politely asks you to imbibe a " +
                "new concoction of his own design.  His previous experiments with flavor additives have been quite" +
                " successful, so you eagerly accept.  As you peer into the depths of the flask, your eyes are " +
                "greeted by an emerald green syrup, broken up here and there with a bubble or two.  The smell the" +
                " brew gives off is somewhat vile, but with your colleague looking on expectantly, you feel compelled" +
                " to drink it in one gulp.  While the mixture oozes down your throat, you get a thorough taste.  Your" +
                " first impression is that your colleague has struck gold again.  That is...until the room to starts" +
                " to spin, and you begin to feel somewhat dizzy.  There is a strange popping noise sounding in your ears" +
                " as a mysterious veneer starts to cover your vision.  The room seems to stretch and bend in a strange" +
                " manner, appearing to grow larger and wider...");
        display.append("You awake in a cold sweat.  The effects of whatever your colleague gave you must have worn off, as" +
                " the room is no longer spinning, though you still feel quite tipsy.  After several moments of pondering" +
                " your immediate surroundings you realize the effects of that terrible brew were far more than expected." +
                "  You have shrunkend down to the size of a beetle, and the carpet in the lab seems like a thick grass " +
                "around you.  While you were out, the culprit of your bodily changes must have left, for you are quite alone.");
    },
    newGame = function () {
        login.currentStudent.itemFlags = [];
        login.currentStudent.roomFlags = [];
        login.updateStudentOnServer();
        displayIntro();
        return roomSet.FIRST_ROOM_ID;
    },

    //the answer command -- basically just checks to see if the current obstacle has been cleared.
    answer = function (response, context, cont) {
        //first check to see if there is actually a problem description
        if (roomLogic.currentRoom.problemDescription) {
            var correct = response.toUpperCase() === probLogic.currentProblem.answer.toUpperCase();
            //decide what to do if correct vs. incorrect
            if (correct) {
                display.clear().append("Correct!");
                display.append(roomLogic.currentRoom.problemWrapUp);
                roomSet.addOrUpdateRoomFlag(roomLogic.currentRoom._id, roomLogic.currentRoom.nextState);
                problemReports.addOrUpdateProblemReport(probLogic.currentProblem._id, correct, context);
                probLogic.currentProblem = null;
                move.moveTo(roomLogic.currentRoom.nextState, context, cont);
            } else {
                display.append("Your answer was incorrect!");
                cont();
                problemReports.addOrUpdateProblemReport(probLogic.currentProblem._id, correct, context);
            }
        }
    },

    wait = function (cont) {
        display.append("You pace back and forth for a few minutes.");
        cont();
    };



    sammy('#main', function () {
        this.get('#/story', function () {
            var context = this;
            this.partial('templates/storygame.hb').then(function () {
                //find initial room, and place character there
                var returningRoomID = move.findPlayerRoom();
                if (!returningRoomID) {
                    returningRoomID = newGame();
                }
                var cont = function () {
                    display.animate();
                }
                move.moveTo(returningRoomID, context, cont);
                $('#input').focus();
            });
        });

        this.post('#/story/command', function () {
            var context = this;
            var command = this.params.command;
            command = command.toLowerCase();
            command = command.split(' ');
            $('#input').val("");
            display.clear();

            //to simplify move command case
            if (command[0] === "move") {
                command[0] = command[1];
            }
            
            var cont = function() {
                display.animate()
            }

            switch (command[0]) {
            case "look":
            case "examine":
                look.look(command, roomLogic.currentRoom, context, cont);
                break;
            case "n":
            case "north":
            case "no":
                move.move("north", context, cont);
                break;
            case "s":
            case "south":
            case "so":
                move.move("south", context, cont);
                break;
            case "e":
            case "east":
                move.move("east", context, cont);
                break;
            case "w":
            case "west":
                move.move("west", context, cont);
                break;
            case "nw":
            case "northwest":
                move.move("northwest", context, cont);
                break;
            case "ne":
            case "northeast":
                move.move("northeast", context, cont);
                break;
            case "sw":
            case "southwest":
                move.move("southwest", context, cont);
                break;
            case "se":
            case "southeast":
                move.move("southeast", context, cont);
                break;
            case "u":
            case "up":
                move.move("up", context, cont);
                break;
            case "d":
            case "down":
                move.move("down", context, cont);
                break;
            case "use":
                inventory.use(command, context, cont);
                break;
            case "put":
                inventory.put(command, context, cont);
                break;
            case "drop":
            case "discard":
                inventory.drop(command[1], cont);
                break;
            case "pick":
                //we'll assume here that the user typed "pick up -----"
                if (command[1] === "up") {
                    inventory.take(command[2], context, cont);
                } else {
                    look.errorMessage(cont);
                }
                break;
            case "get":
            case "grab":
            case "take":
            case "yoink":
                inventory.take(command[1], context, cont);
                break;
            case "inventory":
            case "inv":
            case "i":
                inventory.inventory(cont);
                break;
            case "say":
            case "speak":
            case "shout":
            case "yell":
                answer(command[1], context, cont);
                break;
            case "zzz":
            case "z":
            case "wait":
                wait(cont);
                break;
            case "help":
            case "h":
                 display.append("<p>Commands</p>");
                 display.append("<p>Type look, or examine followed by what you want to look at.</p>");
                 display.append("<p>Type up, down, north, south, east, west, northwest, northeast, southeast, southwest to move in that direction</p>");
                 display.append("<p>Type drop, or discard to remove something from you inventory</p>");
                 display.append("<p>Type inventory, inv, or i to look in you inventory</p>");
                 display.append("<p>Type get, pick up, grab, or take followed by the item you want to take</p>");
                 display.append("<p>Type speak, shout, or say followed by what you want to say</p>");
                 cont();
                break;
            default:
                answer(command[0], context, cont);
            break;
            }
        });
    });

    return story;
});