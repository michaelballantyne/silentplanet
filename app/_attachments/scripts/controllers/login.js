define(['libraries/jquery', 'libraries/sammy', 'models/model', 'models/students', 'libraries/jquery.cookie'], function($, Sammy, model) {
    Sammy('#main', function()
    {
        this.before({
            except: {
                path: '#/login'
            }
        }, function(context) {
            if (model.currentStudent != null) //case where the user is already logged in
            {
                return true;
            }

            var username = $.cookie('username');

            if (username != null) //case where cookie wasn't empty
            {
                model.updateCurrentStudent(this, username, function() {
                    context.app.refresh();
                });
                
                return false;
            }
            else
            {
                this.partial('templates/login.hb', {
                    redirectpath: window.location.hash
                });
                $('#navigationMenu').hide();
                return false;
            }
        });

        this.post("#/login", function()
        {
            var context = this;
            var entered_username = this.params['user'];
            this.load("/localhost/_design/app/_view/students?key=" + "\"" + escape(entered_username) + "\"", {
                json: true
            }).then(function(view)

            {
                    if(view.rows.length != 0)
                    {
                        model.currentStudent = view.rows[0].value;
                        $.cookie('username', entered_username);
                        $('#navigationMenu').show();
                    }


                    if (model.currentStudent != null)
                        context.redirect(context.params['redirectpath']);
                    else {
                        $('#loginInfo').show();
                    }
                });
        });

        this.get('#/logout', function()
        {
            model.currentStudent = null;
            $.cookie('username', null);
            this.redirect('#/');
        });

    });
});