define(['libraries/jquery', 'libraries/sammy', 'controllers/login', 'models/students', 'models/problems', 'models/problemreports'], function ($, sammy, login, studentSet, problemSet, problemReports) {
    
    var ProblemReportRow = function (id, problem, difficulty, correct, incorrect) {
            this.id = id;
            this.problem = problem;
            this.difficulty = difficulty;
            this.correct = correct;
            this.incorrect = incorrect;
        };

        
    sammy('#main', function () {
        this.post("#/students", function (context) {
            studentSet.saveStudent(new studentSet.createStudent(this.params.username, this.params.difficultySetting, [], [], []), function () {
                context.redirect('#/students/new');
            });
        });

        this.get("#/students/new", function () {
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

        this.get("#/students/delete/:id/:rev", function (context) {

            studentSet.deleteStudent(this.params.id, this.params.rev, function () {
                context.redirect("#/students/new");
            });
        });
    });
});
