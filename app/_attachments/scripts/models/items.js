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
});
