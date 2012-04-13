/**
 * manages some of the business logic involving problems
 */

define(['libraries/jquery', 'models/problems', 'controllers/login', 'controllers/tickerLogic'], function ($, problemSet, login, tickerLogic) {
    var probLogic = {};

    probLogic.getProblemInRange = function (problems, student) {
        var randomNum, problem;
        do {
            randomNum = Math.floor(Math.random() * problems.length);
            problem = problems[randomNum].value;
        } while (problem.difficulty > student.difficultySetting);
        return problem;
    };

    probLogic.currentProblem = null;

    probLogic.activateProblem = function (problemDescription, context) {
        if (problemDescription) {
            $('#tickerBox').append("<p>" + problemDescription + "</p>");
            probLogic.chooseRandomProblem(context);
        }
        else
            tickerLogic.animateText($('#displayBox'));
    };

    probLogic.chooseRandomProblem = function (context) {
        var callback = function (view) {
            if (view.rows.length === 0) {
                $('tickerBox').html('Empty Database');
                TypingText.runAll();
                return;
            }
            var problem = probLogic.getProblemInRange(view.rows, login.currentStudent);
            if (problem) {
                this.render('templates/problem.hb', problem).appendTo('#tickerBox')
                .then(function() {
                    tickerLogic.animateText($('#displayBox'));
                });
                probLogic.currentProblem = problem;
            }
        };
        problemSet.getProblems(context, callback);
    };

    return probLogic;
});