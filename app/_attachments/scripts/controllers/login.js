define(['libraries/jquery', 'libraries/sammy', 'models/students', 'libraries/jquery.cookie'], function ($, sammy, studentSet) {
    var login = {},
        updateCurrentStudent = function (context, username, callback) {
            var privcallback = function (view) {
                    login.currentStudent = view.rows[0].value;
                    callback();
                };
            studentSet.getStudent(username, context, privcallback);
        };

    login.currentStudent = null;

    login.updateStudentOnServer = function () {
        studentSet.saveStudent(login.currentStudent, function () {});
    };


    sammy('#main', function () {
        this.before({
            except: {
                path: ['#/login', '#/admin/login']
            }
        }, function (context) {
            if (login.currentStudent !== null) { //case where the user is already logged in
                return true;
            }

            var username = $.cookie('username');

            if (username !== null) { //case where cookie wasn't empty
                updateCurrentStudent(this, username, function () {
                    context.app.refresh();
                });

                return false;
            } else {
                this.partial('templates/login.hb', {
                    redirectpath: window.location.hash
                });
                $('#navigationMenu').hide();
                return false;
            }
        });

        this.post("#/login", function () {
            var context = this,
                entered_username = this.params.user;

            studentSet.getStudent(entered_username, context, function (view) {
                if (view.rows.length !== 0) {
                    login.currentStudent = view.rows[0].value;
                    $.cookie('username', entered_username);
                    $('#navigationMenu').show();
                }


                if (login.currentStudent !== null) {
                    context.redirect(context.params.redirectpath);
                } else {
                    $('#loginInfo').show();
                }
            });
        });

        this.get('#/logout', function () {
            login.currentStudent = null;
            $.cookie('username', null);
            this.redirect('#/');
        });
    });

    return login;
});