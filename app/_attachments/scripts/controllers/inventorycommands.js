/**
 * inventory commands
 * This file stores all the logic for carrying out inventory manipulations
 * it gets called from the command parser during story mode.
 */
define(['libraries/jquery', 'models/items', 'controllers/login', 'models/rooms', 'controllers/movecommands', 'controllers/rooms', 'controllers/items', 'controllers/tickerLogic'], function ($, items, login, roomSet, move, roomLogic, itemLogic, tickerLogic) {
    //displays the basic error message if a command was not parseable for some reason
    var errorMessage = function () {
        $('#tickerBox').html("");
        $('#tickerBox').append("<p>I'm sorry, I didn't understand that.  Can you try saying it a different way?</p>");
        tickerLogic.animateText($('#displayBox'));
    };

    return {
        take: function (itemName, context) {
            if (!itemLogic.isInCurrentRoom(itemName, roomLogic.currentRoom) && !itemLogic.isInInventory(itemName)) {
                $('#tickerBox').html("");
                $('#tickerBox').append("<p>I'm sorry but I don't see a "+ itemName + " in the vicinity.</p>");
                tickerLogic.animateText($('#displayBox'));
            } else {
                if (itemLogic.isInInventory(itemName)) {
                    $('#tickerBox').html("");
                    $('#tickerBox').append("<p>You're already carrying " + itemName + "</p>");
                    tickerLogic.animateText($('#displayBox'));
                } else {
                    items.getItem(itemName, context, function (view) {
                        if (view.rows.length !== 1) {
                            errorMessage();
                            return;
                        }

                        var itemVals = view.rows[0].value,
                            thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);
                        if (thisItem.sceneryFlag) {
                            $('#tickerBox').html("");
                            $('#tickerBox').append("<p>You can't lift " + thisItem.name + "</p>");
                            tickerLogic.animateText($('#displayBox'));
                        } else {
                            items.moveItem(thisItem.name, roomSet.INVENTORY_ID);
                            $('#tickerBox').html("");
                            $('#tickerBox').append("<p>" + thisItem.name + ": taken.</p>");
                            tickerLogic.animateText($('#displayBox'));
                        }
                    });
                }
            }
        },

        drop: function (itemName) {
            if (!itemLogic.isInInventory(itemName)) {
                $('#tickerBox').html("");
                $('#tickerBox').append("<p>You are not carrying " + itemName + ".</p>");
                tickerLogic.animateText($('#displayBox'));
            } else {
                $('#tickerBox').html("");
                $('#tickerBox').append("<p>" + itemName + ": dropped</p>");
                items.moveItem(itemName, roomLogic.currentRoom._id);
                tickerLogic.animateText($('#displayBox'));
            }
        },

        inventory: function () {
            $('#tickerBox').html("");
            $('#tickerBox').append("<p>Searching through your bag reveals that it contains the following:</p>");

            var i;
            for (i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if (login.currentStudent.itemFlags[i].roomID === roomSet.INVENTORY_ID) {
                    $('#tickerBox').append("<p>" + login.currentStudent.itemFlags[i].itemName + "</p>");
                }
            }
            tickerLogic.animateText($('#displayBox'));
        },

        use: function (command, context) {
            this.useOrPut(command, context);
        },

        put: function (command, context) {
            this.useOrPut(command, context);
        },

        /**
         * This function can be used for put or use;
         */
        useOrPut: function (command, context) {
            var itemName;
            //going to assume the phrase is "use a with b" or "put a in b"
            if (command.length === 4) {
                //takes the "a" out, command should be "use with b" now, which is the dialog we'll try to match it with.
                //also worth nothing this will work for "use on, use in, etc"
                itemName = command.splice(1, 1);
                items.getItem(itemName, context, function (view) {
                    if (view.rows.length !== 1) {
                        errorMessage();
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
                        errorMessage();
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
                errorMessage();
            }
        }
    };
});
