/**
 * look commands
 * these are called by the command parser during story mode
 */
define(['libraries/jquery', 'models/items', 'controllers/login', 'controllers/items', 'controllers/display', 'controllers/problems', 'controllers/rooms'], function ($, items, login, itemLogic, display, probLogic, rooms) {
    //displays the basic error message if a command was not parseable for some reason
    var errorMessage = function () {
        display.append("I'm sorry, I didn't understand that.  Can you try saying it a different way?");
    };

    return {
        //helper function for looking in a particular direction
        lookDirection: function (direction, room) {
            display.append(room.getDirection(direction).description);
        },

        //basic 'look' command -- just displays the description of the room you're in
        //gets called when the user types "look _____ _____" or "examine _____"
        look: function (command, room, context) {
            switch (command[1]) {
            case undefined:
            case "around":
            case "":
                //basic look / look around / examine
                display.append(room.name);
                display.append(room.description);
                
                var callback = function () {
                    probLogic.activateProblem(rooms.currentRoom.problemDescription, context)
                }
                
                itemLogic.displayItems(context, callback);
                
                break;
            case "n":
            case "north":
            case "no":
                this.lookDirection("north", room);
                break;
            case "s":
            case "south":
            case "so":
                this.lookDirection("south", room);
                break;
            case "e":
            case "east":
                this.lookDirection("east", room);
                break;
            case "w":
            case "west":
                this.lookDirection("west", room);
                break;
            case "nw":
            case "northwest":
                this.lookDirection("northwest", room);
                break;
            case "ne":
            case "northeast":
                this.lookDirection("northeast", room);
                break;
            case "sw":
            case "southwest":
                this.lookDirection("southwest", room);
                break;
            case "se":
            case "southeast":
                this.lookDirection("southeast", room);
                break;
            case "u":
            case "up":
                this.lookDirection("up", room);
                break;
            case "d":
            case "down":
                this.lookDirection("down", room);
                break;
            default:
                //look at/in/on item
                if (command.length === 3) {
                    items.getItem(command[2], context, function (view) {
                        var itemVals, thisItem;
                        if (view.rows.length !== 1) {
                            errorMessage();
                        } else {
                            itemVals = view.rows[0].value;
                            thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);
                            itemLogic.checkItemDialogIfInRoom(thisItem, [command[1]], room);
                        }
                    });
                } else if (command.length === 2) {
                    //this is the case where the user typed "examine ______"
                    items.getItem(command[1], context, function (view) {
                        var itemVals, thisItem;
                        if (view.rows.length !== 1) {
                            errorMessage();
                        } else {
                            itemVals = view.rows[0].value;
                            thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);
                            itemLogic.checkItemDialogIfInRoom(thisItem, ["at"], room);
                        }
                    });
                }
            }

        }
    };
});