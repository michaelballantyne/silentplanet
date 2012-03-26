define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'controllers/login'], function ($, sammy, problemSet, problemReports, login) {
    sammy('#main', function () {
        this.get('#/challenge', function () {
            this.partial('templates/game.hb').then(function () {
                $('#input').focus();
                problemSet.pullRandomProblem(this);
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
                } else {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Incorrect, try again!");
                    $('#displayBox').append("<br/>");
                    $('#input').val("");
                    this.render('templates/problem.hb', login.currentProblem).appendTo('#displayBox');
                }
            }
            else {
                $('#input').val("");
            }
        });
    });
});
