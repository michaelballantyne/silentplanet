(function($) {
const maxInt = 9007199254740992;

var Problem = function(question, answer) {
    return {
        problem: question,
        answer: answer,
        record_type: 'problem'
    };
};

var ProblemSet = {
    getProblems: function(context, callback) {
        context.load('/localhost/_design/app/_view/problems', {json: true, cache: false}).then(callback);
    },
    
    deleteProblem: function(id, rev, callback) {
        db.removeDoc({_id: id, _rev: rev}, {success: callback});
    }
};

var db = $.couch.db('localhost')

var currentProblem;

var randomObject = function(context)
{
    var callback = function(view)
    {
        if (view.rows.length == 0)
            $('displayBox').html('Empty Database');
        var randomNum = Math.floor(Math.random() * view.rows.length);
        var problem = view.rows[randomNum].value;
        if (problem) {
            this.render('templates/problemTemplate.hb', problem).replace('#displayBox');
            currentProblem = problem;
        }
    }
    ProblemSet.getProblems(context, callback);
}

var app = Sammy('#main', function()
{
    this.use('Handlebars', 'hb');

    this.get('#/', function()
    {
        this.redirect('#/challenge');
    });

    this.get('#/challenge', function()
    {
        this.partial('templates/game.hb');
        randomObject(this);
    });
    
    this.post("#/problems", function() {
        var problem = new Problem(this.params['question'], this.params['answer']);
        db.saveDoc(problem);
        this.redirect('#/problems/new');
    });
    
    this.get("#/problems/new", function() {
        ProblemSet.getProblems(this, function(view){
            this.partial('templates/admin/addproblem.hb', {rows: view.rows});
        });
    });
    
    this.post("#/answer", function(){
        var answer = this.params['answer'];
        if (answer == currentProblem.answer) {
            this.redirect('#/challenge');
        }
    });
    
    this.get("#/problems/delete/:id/:rev", function() {
        var self = this;
        ProblemSet.deleteProblem(this.params['id'], this.params['rev'], function() {
            self.redirect("#/problems/new");
        });
    });
});

$(function()
{
    app.run('#/');
});
})(jQuery);