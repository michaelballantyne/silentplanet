/**
 * inventory commands
 * This file stores all the logic for carrying out inventory manipulations
 * it gets called from the command parser during story mode.
 */
define(['libraries/jquery', 'models/items', 'controllers/login', 'models/rooms', 'controllers/movecommands', 'controllers/rooms', 'controllers/items', 'controllers/display'], function ($, items, login, roomSet, move, roomLogic, itemLogic, display) {
    //displays the basic error message if a command was not parseable for some reason
    var errorMessage = function (cont) {
        display.append("I'm sorry, I didn't understand that.  Can you try saying it a different way?");
        cont();
    };

    return {
        take: function (itemName, context, cont) {
            if (!itemLogic.isInCurrentRoom(itemName, roomLogic.currentRoom) && !itemLogic.isInInventory(itemName)) {
                display.append("I'm sorry but I don't see a "+ itemName + " in the vicinity.");
            } else {
                if (itemLogic.isInInventory(itemName)) {
                    display.append("You're already carrying " + itemName);
                } else {
                    items.getItem(itemName, context, function (view) {
                        if (view.rows.length !== 1) {
                            errorMessage(cont);
                            return;
                        }

                        var itemVals = view.rows[0].value,
                            thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);
                        if (thisItem.sceneryFlag) {
                            display.append("You can't lift " + thisItem.name);
                        } else {
                            items.moveItem(thisItem.name, roomSet.INVENTORY_ID);
                            display.append(thisItem.name + ": taken.");
                        }
                    });
                }
            }
        },

        drop: function (itemName, cont) {
            if (!itemLogic.isInInventory(itemName)) {
                display.append("You are not carrying " + itemName + ".");
            } else {
                display.append(itemName + ": dropped");
                items.moveItem(itemName, roomLogic.currentRoom._id);
            }
        },

        inventory: function (cont) {
            display.append("Searching through your bag reveals that it contains the following:");

            var i;
            for (i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if (login.currentStudent.itemFlags[i].roomID === roomSet.INVENTORY_ID) {
                    display.append(login.currentStudent.itemFlags[i].itemName);
                }
            }
            
            cont();
        },

        use: function (command, context, cont) {
            this.useOrPut(command, context, cont);
        },

        put: function (command, context, cont) {
            this.useOrPut(command, context, cont);
        },

        /**
         * This function can be used for put or use;
         */
        useOrPut: function (command, context, cont) {
            var itemName;
            //going to assume the phrase is "use a with b" or "put a in b"
            if (command.length === 4) {
                //takes the "a" out, command should be "use with b" now, which is the dialog we'll try to match it with.
                //also worth nothing this will work for "use on, use in, etc"
                itemName = command.splice(1, 1);
                items.getItem(itemName, context, function (view) {
                    if (view.rows.length !== 1) {
                        errorMessage(cont);
                    } else {
                        var itemVals = view.rows[0].value,
                            thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);
                        if (itemLogic.checkItemDialogIfInRoom(thisItem, command, roomLogic.currentRoom)) {
                            //same as below, we may want some more specific coding for usage/puttage?
                            //so this is a stub for the time being

                        }
                    }
                });

            //here we assume the phrase is "use a", so we'll be looking for the dialog "use"
            } else if (command.length === 2) {
                itemName = command.pop(); //makes itemName "a", and leaves command as "use"
                items.getItem(itemName, context, function (view) {
                    if (view.rows.length !== 1) {
                        errorMessage(cont);
                    } else {
                        var itemVals = view.rows[0].value,
                            thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);
                        if (itemLogic.checkItemDialogIfInRoom(thisItem, command, roomLogic.currentRoom)) {
                            //maybe move to some specific processing for items that can be used here?
                            //not really sure?
                        }
                    }
                });
            } else {
                //we don't recognize other uses of "use" or "put"
                errorMessage(cont);
            }
        }
    };
});
