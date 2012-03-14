define(['models/db', 'controllers/login'], function (db, login) {
    var Item = function (itemID, itemName, dialogs) {
            this.id = itemID;
            this.name = itemName;
            this.dialogs = dialogs;
            this.record_type = 'item';
        };

    return {
        getItem: function (context, callback) {
            context.load('/localhost/_design/app/_view/items', {
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
            login.currentStudent.itemFlags[i].itemID = itemID;
            login.currentStudent.itemFlags[i].roomID = roomID;
        }
    };
});