define(['models/db'], function(db) {    
    var Student = function(username, problemReports, itemFlags, roomFlags) {
        this.username = username;
        this.problemReports = problemReports;
        this.itemFlags = itemFlags;
        this.roomFlags = roomFlags;
        this.record_type = 'student';
    };

    return {  
        getStudents: function(context, callback) {
            context.load('/localhost/_design/app/_view/students', {
                json: true, 
                cache: false
            }).then(callback);  
        },

        getStudent: function(username, context, callback) {
            context.load('/localhost/_design/app/_view/students?key=' + '"' + escape(username) + '"', {
                json: true,
                cache: false
            }).then(callback);
        },

        deleteStudent: function(id, rev, callback) {
            db.removeDoc({
                _id: id, 
                _rev: rev
            }, {
                success: callback
            });        
        },

        saveStudent: function(doc, callback) {
            db.saveDoc(doc, {
                success: callback
            });        
        },

        createStudent: function(username, problemReports, itemFlags, roomFlags) {
            return new Student(username, problemReports, itemFlags, roomFlags);
        }
    };
});


