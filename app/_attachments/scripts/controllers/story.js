define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'models/rooms', 'models/students', 'controllers/login', 'models/items', 'controllers/inventorycommands', 'controllers/lookcommands', 'controllers/movecommands'], function ($, sammy, problemSet, problemReports, roomSet, studentSet, login, items, inventory, look, move) {
    var story = {},
        currentProblemSet = null,
        context = null;
    
    var newGame = function() {
        login.currentStudent.itemFlags = [];
        login.currentStudent.roomFlags = [];
        login.updateStudentOnServer();
        displayIntro();
        return roomSet.FIRST_ROOM_ID;
    };
    
    // TODO replace this with intro from John eventually
    var displayIntro = function() {
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
                if(!returningRoomID)
                    returningRoomID = newGame();
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
            if(command[0] == "move")
                command[0] = command[1];
            
            switch(command[0]) {
            case "look":
            case "examine":
                look.look(command, move.currentRoom);
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
                inventory.use(command);
                break;
            case "put":
                inventory.put(command);
                break;
            case "drop":
            case "discard":
                inventory.drop(command[1]);
                break;
            case "pick":
                //we'll assume here that the user typed "pick up -----"
                if(command[1] == "up")
                    inventory.take(command[2]);
                else
                    look.errorMessage();
                break;
            case "get":
            case "grab":
            case "take":
            case "yoink":
                inventory.take(command[1]);
                break;
            case "say":
            case "speak":
            case "shout":
            case "yell":
                answer(command[1]);
            default:
                answer(command[0]);
                break;
            }
        });
    });
    
    return story;
});