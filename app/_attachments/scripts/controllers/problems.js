/**
 * manages some of the business logic involving problems
 */

define(['libraries/jquery', 'models/problems', 'controllers/login', 'controllers/display'], function ($, problemSet, login, display) {
    var probLogic = {};

    probLogic.getProblemInRange = function (problems, student) {
        var inrange = problems.filter(function (problem) {
           return problem.value.difficulty <= student.difficultySetting;
        });
        
        var randomNum = Math.floor(Math.random() * inrange.length);
        var problemrow = inrange[randomNum];
        
        var problem = null;
        if (problemrow) {
            problem = problemrow.value;
        }
        
        return problem;
    };

    probLogic.currentProblem = null;

    probLogic.activateProblem = function (problemDescription, context, cont) {
        if (problemDescription) {
            display.append(problemDescription);
            probLogic.chooseRandomProblem(context, cont);
        }
        else {
            cont();
        }
    };

    probLogic.chooseRandomProblem = function (context, cont) {
        var callback = function (view) {
            if (view.rows.length === 0) {
                display.append('Empty Database');
                cont();
            }
            var problem = probLogic.getProblemInRange(view.rows, login.currentStudent);
            if (problem) {
                display.append(problem.problem);
                probLogic.currentProblem = problem;
                cont();
            } else {
                display.append('Error: No problems of appropriate difficulty found.')
                cont();
            }
            
        };
        problemSet.getProblems(context, callback);
    };

    return probLogic;
});