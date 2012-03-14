require(['models/model', 'models/students'], function(model) {
    model.ProblemReport = function(id, correct, incorrect) {
        this.id = id;
        this.correct = correct;
        this.incorrect = incorrect;
    };
        
    model.ProblemReportRow = function(id, problem, difficulty, correct, incorrect)
    {
        this.id = id;
        this.problem = problem;
        this.difficulty = difficulty;
        this.correct = correct;
        this.incorrect = incorrect;
    };    
    
    model.addOrUpdateProblemReport = function(id, correct, context)
    {
        if(!model.currentStudent.problemReports) 
        {
            model.currentStudent.problemReports = [];
        }
        for(var i = 0; i < model.currentStudent.problemReports.length; i++)
        {
            if(model.currentStudent.problemReports[i].id == id)
                break;
        }
        if(i == model.currentStudent.problemReports.length)
        {
            model.currentStudent.problemReports[i] = new model.ProblemReport(id, 0, 0);
        }

        if(correct)
        {
            model.currentStudent.problemReports[i].correct += 1;
        }
        else
        {
            model.currentStudent.problemReports[i].incorrect += 1;
        }
        model.updateStudentOnServer(context);
    };
    
    model.trimProblemReports = function(ids)
    {
        for(var i = 0; i < model.currentStudent.problemReports.length; i++)
        {
            if($.inArray(model.currentStudent.problemReports[i].id, ids) >= 0)
            {
                model.currentStudent.problemReports.splice(i, 1);
                i--;
            }
        }
        model.updateStudentOnServer();
    };
});

