define(['libraries/jquery', 'libraries/jquery.couch'], function ($) {
    var db = $.couch.db('localhost');

    return db;
});