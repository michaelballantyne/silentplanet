/**
 * move commands
 * these are called by the command parser during story mode
 * basically just manage movement from one scene to the next
 */

define(['libraries/jquery', 'models/items', 'controllers/login', 'models/rooms', 'models/students', 'models/problems', 'controllers/lookcommands', 'controllers/problems', 'controllers/items', 'controllers/rooms', 'controllers/display'], function ($, items, login, roomSet, studentSet, problemSet, look, probLogic, itemLogic, roomLogic, display) {
    var i, moveCommands = {},
    visited = null,

    //assumes there is no roomFlag for the current room, adds just the simple one
    visit = function (context) {
        roomSet.addOrUpdateRoomFlag(roomLogic.currentRoom._id, roomLogic.currentRoom._id);
        login.updateStudentOnServer();
        look.look(["look"], roomLogic.currentRoom, context);
    },

    //checks to see if the room is in an updated state and returns the most recent state
    getUpdatedRoomState = function (roomID) {
        for (i = 0; i < login.currentStudent.roomFlags.length; i++) {
            if (login.currentStudent.roomFlags[i].roomID === roomID) {
                visited = true;
                return login.currentStudent.roomFlags[i].currentStateID;
            }
        }
        visited = false;
        return roomID;
    },

    //displays the basic error message if a command was not parseable for some reason
    errorMessage = function () {
        display.append("I'm sorry, I didn't understand that.  Can you try saying it a different way?");
    };

    moveCommands.findPlayerRoom = function () {
        if (login.currentStudent.itemFlags.length === 0) {
            return null;
        }
        var i;
        for (i = 0; i < login.currentStudent.itemFlags.length; i++) {
            if (login.currentStudent.itemFlags[i].itemName === items.PLAYER_MARKER) {
                return login.currentStudent.itemFlags[i].roomID;
            }
        }
        //If user gets here there's some kind of error
        display.append("Error!  The player is in limbo!");
    };

    //needed to separate out for initial move
    moveCommands.moveTo = function (roomID, context) {
        roomID = getUpdatedRoomState(roomID);
        while (roomID !== getUpdatedRoomState(roomID)) {
            roomID = getUpdatedRoomState(roomID);
        }
        roomSet.getRoom(roomID, context, function (view) {
            if (view.rows.length !== 1) {
                errorMessage();
            } else {
                var roomVals = view.rows[0].value;
                roomLogic.currentRoom = roomSet.createRoom(roomVals._id, roomVals.name, roomVals.description, roomVals.exits, roomVals.items, roomVals.problemDescription, roomVals.problemWrapUp, roomVals.nextState);
                items.moveItem(items.PLAYER_MARKER, roomLogic.currentRoom._id);
                
                var activateCallback = function () {
                    probLogic.activateProblem(roomLogic.currentRoom.problemDescription, context);
                }
                
                if (!visited) {
                    visit(context);
                } else {
                    display.append(roomLogic.currentRoom.name);
                    itemLogic.displayItems(context, activateCallback);
                }
            }
        });
    };

    //basic move command.  Attempts to move in the direction given
    moveCommands.move = function (direction, context) {
        var directionDialog = roomLogic.currentRoom.getDirection(direction);
        if (!directionDialog.roomID) {
            display.append(directionDialog.description);
        } else {
            this.moveTo(directionDialog.roomID, context);
        }
    };
    return moveCommands;
});
