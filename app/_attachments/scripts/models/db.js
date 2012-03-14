define(['libraries/jquery', 'libraries/jquery.couch'], function($) {    
    var db = db || $.couch.db('localhost');
    
    return db;
});