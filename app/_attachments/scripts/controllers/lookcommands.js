/**
 * look commands
 * these are called by the command parser during story mode
 */
define(['libraries/jquery', 'models/items', 'controllers/login', 'controllers/items', 'controllers/display'], function ($, items, login, itemLogic, display) {
    //displays the basic error message if a command was not parseable for some reason
    var errorMessage = function (cont) {
        display.append("I'm sorry, I didn't understand that.  Can you try saying it a different way?");
        cont();
    };

    return {
        //helper function for looking in a particular direction
        lookDirection: function (direction, room, cont) {
            display.append(room.getDirection(direction).description);
            cont();
        },

        //basic 'look' command -- just displays the description of the room you're in
        //gets called when the user types "look _____ _____" or "examine _____"
        look: function (command, room, context, cont) {
            switch (command[1]) {
            case undefined:
            case "around":
            case "":
                //basic look / look around / examine
                display.append(room.name);
                display.append(room.description);
                itemLogic.displayItems(context, cont);
                break;
            case "n":
            case "north":
            case "no":
                this.lookDirection("north", room, cont);
                break;
            case "s":
            case "south":
            case "so":
                this.lookDirection("south", room, cont);
                break;
            case "e":
            case "east":
                this.lookDirection("east", room, cont);
                break;
            case "w":
            case "west":
                this.lookDirection("west", room, cont);
                break;
            case "nw":
            case "northwest":
                this.lookDirection("northwest", room, cont);
                break;
            case "ne":
            case "northeast":
                this.lookDirection("northeast", room, cont);
                break;
            case "sw":
            case "southwest":
                this.lookDirection("southwest", room, cont);
                break;
            case "se":
            case "southeast":
                this.lookDirection("southeast", room, cont);
                break;
            case "u":
            case "up":
                this.lookDirection("up", room, cont);
                break;
            case "d":
            case "down":
                this.lookDirection("down", room, cont);
                break;
            default:
                //look at/in/on item
                if (command.length === 3) {
                    items.getItem(command[2], context, function (view) {
                        var itemVals, thisItem;
                        if (view.rows.length !== 1) {
                            errorMessage(cont);
                        } else {
                            itemVals = view.rows[0].value;
                            thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);
                            itemLogic.checkItemDialogIfInRoom(thisItem, [command[1]], room);
                            cont();
                        }
                    });
                } else if (command.length === 2) {
                    //this is the case where the user typed "examine ______"
                    items.getItem(command[1], context, function (view) {
                        var itemVals, thisItem;
                        if (view.rows.length !== 1) {
                            errorMessage(cont);
                        } else {
                            itemVals = view.rows[0].value;
                            thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);
                            itemLogic.checkItemDialogIfInRoom(thisItem, ["at"], room);
                            cont();
                        }
                    });
                }
            }

        }
    };
});