define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'models/rooms', 'models/students', 'controllers/login', 'models/items', 'controllers/inventorycommands', 'controllers/lookcommands', 'controllers/movecommands', 'controllers/problems', 'controllers/rooms', 'controllers/display'], function ($, sammy, problemSet, problemReports, roomSet, studentSet, login, items, inventory, look, move, probLogic, roomLogic, display) {
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
    answer = function (response, context) {
        //first check to see if there is actually a problem description
        if (roomLogic.currentRoom.problemDescription) {
            var correct = response.toUpperCase() === probLogic.currentProblem.answer.toUpperCase();
            //decide what to do if correct vs. incorrect
            if (correct) {
                display.append("Correct!");
                display.append(roomLogic.currentRoom.problemWrapUp);
                roomSet.addOrUpdateRoomFlag(roomLogic.currentRoom._id, roomLogic.currentRoom.nextState);
                problemReports.addOrUpdateProblemReport(probLogic.currentProblem._id, correct, context);
                probLogic.currentProblem = null;
                move.moveTo(roomLogic.currentRoom.nextState, context);
            } else {
                display.append("Your answer was incorrect!");
                display.append(probLogic.currentProblem.problem);
                problemReports.addOrUpdateProblemReport(probLogic.currentProblem._id, correct, context);
            }
        } else {
            errorMessage();
        }
    },

    wait = function () {
        display.append("You pace back and forth for a few minutes.");
    },
     errorMessage = function () {
        display.append("I'm sorry, I didn't understand that.  Can you try saying it a different way? Type help for a list of words I understand.");
    };



    sammy('#main', function () {
        this.get('#/story', function () {
            var context = this;
            this.partial('templates/storygame.hb').then(function () {
                //find initial room, and place character there
                display.clear();
                var returningRoomID = move.findPlayerRoom();
                if (!returningRoomID) {
                    returningRoomID = newGame();
                }
                
                move.moveTo(returningRoomID, context);
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

            switch (command[0]) {
            case "look":
            case "examine":
                look.look(command, roomLogic.currentRoom, context);
                break;
            case "n":
            case "north":
            case "no":
                move.move("north", context);
                break;
            case "s":
            case "south":
            case "so":
                move.move("south", context);
                break;
            case "e":
            case "east":
                move.move("east", context);
                break;
            case "w":
            case "west":
                move.move("west", context);
                break;
            case "nw":
            case "northwest":
                move.move("northwest", context);
                break;
            case "ne":
            case "northeast":
                move.move("northeast", context);
                break;
            case "sw":
            case "southwest":
                move.move("southwest", context);
                break;
            case "se":
            case "southeast":
                move.move("southeast", context);
                break;
            case "u":
            case "up":
                move.move("up", context);
                break;
            case "d":
            case "down":
                move.move("down", context);
                break;
            case "use":
                inventory.use(command, context);
                break;
            case "put":
                inventory.put(command, context);
                break;
            case "drop":
            case "discard":
                inventory.drop(command[1]);
                break;
            case "pick":
                //we'll assume here that the user typed "pick up -----"
                if (command[1] === "up") {
                    inventory.take(command[2], context);
                } else {
                    look.errorMessage();
                }
                break;
            case "get":
            case "grab":
            case "take":
            case "yoink":
                inventory.take(command[1], context);
                break;
            case "inventory":
            case "inv":
            case "i":
                inventory.inventory();
                break;
            case "say":
            case "speak":
            case "shout":
            case "yell":
                command.shift();
                display.append("You say '" + command.join(" ") + "'. In response, all you hear is the echo of your own voice in the distance.");
                break;
            case "zzz":
            case "z":
            case "wait":
                wait();
                break;
            case "help":
            case "h":
                 display.append("Commands:");
                 display.append("Type look, or examine followed by what you want to look at");
                 display.append("Type up, down, north, south, east, west, northwest, northeast, southeast, southwest to move in that direction");
                 display.append("Type drop, or discard to remove something from you inventory");
                 display.append("Type inventory to look in your inventory");
                 display.append("Type get, pick up, grab, or take followed by the item you want to take");
                 display.append("Type speak, shout, or say followed by what you want to say");
                break;
            default:
                answer(this.params.command, context);
            break;
            }
        });
    });

    return story;
});