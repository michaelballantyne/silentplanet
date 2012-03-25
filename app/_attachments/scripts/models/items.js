define(['models/db', 'controllers/login', 'models/students'], function (db, login, students) {
    items.PLAYER_MARKER = "player";
    
    var Item = function (itemName, dialogs, sceneryFlag) {
            this.name = itemName;
            this.dialogs = dialogs;
            this.sceneryFlag = sceneryFlag; //determines whether an item is scenery (ie, can't be picked up)
            this.record_type = 'item';
        };
       
        var ItemDialog = function(interactWord, description) {
            this.interactWord = interactWord; //is an array 
            this.description = description;
        };
        
        Item.prototype.getItemDialog = function(word) {
            for(var i = 0; i < exits.length; i++) {
                if(this.dialogs[i].interactWord[0] == word)
                    return this.dialogs[i];
            }
        };

    return {
        getItems: function (context, callback) {
            context.load('/localhost/_design/app/_view/items', {
                json: true,
                cache: false
            }).then(callback);
        },
        
        getItem: function (itemName, context, callback) {
            context.load('/localhost/_design/app/_view/items?key=' + '"' + escape(itemName) + '"', {
                json: true,
                cache: false
            }).then(callback);
        },

        saveItem: function (doc, context, callback) {
            db.saveDoc(doc, {
                success: callback
            });
        },

        deleteItem: function (id, rev, callback) {
            db.removeDoc({
                _id: id,
                _rev: rev
            }, {
                success: callback
            });
        },

        moveItem: function (itemID, roomID) {
            var i;

            if (login.currentStudent.itemFlags === null) {
                login.currentStudent.itemFlags = [];
            }

            for (i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if (login.currentStudent.itemFlags[i].itemID === itemID) {
                    break;
                }
            }
            
            login.currentStudent.itemFlags[i] = new students.ItemFlag(itemID, roomID);
        }
    };
});