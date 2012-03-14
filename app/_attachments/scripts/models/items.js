require(['models/model'], function(model) {
    model.Item = function(itemID, itemName, dialogs) {
        this.id = itemID;
        this.name = itemName;
        this.dialogs = dialogs;
        this.record_type = 'item';
    };
        
    model.itemSet = (function() {
        return {
            getItem: function(context, callback)
            {
                context.load('/localhost/_design/app/_view/items', {
                    json:true,
                    cache:false
                }).then(callback);
            },

            saveItem: function(context, callback)
            {
                model.db.saveDoc(doc, {
                    success: callback
                });
            },

            deleteItem: function(id, rev, callback)
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

    model.moveItem = function(itemID, roomID)
    {
        if(model.currentStudent.itemFlags == null)
            {
                model.currentStudent.itemFlags = [];
            }
        var i;
        for(i=0; i<model.currentStudent.itemFlags.length;i++)
            {
                if(model.currentStudent.itemFlags[i].itemID == itemID)
                    {
                        break;
                    }
            }
            model.currentStudent.itemFlags[i].itemID=itemID;
            model.currentStudent.itemFlags[i].roomID=roomID;
    }
});
