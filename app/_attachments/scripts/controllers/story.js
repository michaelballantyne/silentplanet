define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'models/rooms', 'models/students', 'controllers/login', 'models/items', 'controllers/inventorycommands', 'controllers/lookcommands', 'controllers/movecommands', 'controllers/problems', 'controllers/rooms'], function ($, sammy, problemSet, problemReports, roomSet, studentSet, login, items, inventory, look, move, probLogic, roomLogic) {
    var story = {},
        currentProblemSet = null,
        context = null,
        newGame = function() {
            login.currentStudent.itemFlags = [];
            login.currentStudent.roomFlags = [];
            login.updateStudentOnServer();
            displayIntro();
            return roomSet.FIRST_ROOM_ID;
        },

    //the answer command -- basically just checks to see if the current obstacle has been cleared.
        answer = function (response) {
            //first check to see if there is actually a problem description
            if (roomLogic.currentRoom.problemDescription) {
                var correct = response.toUpperCase() === probLogic.currentProblem.answer.toUpperCase();
                //decide what to do if correct vs. incorrect
                if (correct) {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Correct!");
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append(roomLogic.currentRoom.problemWrapUp);
                    roomSet.addOrUpdateRoomFlag(roomLogic.currentRoom._id,roomLogic.currentRoom.nextState);
                    move.moveTo(roomLogic.currentRoom.nextState, context);
                    problemReports.addOrUpdateProblemReport(probLogic.currentProblem._id, correct, context);
                    probLogic.currentProblem = null;
                } else {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Your answer was incorrect!");
                    $('#displayBox').append("<br/>");
                    problemReports.addOrUpdateProblemReport(probLogic.currentProblem._id, correct, context);
                }
            }
        },

        wait = function () {
            $('#displayBox').append("<br/>");
            $('#displayBox').append("You pace back and forth for a few minutes.");
            $('#displayBox').append("<br/>");
        },

        // TODO replace this with intro from John eventually
        displayIntro = function () {
            $('#displayBox').append("Greetings ");
            $('#displayBox').append(login.currentStudent.username);
            $('#displayBox').append("<br/>");
            $('#displayBox').append("You are about to embark on a journey of epic proportions.");
            $('#displayBox').append("<br/>");
            $('#displayBox').append("Prepare thyself!");
            $('#displayBox').append("<br/>");
        };

    sammy('#main', function () {
        this.get('#/story', function () {
            context = this;
            this.partial('templates/storygame.hb').then(function () {
                //find initial room, and place character there
                var returningRoomID = move.findPlayerRoom();
                if (!returningRoomID) {
                    returningRoomID = newGame();
                }
                move.moveTo(returningRoomID, context);
                $('#input').focus();
            });
        });

        this.post('#/story/command', function() {
            context = this;
            var command = this.params.command;
            command = command.toLowerCase();
            command = command.split(' ');
            $('#input').val("");

            //to simplify move command case
            if (command[0] === "move") {
                command[0] = command[1];
            }

            switch(command[0]) {
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
                if(command[1] == "up")
                    inventory.take(command[2], context);
                else
                    look.errorMessage();
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
                answer(command[1]);
                break;
            case "zzz":
            case "z":
            case "wait":
                wait();
                break;
            default:
                answer(command[0]);
                break;
            }
        });
    });

    return story;
});