define(['models/db'], function (db) {
    
    rooms.FIRST_ROOM_ID = "room1";
    rooms.INVENTORY_ID = "room0";
    
    var Room = function (roomID, roomName, description, exits, items, problemDescription) {
        this._id = roomID;
        this.name = roomName;
        this.description = description;
        this.exits = exits; //array of maps of directions to rooms with look descriptions
        this.items = items; //array of item names
        this.problemDescription = problemDescription;
        this.record_type = 'room';
    };
    
    var DirectionDialog = function(direction, roomID, description) {
        this.direction = direction;
        this.roomID = roomID;
        this.description = description;
    };
    
    Room.prototype.getDirection = function(direction) {
        for(var i = 0; i < exits.length; i++) {
            if(this.exits[i].direction == direction)
                return this.exits[i];
        }
    };

    return {
        getRoom: function (id, context, callback) {
            context.load('/localhost/_design/app/_view/students?key=' + '"' + escape(id) + '"', {
                json: true,
                cache: false
            }).then(callback);
        },
        
        getRooms: function (context, callback) {
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


