define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'controllers/login', 'controllers/problems'], function ($, sammy, problemSet, problemReports, login, probLogic) {
    var challenge = {};

    sammy('#main', function () {
        this.get('#/challenge', function () {
            this.partial('templates/game.hb').then(function () {
                $('#input').focus();
                probLogic.chooseRandomProblem(this);
            });
        });

        this.post("#/answer", function () {
            var answer = this.params.answer,
                correct;
            if (probLogic.currentProblem) {
                correct = answer.toUpperCase() === probLogic.currentProblem.answer.toUpperCase();
                problemReports.addOrUpdateProblemReport(probLogic.currentProblem._id, correct, this);
                if (correct) {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Correct!");
                    $('#displayBox').append("<br/>");
                    $('#input').val("");
                    probLogic.chooseRandomProblem(this);
                } else {
                    $('#displayBox').append("<br/>");
                    $('#displayBox').append("Incorrect, try again!");
                    $('#displayBox').append("<br/>");
                    $('#input').val("");
                    this.render('templates/problem.hb', probLogic.currentProblem).appendTo('#displayBox');
                }
            } else {
                $('#input').val("");
            }
        });
    });

    return challenge;
});
