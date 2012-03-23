define(['libraries/sammy', 'libraries/jquery', 'controllers/login'], function (sammy, $) {
    sammy('#main', function () {
        this.get('#/admin/login', function () {
            this.partial('templates/admin/login.hb', {
                redirectpath: window.location.hash
            });
            $('#navigationMenu').hide();
        });
    });
});