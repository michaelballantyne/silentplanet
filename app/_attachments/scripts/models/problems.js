define(['models/db', 'libraries/handlebars', 'controllers/login'], function (db, Handlebars, login) {
    var MAX_DIFFICULTY = 5;
    var MIN_DIFFICULTY = 1;
    
    Handlebars.registerHelper("formatDifficulty", function (difficulty) {
        var i,
            difficultyAsAsterisk = "";
        for (i = 0; i < difficulty; i++) {
            difficultyAsAsterisk += "*";
        }
        return new Handlebars.SafeString(difficultyAsAsterisk);
    });
    
    var Problem = function (question, answer, difficulty) {
        this.problem = question;
        this.answer = answer;
        this.difficulty = difficulty;
        this.record_type = 'problem';
    };

    return {
        
        getProblems: function (context, callback) {
            context.load('/localhost/_design/app/_view/problems', {
                json: true,
                cache: false
            }).then(callback);
        },

        getProblem: function (id, context, callback) {
            context.load('/localhost/_design/app/_view/problems?key=' + '"' + escape(id) + '"', {
                _id: id,
                json: true,
                cachse: false
            }).then(callback);
        },

        deleteProblem: function (id, rev, callback) {
            db.removeDoc({
                _id: id,
                _rev: rev
            }, {
                success: callback
            });
        },

        saveProblem: function (doc, callback) {
            db.saveDoc(doc, {
                success: callback
            });
        },

        createProblem: function (question, answer, difficulty) {
            return new Problem(question, answer, difficulty);
        }
    };
});