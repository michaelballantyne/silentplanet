require(['models/model'], function(model) {
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
});

