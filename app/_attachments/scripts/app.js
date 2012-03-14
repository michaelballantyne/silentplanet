define(['libraries/sammy', 'libraries/sammy.handlebars',
    'controllers/challenge', 'controllers/login', 'controllers/admin/problems', 
    'controllers/admin/students'], function(Sammy) {

    var app = Sammy('#main', function() {
        this.use('Handlebars', 'hb');

        this.get('#/', function()
        {
            this.redirect('#/challenge');
        });
    });

    return app;
});