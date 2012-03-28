/**
 * manages some of the business logic involving problems
 */

define(['libraries/jquery', 'models/problems', 'controllers/login'], function ($, problemSet, login) {
    var probLogic = {},
        getProblemInRange = function (problems, student) {
            var randomNum, problem;
            do {
                randomNum = Math.floor(Math.random() * problems.length);
                problem = problems[randomNum].value;
            } while (problem.difficulty > student.difficultySetting);
            return problem;
        };

    probLogic.currentProblem = null;

    probLogic.activateProblem = function (problemDescription, context) {
        if (!problemDescription) {
            return;
        }
        $('#displayBox').append("<br/>");
        $('#displayBox').append(problemDescription);
        $('#displayBox').append("<br/>");
        probLogic.chooseRandomProblem(context);
    };

    probLogic.chooseRandomProblem = function (context) {
        var callback = function (view) {
            if (view.rows.length === 0) {
                $('displayBox').html('Empty Database');
                return;
            }
            var problem = getProblemInRange(view.rows, login.currentStudent);
            if (problem) {
                this.render('templates/problem.hb', problem).appendTo('#displayBox');
                probLogic.currentProblem = problem;
            }
        };
        problemSet.getProblems(context, callback);
    };

    return probLogic;
});