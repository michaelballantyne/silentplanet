define(['models/db'], function (db) {
    var Student = function (username, difficultySetting, problemReports, itemFlags, roomFlags) {
        this.username = username;

        /**
         * Problem Reports
         * 
         */
        this.problemReports = problemReports;

        /**
         * Item Flags
         * These basically keep track of where items have been moved.  They are basically mapping items to their
         * current location, with room0 being the inventory and item0 being the PC placemarker
         */
        this.itemFlags = itemFlags;

        /**
         * Room Flags
         * these keep track of (a) whether a room has been entered or not and (b) if the state of the room has changed
         * For instance, upon entering a room, there may be 3 visible exits, but a 4th may open after triggering some event
         * or passing some obstacle
         */
        this.roomFlags = roomFlags;

        /**
         * Difficulty setting
         * This is basically the student's grade.  It is used to determine the level of problems the student is assigned.
         * For now the student simply does not have to access to problems of higher difficulty than this setting.  Later it might
         * be used for weighting how many problems a student gets from different difficulties (IE, a student w/ a difficulty setting
         * of 3 may get, out of 20 problems, 10 of difficulty 3, 5 of difficulty 2, and 5 of difficulty 4).
         */
        this.difficultySetting = difficultySetting;
        this.record_type = 'student';
    };

    return {
        RoomFlag: function (roomID, currentStateID) {
            this.roomID = roomID;
            this.currentStateID = currentStateID;
        },

        ItemFlag: function (itemName, roomID) {
            this.itemName = itemName;
            this.roomID = roomID;
        },

        getStudents: function (context, callback) {
            context.load('_view/students', {
                json: true,
                cache: false
            }).then(callback);
        },

        getStudent: function (username, context, callback) {
            context.load('_view/students?key=' + '"' + escape(username) + '"', {
                json: true,
                cache: false
            }).then(callback);
        },

        deleteStudent: function (id, rev, callback) {
            db.removeDoc({
                _id: id,
                _rev: rev
            }, {
                success: callback
            });
        },

        saveStudent: function (doc, callback) {
            db.saveDoc(doc, {
                success: callback
            });
        },

        createStudent: function (username, difficultySetting, problemReports, itemFlags, roomFlags) {
            return new Student(username, difficultySetting, problemReports, itemFlags, roomFlags);
        }
    };
});


