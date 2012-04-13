/**
 * 
 */
define(['models/items', 'controllers/rooms', 'controllers/login', 'models/rooms', 'libraries/jquery', 'controllers/tickerLogic'], function (items, roomLogic, login, roomSet, $, tickerLogic) {

    //displays the basic error message if a command was not parseable for some reason
    var errorMessage = function () {
        $('#tickerBox').html("");
        $('#tickerBox').append("<p>I'm sorry, I didn't understand that.  Can you try saying it a different way?</p>");
        tickerLogic.animateText($('#displayBox'));
    };

    return {
        //determines if the item with the given name is in your inventory
        isInInventory: function (itemName) {
            var i;
            for (i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if (login.currentStudent.itemFlags[i].itemName === itemName) {
                    if (login.currentStudent.itemFlags[i].roomID === roomSet.INVENTORY_ID) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        },

        //determines if the item with the given name is in the current room
        isInCurrentRoom: function (itemName, room) {
            var i,
                isInRoom = ($.inArray(itemName, room.items) >= 0);
            for (i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if (login.currentStudent.itemFlags[i].itemName === itemName) {
                    if (login.currentStudent.itemFlags[i].roomID !== room._id) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
            return isInRoom;
        },

        //checks the given item dialog of a particular item if the item is in the vicinity
        checkItemDialogIfInRoom: function (item, dialog, room) {
            if (!this.isInCurrentRoom(item.name, room) && !this.isInInventory(item.name)) {
                $('#tickerBox').html("");
                $('#tickerBox').append("<p>I'm sorry but I don't see a " + item.name + " in the vicinity.</p>");
                return false;
            } else {
                var itemDialog = item.getItemDialog(dialog);
                if (itemDialog) {
                    $('#tickerBox').html("");
                    $('#tickerBox').append("<p>" + itemDialog.description + "</p>");
                    return true;
                } else {
                    errorMessage();
                    return false;
                }
            }
        },

        //display each of the items
        displayItems: function (context) {
            var itemLogic = this;
            items.getItems(context, function (view) {
                var i, itemVals, thisItem;
                for (i = 0; i < view.rows.length; i++) {
                    itemVals = view.rows[i].value;
                    thisItem = items.createItem(itemVals.name, itemVals.dialogs, itemVals.sceneryFlag);

                    if (itemLogic.isInCurrentRoom(thisItem.name, roomLogic.currentRoom)) {
                        $('#tickerBox').append("<p>There is a " + thisItem.name + " here.</p>");
                    }
                }
            });
        }
    };
});