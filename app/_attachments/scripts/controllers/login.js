define(['libraries/jquery', 'libraries/sammy', 'models/students', 'libraries/handlebars', 'libraries/PBKDF2', 'libraries/jquery.cookie'], function ($, sammy, studentSet, Handlebars, PBKDF2) {
    var login = {},
        updateCurrentStudent = function (context, username, callback) {
            var privcallback = function (view) {
                if (view.rows.length === 0) {
                    context.redirect('#/logout');
                } else {
                    login.currentStudent = view.rows[0].value;
                    callback();
                }
            };
            studentSet.getStudent(username, context, privcallback);
        };

    login.currentStudent = null;
    login.currentProblem = null;
    login.updateStudentOnServer = function () {
        studentSet.saveStudent(login.currentStudent, function () {});
    };

    login.isAdmin = function () {
        return login.currentStudent.hash !== undefined;
    };

    Handlebars.registerHelper('escape', escape);

    sammy('#main', function () {
        this.before({
            except: {
                path: ['#/logout', '#/login.*', '#/admin/login.*']
            }
        }, function (context) {
            if (login.currentStudent !== null) { //case where the user is already logged in
                this.render('templates/menu.hb', {admin: login.isAdmin()}).replace('#navigationMenu');

                if (window.location.hash.indexOf('admin') !== -1 && !login.isAdmin()) {
                    context.partial('templates/notauthorized.hb');
                    return false;
                } else {
                    return true;
                }
            }

            var username = $.cookie('username');

            if (username !== null) { //case where cookie wasn't empty
                updateCurrentStudent(this, username, function () {
                    context.app.refresh();
                });

                return false;
            } else {
                this.redirect('#/login?page=' + escape(window.location.hash));
                return false;
            }
        });

        this.get('#/login', function () {
            this.partial('templates/login.hb', {
                redirectpath: this.params.page
            });
            $('#navigationMenu').hide();
        });

        this.get('#/admin/login', function () {
            this.partial('templates/admin/login.hb', {
                redirectpath: this.params.page
            });
            $('#navigationMenu').hide();
        });

        this.post("#/login", function () {
            var context = this,
                entered_username = this.params.user,
                password = this.params.password;
           
            
            studentSet.getStudent(entered_username, context, function (view) {
                var hasher, user, callback = function (hash) {
                    window.console.log(hash);
                    if (view.rows.length !== 0) {
                        user = view.rows[0].value;
                        if ((!user.hash && !hash) || user.hash === hash) {
                            login.currentStudent = user;
                            $.cookie('username', entered_username);
                            $('#navigationMenu').show();
                        }
                    }

                    if (login.currentStudent !== null) {
                        context.redirect(context.params.redirectpath);
                    } else {
                        $('#loginInfo').show();
                    }
                };

                if (password !== undefined) {
                    hasher = new PBKDF2(password, '22b1ffd0-76e3-11e1-b0c4-0800200c9a66', 100, 100);
                    hasher.deriveKey(function () {}, callback);
                } else {
                    callback();
                }
                
            });
        });

        this.get('#/logout', function () {
            login.currentStudent = null;
            login.admin = false;
            $.cookie('username', null);
            this.redirect('#/');
        });
    });

    return login;
});