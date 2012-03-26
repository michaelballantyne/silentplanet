define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'controllers/login'], function ($, sammy, problemSet, problemReports, login) {
    var currentProblem = null,
        challenge = {};
        
    challenge.chooseRandomProblem = function (problems, student) {
        var randomNum, problem;
        do {
            randomNum = Math.floor(Math.random() * problems.length);
            problem = problems[randomNum].value;
        }
        while(problem.difficulty > student.difficultySetting);
        return problem;
    };
    
    challenge.randomObject = function (context) {
        var callback = function (view) {
            if (view.rows.length === 0) {
                $('displayBox').html('Empty Database');
                return;
            }
            
            var problem = challenge.chooseRandomProblem(view.rows, login.currentStudent);
            
            if (problem) {
                this.render('templates/problem.hb', problem).appendTo('#displayBox');
                currentProblem = problem;
            }
        };
        problemSet.getProblems(context, callback);
    };
    sammy('#main', function () {
        this.get('#/challenge', function () {
            this.partial('templates/game.hb').then(function () {
                $('#input').focus();
                randomObject(this);
            });
        });

        this.post("#/answer", function () {
            var answer = this.params.answer,
                correct;
            if(login.currentProblem) {
                correct = answer.toUpperCase() === login.currentProblem.answer.toUpperCase();
                problemReports.addOrUpdateProblemReport(login.currentProblem._id, correct, this);
                if (correct) {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Correct!");
                    $('#displayBox').append("<br/>");
                    $('#input').val("");
                    problemSet.pullRandomProblem(this);
                    randomObject(this);
                } else {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Incorrect, try again!");
                    $('#displayBox').append("<br/>");
                    $('#input').val("");
                    this.render('templates/problem.hb', currentProblem).appendTo('#displayBox');
                }
            }
            else {
                $('#input').val("");
            }
        });
    });
    
    return challenge;
});
