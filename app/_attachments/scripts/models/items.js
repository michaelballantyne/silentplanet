define(['models/db', 'controllers/login', 'models/students'], function (db, login, students) {
    var Item = function (itemName, dialogs, sceneryFlag) {
        this.name = itemName;
        this.dialogs = dialogs;
        this.sceneryFlag = sceneryFlag; //determines whether an item is scenery (ie, can't be picked up)
        this.record_type = 'item';
    },
        ItemDialog = function (interactWord, description) {
            this.interactWord = interactWord; //is an array 
            this.description = description;
        };

    Item.prototype.getItemDialog = function (word) {
        var i, j;
        for (i = 0; i < this.dialogs.length; i++) {
            for (j = 0; j < this.dialogs[i].interactWord.length; j++) {
                if (this.dialogs[i].interactWord[j] !== word[j]) {
                    break;
                }
                if (j === (this.dialogs[i].interactWord.length - 1)) {
                    return this.dialogs[i];
                }
            }
        }
        return null;
    };

    return {
        PLAYER_MARKER: "player",

        getItems: function (context, callback) {
            context.load('_view/items', {
                json: true,
                cache: false
            }).then(callback);
        },

        getItem: function (itemName, context, callback) {
            context.load('_view/items?key=' + '"' + escape(itemName) + '"', {
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

        moveItem: function (itemName, roomID) {
            var i;

            if (!login.currentStudent.itemFlags) {
                login.currentStudent.itemFlags = [];
            }

            for (i = 0; i < login.currentStudent.itemFlags.length; i++) {
                if (login.currentStudent.itemFlags[i].itemName == itemName) {
                    break;
                }
            }

            login.currentStudent.itemFlags[i] = new students.ItemFlag(itemName, roomID);
        },

        createItem: function (itemName, dialogs, sceneryFlag) {
            return new Item(itemName, dialogs, sceneryFlag);
        }
    };
});