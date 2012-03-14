define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports'], function ($, sammy, problemSet, problemReports) {
    var currentProblem = null,
        randomObject = function (context) {
            var callback = function (view) {
                if (view.rows.length === 0) {
                    $('displayBox').html('Empty Database');
                    return;
                }
                var randomNum = Math.floor(Math.random() * view.rows.length),
                    problem = view.rows[randomNum].value;
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
                correct = answer.toUpperCase() === currentProblem.answer.toUpperCase();
            problemReports.addOrUpdateProblemReport(currentProblem._id, correct, this);
            if (correct) {
                $('#displayBox').append("<br/>");
                $('#displayBox').append("Correct!");
                $('#displayBox').append("<br/>");
                $('#input').val("");
                randomObject(this);
            } else {
                $('#displayBox').append("<br/>");
                $('#displayBox').append("Incorrect, try again!");
                $('#displayBox').append("<br/>");
                $('#input').val("");
                this.render('templates/problem.hb', currentProblem).appendTo('#displayBox');
            }
        });
    });
});
