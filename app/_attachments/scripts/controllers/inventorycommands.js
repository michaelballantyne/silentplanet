/**
 * inventory commands
 * This file stores all the logic for carrying out inventory manipulations
 * it gets called from the command parser during story mode.
 */
define(['libraries/jquery', 'models/items', 'controllers/login', 'models/rooms'], function($, items, login, roomSet) {
    return {
      //determines if the item with the given name is in your inventory
      isInInventory: function(itemName) {
            for(var i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if(login.currentStudent.itemFlags[i].itemName == itemName) {
                    if(login.currentStudent.itemFlags[i].roomID == roomSet.INVENTORY_ID) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            return false;
        },
        
        //determines if the item with the given name is in the current room
        isInCurrentRoom:function(itemName, room) {
            var isInRoom = $.inArray(itemName, room.items);
            for(var i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if(login.currentStudent.itemFlags[i].itemName == itemName) {
                    if(login.currentStudent.itemFlags[i].roomID != room._id) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            return isInRoom;
        },
        
        //checks the given item dialog of a particular item if the item is in the vicinity
        checkItemDialogIfInRoom: function(item, dialog, room) {
            if(!this.isInCurrentRoom(item.name, room) && !this.isInInventory(item.name)) {
                $('#displayBox').append("<br/>");
                $('#displayBox').append("I'm sorry but I don't see a ");
                $('#displayBox').append(item.name);
                $('#displayBox').append(" in the vicinity.");
                $('#displayBox').append("<br/>");
            }
            else {
                $('#displayBox').append("<br/>");
                $('#displayBox').append(item.getItemDialog(dialog));
                $('#displayBox').append("<br/>");
            }
        }
    };
});
