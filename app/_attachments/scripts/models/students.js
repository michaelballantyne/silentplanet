require(['models/model'], function(model) {    
    model.Student = function(username, problemReports, itemFlags, roomFlags) {
        this.username = username;
        this.problemReports = problemReports;
        this.itemFlags = itemFlags;
        this.roomFlags = roomFlags;
        this.record_type = 'student';
    };

    model.studentSet = (function() {
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
                model.db.removeDoc({
                    _id: id, 
                    _rev: rev
                }, {
                    success: callback
                });        
            },

            saveStudent: function(doc, callback) {
                model.db.saveDoc(doc, {
                    success: callback
                });        
            }
        };
    })();
    
    model.currentStudent = null
    
    model.updateStudentOnServer = function()
    {
        model.studentSet.saveStudent(model.currentStudent, function(){});
    }
    
    model.updateCurrentStudent = function(context, username, callback)
    {
        var privcallback = function(view)
        {
            model.currentStudent = view.rows[0].value;
            callback();
        };
        model.studentSet.getStudent(username, context, privcallback);
    };
});


