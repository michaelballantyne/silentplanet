define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'models/rooms', 'models/students', 'controllers/login', 'models/items'], function ($, sammy, problemSet, problemReports, roomSet, studentSet, login, items) {
    var currentProblemSet = null,
        currentRoom = null,
        visited = null;

    //various command functions
    //all of these assert that the player is in a room
    
    //basic 'look' command -- just displays the description of the room you're in
    //gets called when the user types "look _____ _____" or "examine _____"
    var look = function(command) {
        var context = this;
        switch(command[1]) {
        case undefined:
        case "around":
        case "":
            //basic look / look around / examine
            $('displayBox').append("<br/>");
            $('displayBox').append(currentRoom.name);
            $('displayBox').append("<br/>");
            $('displayBox').append(currentRoom.description);
            $('displayBox').append("<br/>");
            break;
        case "n":
        case "north":
        case "no":
            lookDirection("north");
            break;
        case "s":
        case "south":
        case "so":
            lookDirection("south");
            break;
        case "e":
        case "east":
            lookDirection("east");
            break;
        case "w":
        case "west":
            lookDirection("west");
            break;
        case "nw":
        case "northwest":
            lookDirection("northwest");
            break;
        case "ne":
        case "northeast":
            lookDirection("northeast");
            break;
        case "sw":
        case "southwest":
            lookDirection("southwest");
            break;
        case "se":
        case "southeast":
            lookDirection("southeast");
            break;
        case "u":
        case "up":
            lookDirection("up");
            break;
        case "d":
        case "down":
            lookDirection("down");
            break;
        default:
            //look at/in/on item
            if(command.length == 3) {
                items.getItem(command[2], context, function(view) {
                    if(view.rows.length !== 1)
                        errorMessage();
                    else {
                        var thisItem = view.rows[0].value;
                        checkItemDialogIfInRoom(thisItem, command[1]);
                    }
                });
            }
            else if(command.length == 2) {
                //this is the case where the user typed "examine ______"
                items.getItem(command[1], context, function(view) {
                    if(view.rows.length !== 1)
                        errorMessage();
                    else {
                        var thisItem = view.rows[0].value;
                        checkItemDialogIfInRoom(thisItem, "at");
                    }
                });
            }
        }
    };  
    
    //checks the given item dialog of a particular item if the item is in the vicinity
    var checkItemDialogIfInRoom = function(item, dialog) {
        if(!isInCurrentRoom(item.name) && !isInInventory(item.name)) {
            $('displayBox').append("<br/>");
            $('displayBox').append("I'm sorry but I don't see a ");
            $('displayBox').append(item.name);
            $('displayBox').append(" in the vicinity.");
            $('displayBox').append("<br/>");
        }
        else {
            $('displayBox').append("<br/>");
            $('displayBox').append(item.getItemDialog(dialog));
            $('displayBox').append("<br/>");
        }
    };
    
    //helper function for looking in a particular direction
    var lookDirection = function(direction) {
        $('displayBox').append("<br/>");
        $('displayBox').append(currentRoom.getDirection(direction).description);
        $('displayBox').append("<br/>");
    };
    
    //determines if the item with the given name is in your inventory
    var isInInventory = function(itemName) {
        for(var i = 0; i < login.currentStudent.itemFlags.length; i++) {
            if(login.currentStudent.itemFlags[i].itemName == itemName) {
                if(login.currentStudent.itemFlags[i].roomID == rooms.INVENTORY_ID) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return false;
    };
    
    //determines if the item with the given name is in the current room
    var isInCurrentRoom = function(itemName) {
        var isInRoom = $.inArray(itemName, currentRoom.items);
        for(var i = 0; i < login.currentStudent.itemFlags.length; i++) {
            if(login.currentStudent.itemFlags[i].itemName == itemName) {
                if(login.currentStudent.itemFlags[i].roomID != currentRoom.roomID) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        return isInRoom;
    };
    
    //basic move command.  Attempts to move in the direction given
    var move = function(direction){
        var context = this;
        
        var directionDialog = currentRoom.getDirection(direction);
        if(!directionDialog.roomID) {
            $('displayBox').append("<br/>");
            $('displayBox').append(directionDialog.description);
            $('displayBox').append("<br/>");
        }
        else {
            while(roomID !== getUpdateRoomState(directionDialog.roomID))
                roomID = getUpdateRoomState(directionDialog.roomID);
            moveTo(roomID);
        }
    };
    
    //needed to separate out for initial move
    var moveTo = function(roomID) {
        rooms.getRoom(getUpdatedRoomState(directionDialog.roomID), context, function(view) {
            if(view.rows.length !== 1) {
                errorMessage();
            }
            else {
                currentRoom = view.rows[0].value;
                if(!visited)
                    visit();
                activateProblem();
            }
        });
    };
    
    //checks to see if the room is in an updated state and returns the most recent state
    var getUpdatedRoomState = function(roomID) {
        for(var i = 0; i < login.currentStudent.roomFlags.length; i++) {
            if(login.currentStudent.roomFlags[i].roomID == roomID) {
                visited = true;
                return login.currentStudent.roomFlags[i].currentStateID;
            }
        }
        visited = false;
        return roomID;
    };
    
    //assumes there is no roomFlag for the current room, adds just the simple one
    var visit = function() {
        login.currentStudent.roomFlags.push(new RoomFlag(currentRoom._id, currentRoom._id));
        var i;
        for(i = 0; i < login.currentStudent.itemFlags.length; i++) {
            if(login.currentStudent.itemFlags[i].name = items.PLAYER_MARKER) {
                break;
            }
        }
        login.currentStudent.itemFlags[i] = new ItemFlag(items.PLAYER_MARKER, currentRoom._id);
        login.updateStudentOnServer();
        look("look");
    };
    
    //displays the basic error message if a command was not parseable for some reason
    var errorMessage = function(){
        $('displayBox').append("<br/>");
        $('displayBox').append("I'm sorry, I didn't understand that.  Can you try saying it a different way?");
        $('displayBox').append("<br/>");
    };
    
    sammy('#main', function () {
        this.get('#/story', function () {
            this.partial('templates/storygame.hb').then(function () {
                //find initial room, and place character there
                $('#input').focus();
            });
        });
        
        this.post('#/story/command', function() {
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
                look(command);
                break;
            case "n":
            case "north":
            case "no":
                move("north");
                break;
            case "s":
            case "south":
            case "so":
                move("south");
                break;
            case "e":
            case "east":
                move("east");
                break;
            case "w":
            case "west":
                move("west");
                break;
            case "nw":
            case "northwest":
                move("northwest");
                break;
            case "ne":
            case "northeast":
                move("northeast");
                break;
            case "sw":
            case "southwest":
                move("southwest");
                break;
            case "se":
            case "southeast":
                move("southeast");
                break;
            case "u":
            case "up":
                move("up");
                break;
            case "d":
            case "down":
                move("down");
                break;
            case "use":
                use(command);
                break;
            case "put":
                put(command);
                break;
            case "drop":
                drop(command);
                break;
            case "pick":
            case "get":
            case "grab":
            case "take":
                pickup(command);
                break;
            case "say":
                answer(command[1]);
            default:
                answer(command[0]);
                break;
            }
        });
    });
});