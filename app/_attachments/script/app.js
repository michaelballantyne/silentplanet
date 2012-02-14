(function($)
    {
        const maxInt = 9007199254740992;

        var Problem = function(question, answer, difficulty)
        {
            return {
                problem: question,
                answer: answer,
                difficulty: difficulty,
                record_type: 'problem'
            };
        };

        var Student = function(username)
        {
            return {
                username: username,
                record_type: 'student'
            };
        };

        var StudentSet = {
            getStudents: function(context, callback) {
                context.load('/localhost/_design/app/_view/students', {
                    json: true, 
                    cache: false
                }).then(callback);  
            },

            deleteStudent: function(id, rev, callback) {
                db.removeDoc({
                    _id: id, 
                    _rev: rev
                }, {
                    success: callback
                });        
            },

            saveStudent: function(doc, callback) {
                db.saveDoc(doc, {
                    success: callback
                });        
            }
        };

        var ProblemSet = {
            getProblems: function(context, callback) {
                context.load('/localhost/_design/app/_view/problems', {
                    json: true, 
                    cache: false
                }).then(callback);
            },

            deleteProblem: function(id, rev, callback) {
                db.removeDoc({
                    _id: id, 
                    _rev: rev
                }, {
                    success: callback
                });
            },
            saveProblem: function(doc, callback) {
                db.saveDoc(doc, {
                    success: callback
                });
            }
        };

        var db = $.couch.db('localhost');

        var currentProblem;

        var username = null;

        var randomObject = function(context)
        {
            var callback = function(view)
            {
                if (view.rows.length == 0)
                {
                    $('displayBox').html('Empty Database');
                    return;
                }
                var randomNum = Math.floor(Math.random() * view.rows.length);
                var problem = view.rows[randomNum].value;
                if (problem)
                {
                    this.render('templates/problem.hb', problem).appendTo('#displayBox');
                    currentProblem = problem;
                }
            };
            ProblemSet.getProblems(context, callback);
        }

        var app = Sammy('#main', function()
        {
            this.use('Handlebars', 'hb');

            this.get('#/', function()
            {
                this.redirect('#/challenge');
            });

            this.before({
                except: {
                    path: '#/login'
                }
            }, function()

            {
                    if (username == null)
                    {
                        username = $.cookie('username');
                    }
                        
                    if (username != null)
                    {
                        return true;
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
                this.load("/localhost/_design/app/_view/students", {
                    json: true
                }).then(function(view)

                {
                        for(var i = 0; i < view.rows.length; i++)
                        {
                            if(view.rows[i].key == entered_username)
                            {
                                username = entered_username;
                                $.cookie('username', entered_username);
                                $('#navigationMenu').show();
                            }
                        }
                        
                        
                        if (username != null)
                            context.redirect(context.params['redirectpath']);
                        else {
                            $('#loginInfo').show();
                        }
                    });
            });
            
            this.get('#/logout', function()
            {
                username = null;
                $.cookie('username', null);
                this.redirect('#/');
            });

            this.get('#/challenge', function()
            {
                this.partial('templates/game.hb').then(function()
                {
                    $('#input').focus();
                    randomObject(this);
                });
            }); 
                           
            this.post("#/answer", function()
            {
                var answer = this.params['answer'];
                if (answer.toUpperCase() == currentProblem.answer.toUpperCase())
                {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Correct!");
                    $('#displayBox').append("<br/>");
                    $('#input').val("");
                    randomObject(this);
                }
                else
                {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Incorrect, try again!");
                    $('#displayBox').append("<br/>");
                    $('#input').val("");
                    this.render('templates/problem.hb', currentProblem).appendTo('#displayBox');
                }
            });
            
            this.post("#/problems", function(context)
            {
                ProblemSet.saveProblem(new Problem(this.params['question'], this.params['answer'], this.params['difficulty']), function()
                {
                    context.redirect('#/problems/new');
                });
            });

            this.get("#/problems/new", function()
            {
                Handlebars.registerHelper("formatDifficulty", function(difficulty)
                {
                    var difficultyAsAsterisk = "";
                    for(var i = 0; i < difficulty; i++)
                    {
                        difficultyAsAsterisk += "*";
                    }
                    return new Handlebars.SafeString(difficultyAsAsterisk);
                });
			
                ProblemSet.getProblems(this, function(view)
                {
                    this.partial('templates/admin/addproblem.hb', {
                        rows: view.rows
                    })
                    .then(function()
                    {
                        $('#question').focus();
                    });
                });
            });

            this.get("#/problems/delete/:id/:rev", function(context)
            {
                ProblemSet.deleteProblem(this.params['id'], this.params['rev'], function()
                {
                    context.redirect("#/problems/new");
                });
            });

            this.post("#/students", function(context)
            {
                StudentSet.saveStudent(new Student(this.params['username']), function()
                {
                    context.redirect('#/students/new');
                });
            });

            this.get("#/students/new", function()
            {
                StudentSet.getStudents(this, function(view)
                {
                    this.partial('templates/admin/addstudent.hb', {
                        rows: view.rows
                    })
                    .then(function()
                    {
                        $('#student').focus();
                    });
                });
            });
		
            this.get("#/students/delete/:id/:rev", function(context)
            {
                StudentSet.deleteStudent(this.params['id'], this.params['rev'], function()
                {
                    context.redirect("#/students/new");
                });
            });
        });

        $(function()
        {
            app.run('#/');
        });
    })(jQuery);