define(['libraries/jquery', 'libraries/sammy', 'controllers/login', 'models/students', 'models/problems', 'models/problemreports', 'models/studentreports', 'libraries/PBKDF2'], function ($, sammy, login, studentSet, problemSet, problemReports, studentreports, PBKDF2) {
    var ProblemReportRow = function (id, problem, difficulty, correct, incorrect) {
            this.id = id;
            this.problem = problem;
            this.difficulty = difficulty;
            this.correct = correct;
            this.incorrect = incorrect;
        };

    sammy('#main', function () {
        this.post("#/admin/students", function (context) {
            var hasher, hashcallback, student;
            var newStudentVals = this.params;
            hashcallback = function (hash) {
                        if (hash) {
                            student.hash = hash;
                        }
                    studentSet.saveStudent(student , function () {
                            context.redirect('#/admin/students/new');
                        });
                    };
            studentSet.getStudent(newStudentVals.username, context, function(view){
                if(view.rows.length === 0){
                    $('#main').append("<br/>");
                    $('#main').append("There are no students with this name in the database...Creating new student.");
                    $('#main').append("<br/>");
                    student = studentSet.createStudent(newStudentVals.username, newStudentVals.difficultySetting, [], [], []);;
                }
                else{
                    student = view.rows[0].value;
                    student.difficultySetting = newStudentVals.difficultySetting;
                }
                if (newStudentVals.password !== "") {
                hasher = new PBKDF2(newStudentVals.password, '22b1ffd0-76e3-11e1-b0c4-0800200c9a66', 100, 100);
                hasher.deriveKey(function () {}, hashcallback);
                } 
                else {
                hashcallback();
            }
            });            
        });

        this.get("#/admin/students/new", function () {
            studentSet.getStudents(this, function (view) {
                $.validator.addMethod("username", function (value, element) {
                    return this.optional(element) || /^[a-zA-Z0-9-]{3,16}$/i.test(value); 
                }, "Usernames must be 3-15 characters in length, and may only contain letters, numbers, and dashes.");

                this.partial('templates/admin/addstudent.hb', {
                    rows: view.rows
                }).then(function () {
                    $('#student').focus();
                    $('form').validate({rules: {
                        difficultySetting: {
                            number: true,
                            min: 1,
                            max: 5
                        }
                    }
                        });
                });
            });
        });

        this.get("#/students/reports", function () {
            var i, j,
                problemReportRows = [],
                problemIDsToRemove = [];

            for (i = 0; i < login.currentStudent.problemReports.length; i++) {
                problemReportRows[i] = new ProblemReportRow(login.currentStudent.problemReports[i].id, "", "", login.currentStudent.problemReports[i].correct, login.currentStudent.problemReports[i].incorrect);
            }

            problemSet.getProblems(this, function (view) {
                for (i = 0; i < view.rows.length; i++) {
                    for (j = 0; j < problemReportRows.length; j++) {
                        if (view.rows[i].id === problemReportRows[j].id) {
                            var returnedValue = view.rows[i].value;
                            problemReportRows[j].problem = returnedValue.problem;
                            problemReportRows[j].difficulty = returnedValue.difficulty;
                        }
                    }
                }

                //kind of a hack here, but basically a lazy removal of problemReports for problems which are no longer in the database
                for (i = 0; i < problemReportRows.length; i++) {
                    if (!problemReportRows[i].problem) {
                        problemIDsToRemove.push(problemReportRows[i].id);
                        problemReportRows.splice(i, 1);
                        i--; //we don't want to skip anything in the array for this...
                    }
                }

                problemReports.trimProblemReports(problemIDsToRemove);
                this.partial('templates/student-report.hb', {
                    rows: problemReportRows
                });
            });

        });

        this.get("#/admin/students/delete/:id/:rev", function (context) {
            var id = this.params.id;
            if (id !== login.currentStudent._id) {
                studentSet.deleteStudent(this.params.id, this.params.rev, function () {
                    context.redirect("#/admin/students/new");
                });
            } else {
                window.alert("You can't delete your own account!");
            }
        });

        this.get("#/admin/students/classreport", function () {
            var context = this,
                callback = function (studentReports) {
                    context.partial('templates/admin/class-report.hb', {
                        rows: studentReports
                    });
                };
            studentreports.buildStudentReport(this, callback);
        });
    });
});
