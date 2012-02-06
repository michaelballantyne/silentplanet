//Apache 2.0 J Chris Anderson 2011
var app = Sammy('#main', function()
		{
	this.use('Handlebars', 'hb');
	this.element_selector = '#displayBox';
	this.get('#/', function()
			{
		this.load('/localhost/f89841dd6e9867194d09fe0e1e0026a7', {json: true}).render('templates/someTemplate.hb').swap();
			});

//	this.get('#/challenge', function()
//			{
//		while (true)
//		{
//			problems = this.load('/localhost/problemSet.json');
//			$('#displayBox').html("<p>" + )
//		}
//			})
//		});
$(function()
		{
	app.run('#/');
		});

//function loadNewRandomProblem()
//{
//	problems = this.load('/localhost/problemSet.json');
//	randomNum = Math.floor(random()) * problems.length;
//	return 
//}