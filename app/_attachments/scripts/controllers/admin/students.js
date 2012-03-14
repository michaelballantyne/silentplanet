define(['libraries/jquery', 'libraries/sammy', 'models/model', 'models/problemreports', 'models/problems', 'models/students'], function($, Sammy, model) {
    Sammy('#main', function() {
        this.post("#/students", function(context)
        {
            model.studentSet.saveStudent(new model.Student(this.params['username'], []), function()
            {
                context.redirect('#/students/new');
            });
        });

        this.get("#/students/new", function()
        {
            model.studentSet.getStudents(this, function(view)
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
            model.updateStudentOnServer();
            var problemReportRows = [];
            for(var i = 0; i < model.currentStudent.problemReports.length; i++)
            {
                problemReportRows[i] = new model.ProblemReportRow(model.currentStudent.problemReports[i].id, "", "", model.currentStudent.problemReports[i].correct, model.currentStudent.problemReports[i].incorrect);
            }

            model.problemSet.getProblems(this, function(view)
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

                model.trimProblemReports(problemIDsToRemove);
                this.partial('templates/student-report.hb', {
                    rows: problemReportRows
                });
            });

        });

        this.get("#/students/delete/:id/:rev", function(context)
        {
            model.
                studentSet.deleteStudent(this.params['id'], this.params['rev'], function()
            {
                context.redirect("#/students/new");
            });
        });
    });
});