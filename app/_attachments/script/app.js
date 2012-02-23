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
        
        var ProblemReport = function(id, correct, incorrect)
        {
            return {
                id: id,
                correct: correct,
                incorrect: incorrect
            };
        };
        
        var ProblemReportRow = function(id, problem, difficulty, correct, incorrect)
        {
            return {
                id: id,
                problem:problem,
                difficulty:difficulty,
                correct:correct,
                incorrect:incorrect
            };
        };

        var Student = function(username, problemReports)
        {
            return {
                username: username,
                problemReports: problemReports,
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
            
            getStudent: function(username, context, callback) {
                context.load('/localhost/_design/app/_view/students?key=' + '"' + escape(username) + '"', {
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
            
            getProblem: function(id, context, callback) {
                context.load('/localhost/_design/app/_view/problems?key=' + '"' + escape(id) + '"', {
                    _id: id,
                    json: true,
                    cachse: false
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

        var currentProblem = null;

        var currentStudent = null;
        
        var updateStudentOnServer = function()
        {
            StudentSet.saveStudent(currentStudent, function(){});
        }
        
        //updates currentStudent after the username has been set
        var updateCurrentStudent = function(context, username)
        {
            var callback = function(view)
            {
                currentStudent = view.rows[0].value;
            };
            StudentSet.getStudent(username, context, callback);
        };
        
        var addOrUpdateProblemReport = function(id, correct, context)
        {
            if(!currentStudent.problemReports)
            {
                currentStudent.problemReports = [];
            }
            for(var i = 0; i < currentStudent.problemReports.length; i++)
            {
                if(currentStudent.problemReports[i].id == id)
                    break;
            }
            if(i == currentStudent.problemReports.length)
            {
                currentStudent.problemReports[i] = new ProblemReport(id, 0, 0);
            }
            
            if(correct)
            {
                currentStudent.problemReports[i].correct += 1;
            }
            else
            {
                currentStudent.problemReports[i].incorrect += 1;
            }
            updateStudentOnServer(context);
        }
        
        trimProblemReports = function(ids)
        {
            for(var i = 0; i < currentStudent.problemReports.length; i++)
            {
                if($.inArray(currentStudent.problemReports[i].id, ids) >= 0)
                {
                    currentStudent.problemReports.splice(i, 1);
                    i--;
                }
            }
            updateStudentOnServer();
        };
        
        //grabs a random problem and puts it in the displaybox
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
            Handlebars.registerHelper("formatDifficulty", function(difficulty)
            {
                var difficultyAsAsterisk = "";
                for(var i = 0; i < difficulty; i++)
                {
                    difficultyAsAsterisk += "*";
                }
                return new Handlebars.SafeString(difficultyAsAsterisk);
            });
            
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
                    if (currentStudent != null) //case where the user is already logged in
                    {
                        return true;
                    }
                    
                    var username = $.cookie('username');
                        
                    if (username != null) //case where cookie wasn't empty
                    {
                        updateCurrentStudent(this, username);
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
                this.load("/localhost/_design/app/_view/students?key=" + "\"" + escape(entered_username) + "\"", {
                    json: true
                }).then(function(view)

                {
                        if(view.rows.length != 0)
                        {
                            currentStudent = view.rows[0].value;
                            $.cookie('username', entered_username);
                            $('#navigationMenu').show();
                        }
                        
                        
                        if (currentStudent != null)
                            context.redirect(context.params['redirectpath']);
                        else {
                            $('#loginInfo').show();
                        }
                    });
            });
            
            this.get('#/logout', function()
            {
                currentStudent = null;
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
                var correct = answer.toUpperCase() == currentProblem.answer.toUpperCase();
                addOrUpdateProblemReport(currentProblem._id, correct, this);
                if (correct)
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
                StudentSet.saveStudent(new Student(this.params['username'], []), function()
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
            
            this.get("#/students/reports", function()
            {  
                updateStudentOnServer();
                var problemReportRows = [];
                for(var i = 0; i < currentStudent.problemReports.length; i++)
                {
                    problemReportRows[i] = new ProblemReportRow(currentStudent.problemReports[i].id, "", "", currentStudent.problemReports[i].correct, currentStudent.problemReports[i].incorrect);
                }
               
                ProblemSet.getProblems(this, function(view)
                {
                    for(var i = 0; i < view.rows.length; i++)
                    {
                        for(var j = 0; j < problemReportRows.length; j++)
                        {
                            if(view.rows[i].id == problemReportRows[j].id)
                            {
                                var returnedValue = view.rows[i].value;
                                problemReportRows[j].problem = returnedValue.problem;
                                problemReportRows[j].difficulty = returnedValue.difficulty;
                            }
                        }
                    }
                    
                    //kind of a hack here, but basically a lazy removal of problemReports for problems which are no longer in the database
                    var problemIDsToRemove = [];
                    for(var i = 0; i < problemReportRows.length; i++)
                    {
                            if(!problemReportRows[i].problem)
                            {
                                problemIDsToRemove.push(problemReportRows[i].id);
                                problemReportRows.splice(i, 1);
                                i--; //we don't want to skip anything in the array for this...
                            }
                    }
                    
                    trimProblemReports(problemIDsToRemove);
                    this.partial('templates/student-report.hb', {
                        rows: problemReportRows
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