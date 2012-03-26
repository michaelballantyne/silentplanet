/**
 * inventory commands
 * This file stores all the logic for carrying out inventory manipulations
 * it gets called from the command parser during story mode.
 */
define(['libraries/jquery', 'models/items', 'controllers/login', 'models/rooms', 'controllers/movecommands', 'controllers/rooms', 'controllers/items'], function($, items, login, roomSet, move, roomLogic, itemLogic) {
    
    //displays the basic error message if a command was not parseable for some reason
    var errorMessage = function() {
        $('#displayBox').append("<br/>");
        $('#displayBox').append("I'm sorry, I didn't understand that.  Can you try saying it a different way?");
        $('#displayBox').append("<br/>");
    };
    
    return {
        take: function(itemName, context) {
            if(!itemLogic.isInCurrentRoom(itemName, roomLogic.currentRoom) && !itemLogic.isInInventory(itemName)) {
                $('#displayBox').append("<br/>");
                $('#displayBox').append("I'm sorry but I don't see a ");
                $('#displayBox').append(itemName);
                $('#displayBox').append(" in the vicinity.");
                $('#displayBox').append("<br/>");
            }
            else {
                if(itemLogic.isInInventory(itemName)) {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("You're already carrying ");
                    $('#displayBox').append(itemName);
                    $('#displayBox').append("<br/>");
                }
                else {
                    items.getItem(itemName, context, function(view) {
                        if(view.rows.length !== 1) {
                            look.errorMessage();
                            return;
                        }
                        
                        var itemVals = view.rows[0].value;
                        var thisItem = items.createItem(itemVals.itemName, itemVals.dialogs, itemVals.sceneryFlag);
                        if(thisItem.sceneryFlag) {
                            $('#displayBox').append("<br/>");
                            $('#displayBox').append("You can't lift ");
                            $('#displayBox').append(thisItem.name);
                            $('#displayBox').append("<br/>");
                        }
                        else {
                            items.moveItem(thisItem, roomSet.INVENTORY_ID);
                            $('#displayBox').append("<br/>");
                            $('#displayBox').append(thisItem.name);
                            $('#displayBox').append(": taken.");
                            $('#displayBox').append("<br/>");
                        }
                    });
                }
            }
        },
        
        drop: function(itemName) {
            if(!itemLogic.isInInventory(itemName)) {
                $('#displayBox').append("<br/>");
                $('#displayBox').append("You are not carrying ");
                $('#displayBox').append(itemName);
                $('#displayBox').append(".");
                $('#displayBox').append("<br/>");
            }
            else {
                $('#displayBox').append("<br/>");
                $('#displayBox').append(itemName);
                $('#displayBox').append(": dropped");
                $('#displayBox').append("<br/>");
                items.moveItem(itemName, roomLogic.currentRoom._id);
            }
        },
        
        inventory: function() {
            $('#displayBox').append("<br/>");
            $('#displayBox').append("Searching through your bag reveals that it contains the following:");
            $('#displayBox').append("<br/>");
            
            var i;
            for(i = 0; i < login.currentStudent.itemFlags; i++) {
                if(login.currentStudent.itemFlags[i].roomID == roomSet.INVENTORY_ID) {
                    $('#displayBox').append(login.currentStudent.itemFlags[i].itemName);
                    $('#displayBox').append("<br/>");
                }
            }
        },
        
        use: function(command, context) {
            this.useOrPut(command, context);
        },
        
        put: function(command, context) {
            this.useOrPut(command, context);
        },
        
        /**
         * This function can be used for put or use;
         */
        useOrPut: function(command, context) {
            
            //going to assume the phrase is "use a with b" or "put a in b"
            if(command.length == 3) {
                
                //takes the "a" out, command should be "use with b" now, which is the dialog we'll try to match it with.
                //also worth nothing this will work for "use on, use in, etc"
                var itemName = command.splice(1,1);
                items.getItem(itemName, context, function() {
                    if(view.rows.length !== 1) {
                        errorMessage();
                    }
                    else {
                        var itemVals = view.rows[0].value;
                        var thisItem = items.createItem(itemVals.itemName, itemVals.dialogs, itemVals.sceneryFlag);
                        if(itemLogic.checkItemDialogIfInRoom(thisItem, command, roomLogic.currentRoom)) {
                            //same as below, we may want some more specific coding for usage/puttage?
                            //so this is a stub for the time being
                        }
                    }
                });
            }
            
            //here we assume the phrase is "use a", so we'll be looking for the dialog "use"
            else if(command.length == 2) {
                var itemName = command.pop(); //makes itemName "a", and leaves command as "use"
                items.getItem(itemName, context, function() {
                    if(view.rows.length !== 1) {
                        errorMessage();
                    }
                    else {
                        var itemVals = view.rows[0].value;
                        var thisItem = items.createItem(itemVals.itemName, itemVals.dialogs, itemVals.sceneryFlag);
                        if(itemLogic.checkItemDialogIfInRoom(thisItem, command, roomLogic.currentRoom)) {
                            //maybe move to some specific processing for items that can be used here?
                            //not really sure?
                        }
                    }
                });
            }
            else {
                //we don't recognize other uses of "use" or "put"
                errorMessage();
            }
        }
    };
});
