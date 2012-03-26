/**
 * move commands
 * these are called by the command parser during story mode
 * basically just manage movement from one scene to the next
 */

define(['libraries/jquery', 'models/items', 'controllers/login', 'models/rooms', 'models/students', 'models/problems'], function($, items, login, roomSet, studentSet, problemSet) {
    
    var moveCommands = {},
    visited = null,
    
    //assumes there is no roomFlag for the current room, adds just the simple one
        visit = function() {
        roomSet.addOrUpdateRoomFlag(moveCommands.currentRoom._id,moveCommands.currentRoom._id);
        var i;
        for(i = 0; i < login.currentStudent.itemFlags.length; i++) {
            if(login.currentStudent.itemFlags[i].name = items.PLAYER_MARKER) {
                break;
            }
        }
        login.currentStudent.itemFlags[i] = new studentSet.ItemFlag(items.PLAYER_MARKER,moveCommands.currentRoom._id);
        login.updateStudentOnServer();
        look.look(["look"],moveCommands.currentRoom);
    },
    
    //checks to see if the room is in an updated state and returns the most recent state
    getUpdatedRoomState = function(roomID) {
        for(var i = 0; i < login.currentStudent.roomFlags.length; i++) {
            if(login.currentStudent.roomFlags[i].roomID == roomID) {
                visited = true;
                return login.currentStudent.roomFlags[i].currentStateID;
            }
        }
        visited = false;
        return roomID;
    },
    
    activateProblem = function(context) {
        if(!moveCommands.currentRoom.problemDescription)
            return;
        $('#displayBox').append("<br/>");
        $('#displayBox').append(moveCommands.currentRoom.problemDescription);
        $('#displayBox').append("<br/>");
        problemSet.pullRandomProblem(context);
    };
    
        moveCommands.currentRoom = null,
        moveCommands.findPlayerRoom = function() {
            if(login.currentStudent.itemFlags.length == 0)
                return null;
            var i;
            for(i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if(login.currentStudent.itemFlags[i].itemName == items.PLAYER_MARKER) {
                    return login.currentStudent.itemFlags[i].roomID;
                }
            }
            //If user gets here there's some kind of error
            $('#displayBox').append("<br/>");
            $('#displayBox').append("Error!  The player is in limbo!");
            $('#displayBox').append("<br/>");
        },
  
        //needed to separate out for initial move
        moveCommands.moveTo = function(roomID, context) {
            roomID = getUpdatedRoomState(roomID);
            while(roomID !== getUpdatedRoomState(roomID))
                roomID = getUpdatedRoomState(roomID);
            roomSet.getRoom(roomID, context, function(view) {
                if(view.rows.length !== 1) {
                    look.errorMessage();
                }
                else {
                    var roomVals = view.rows[0].value;
                   moveCommands.currentRoom = roomSet.createRoom(roomVals._id, roomVals.name, roomVals.description, roomVals.exits, roomVals.items, roomVals.problemDescription, roomVals.problemWrapUp, roomVals.nextState);
                    if(!visited)
                        visit();
                    activateProblem(context);
                }
            });
        },
        
        //basic move command.  Attempts to move in the direction given
        moveCommands.move = function(direction, context){
            var directionDialog = moveCommands.currentRoom.getDirection(direction);
            if(!directionDialog.roomID) {
                $('#displayBox').append("<br/>");
                $('#displayBox').append(directionDialog.description);
                $('#displayBox').append("<br/>");
            }
            else {
                moveTo(directionDialog.roomID, context);
            }
        }
    return moveCommands;
});
