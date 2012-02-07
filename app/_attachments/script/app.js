//Apache 2.0 J Chris Anderson 2011
const maxInt = 9007199254740992;
randomObject = function(context)
{
    callback = function(item)
    {
        problems = item['problems'];
        console.log(problems);
        randomNum = Math.floor(Math.random() * maxInt) % problems.length;
        problem = problems[randomNum];
        this.render('templates/problemTemplate.hb', problem).replace('#displayBox');
    }
    context.load('/localhost/problemSet.json').then(callback);
}

var app = Sammy('#main', function()
{
    this.use('Handlebars', 'hb');
    this.element_selector = '#displayBox';
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
});
$(function()
{
    app.run('#/');
});