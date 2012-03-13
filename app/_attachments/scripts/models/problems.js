require(['models/model'], function(model) {
    model.Problem = function(question, answer, difficulty) {   
        this.problem = question,
        this.answer = answer,
        this.difficulty = difficulty,
        this.record_type = 'problem'
    };
    
    model.problemSet = (function(){
        return {
            getProblems: function(context, callback) {
                context.load('/localhost/_design/app/_view/problems', {
                    json: true, 
                    cache: false
                }).then(callback);
            },
            
            getProblem: function(id, context, callback) {
                context.load('/localhost/_design/app/_view/problems?key=' + '"' + escape(id) + '"', {
                    _id: id,
                    json: true,
                    cachse: false
                }).then(callback);
            },

            deleteProblem: function(id, rev, callback) {
                model.db.removeDoc({
                    _id: id, 
                    _rev: rev
                }, {
                    success: callback
                });
            },
            
            saveProblem: function(doc, callback) {
                model.db.saveDoc(doc, {
                    success: callback
                });
            }
        }
    })();
});