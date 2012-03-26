require(['libraries/jquery', 'libraries/sammy', 'libraries/sammy.handlebars', 'controllers/challenge', 'controllers/login', 'controllers/admin/problems', 'controllers/admin/students', 'controllers/story'], function ($, Sammy) {
    var app = new Sammy('#main', function () {
        this.use('Handlebars', 'hb');

        this.get('#/', function () {
            this.redirect('#/challenge');
        });
    });

    $(function () {
        app.run('#/');
        app.trigger('onStart');
    });
});
