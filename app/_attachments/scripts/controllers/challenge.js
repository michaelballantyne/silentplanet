define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'controllers/login', 'controllers/problems', 'controllers/tickerLogic'], function ($, sammy, problemSet, problemReports, login, probLogic, tickerLogic) {
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
                    $('#tickerBox').html("");
                    $('#tickerBox').append("<p>Correct!</p>");
                    $('#input').val("");
                    probLogic.chooseRandomProblem(this);
                } else {
                    $('#tickerBox').html("");
                    $('#tickerBox').append("<p>Incorrect, try again!</p>");
                    $('#input').val("");
                    this.render('templates/problem.hb', probLogic.currentProblem).appendTo('#tickerBox')
                    .then(function() {
                        tickerLogic.animateText($('#displayBox'));
                    });
                }
            } else {
                $('#input').val("");
            }
        });
    });

    return challenge;
});
