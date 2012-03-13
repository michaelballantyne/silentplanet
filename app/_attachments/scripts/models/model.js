define(['models/model', 'libraries/jquery', 'libraries/jquery.couch'], function() {
    var model = model || {};
    
    model.db = $.couch.db('localhost');
    
    return model;
});