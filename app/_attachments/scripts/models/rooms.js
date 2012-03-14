define(['models/db'], function (db) {
    var Room = function (roomID, roomName, description, exits, items) {
        this.id = roomID;
        this.name = roomName;
        this.description = description;
        this.exits = exits;
        this.items = items;
        this.record_type = 'room';
    };

    return {
        getRoom: function (context, callback) {
            context.load('/localhost/_design/app/_view/rooms', {
                json: true,
                cache: false
            }).then(callback);
        },

        saveRoom: function (doc, context, callback) {
            db.saveDoc(doc, {
                success: callback
            });
        },

        deleteRoom: function (id, rev, callback) {
            db.removeDoc({
                _id: id,
                _rev: rev
            }, {
                success: callback
            });
        },
        createRoom: function (roomID, roomName, description, exits, items) {
            return new Room(roomID, roomName, description, exits, items);
        }
    };
});


