require(['models/model'], function(model) {
    model.Room = function(roomID, roomName, description, exits, items) {
        this.id = roomID;
        this.name = roomName;
        this.description = description;
        this.exits = exits;
        this.items = items;
        this.record_type = 'room';
    };
        
    model.roomSet = (function() {
        return {
            getRoom: function(context, callback)
            {
                context.load('/localhost/_design/app/_view/rooms', {
                    json: true,
                    cache: false
                }).then(callback);
            },

            saveRoom: function(context, callback)
            {
                model.db.saveDoc(doc, {
                    success: callback
                });
            },

            deleteRoom: function(id, rev, callback)
            {
                model.db.removeDoc({
                    _id: id, 
                    _rev: rev
                }, {
                    success: callback
                });        
            }    
        }
    })();
});


