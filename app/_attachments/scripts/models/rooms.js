define(['libraries/jquery', 'models/db', 'controllers/login', 'models/students'], function ($, db, login, studentSet) {
    var Room = function (roomID, roomName, description, exits, items, problemDescription, problemWrapUp, nextState) {
        this._id = roomID;
        this.name = roomName;
        this.description = description;
        this.exits = exits; //array of maps of directions to rooms with look descriptions
        this.items = items; //array of item names
        this.problemDescription = problemDescription;
        this.problemWrapUp = problemWrapUp;
        this.nextState = nextState;
        this.record_type = 'room';
    },

        DirectionDialog = function (direction, roomID, description) {
            this.direction = direction;
            this.roomID = roomID;
            this.description = description;
        };

    Room.prototype.getDirection = function (direction) {
        var exits, i;
        if (!this.exits) {
            exits = [];
        }
        for (i = 0; i < this.exits.length; i++) {
            if (this.exits[i].direction === direction) {
                return this.exits[i];
            }
        }
    };

    return {
        FIRST_ROOM_ID: "room1",
        INVENTORY_ID: "room0",
        getRoom: function (id, context, callback) {
            context.load('_view/rooms?key=' + '"' + escape(id) + '"', {
                json: true,
                cache: false
            }).then(callback);
        },

        getRooms: function (context, callback) {
            context.load('_view/rooms', {
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
        createRoom: function (roomID, roomName, description, exits, items, problemDescription, problemWrapUp, nextState) {
            return new Room(roomID, roomName, description, exits, items, problemDescription, problemWrapUp, nextState);
        },

        addOrUpdateRoomFlag: function (roomID, stateID) {
            var i, roomFlags;
            if (!login.currentStudent.roomFlags) {
                roomFlags = [];
            }
            for (i = 0; i < login.currentStudent.roomFlags.length; i++) {
                if (login.currentStudent.roomFlags[i].roomID == roomID) {
                    break;
                }
            }
            login.currentStudent.roomFlags[i] = new studentSet.RoomFlag(roomID, stateID);
        }
    };
});


