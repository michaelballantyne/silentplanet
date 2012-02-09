(function($) {
const maxInt = 9007199254740992;

var Problem = function(question, answer) {
    return {
        problem: question,
        answer: answer
    };
};

var db = $.couch.db('localhost')

var randomObject = function(context)
{
    callback = function(item)
    {
        var problems = item['problems'];
        console.log(problems);
        var randomNum = Math.floor(Math.random() * maxInt) % problems.length;
        var problem = problems[randomNum];
        this.render('templates/problemTemplate.hb', problem).replace('#displayBox');
    }
    context.load('/localhost/problemSet.json').then(callback);
}

var app = Sammy('#displayBox', function()
{
    this.use('Handlebars', 'hb');

    this.get('#/', function()
    {
        this.load('/localhost/f89841dd6e9867194d09fe0e1e0026a7',
        {
            json : true
        }).render('templates/someTemplate.hb').swap();
    });

    this.get('#/challenge', function()
    {
        randomObject(this);
    });
    
    this.post("#/problems", function() {
        var problem = new Problem(this.params['question'], this.params['answer']);
        db.saveDoc(problem);
        this.redirect('#/');
    });
    
    this.get("#/problems/new", function() {
        this.partial('templates/admin/addproblem.hb');
    })
});

$(function()
{
    app.run('#/');
});
})(jQuery);