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
            var hasher, student = studentSet.createStudent(this.params.username, this.params.difficultySetting, [], [], []),
                callback = function (hash) {
                    if (hash) {
                        student.hash = hash;
                    }
                    studentSet.saveStudent(student , function () {
                        context.redirect('#/admin/students/new');
                    });
                };
            
            if (this.params.password !== "") {
                hasher = new PBKDF2(this.params.password, '22b1ffd0-76e3-11e1-b0c4-0800200c9a66', 100, 100);
                hasher.deriveKey(function () {}, callback);
            } else {
                callback();
            }
            
            
        });

        this.get("#/admin/students/new", function () {
            studentSet.getStudents(this, function (view) {
                this.partial('templates/admin/addstudent.hb', {
                    rows: view.rows
                }).then(function () {
                    $('#student').focus();
                });
            });
        });

        this.get("#/students/reports", function () {
            var i, j,
                problemReportRows = [],
                problemIDsToRemove = [];

            login.updateStudentOnServer();
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
            studentSet.deleteStudent(this.params.id, this.params.rev, function () {
                context.redirect("#/admin/students/new");
            });
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
