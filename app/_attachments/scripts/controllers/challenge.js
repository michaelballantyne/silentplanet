define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'controllers/login', 'controllers/problems', 'controllers/display'], function ($, sammy, problemSet, problemReports, login, probLogic, display) {
    var challenge = {};

    sammy('#main', function () {
        this.get('#/challenge', function () {
            this.partial('templates/game.hb').then(function () {
                $('#input').focus();
                display.clear();
                probLogic.chooseRandomProblem(this, display.animate);
            });
        });

        this.post("#/answer", function () {
            var answer = this.params.answer,
            correct;
            
            $('#input').val("");
            
            if (probLogic.currentProblem) {
                correct = answer.toUpperCase() === probLogic.currentProblem.answer.toUpperCase();
                problemReports.addOrUpdateProblemReport(probLogic.currentProblem._id, correct, this);

                display.clear();

                if (correct) {
                    display.append("Correct!");
                    probLogic.chooseRandomProblem(this, display.animate);
                } else {
                    display.append("Incorrect, try again!");
                    display.append(probLogic.currentProblem.problem);
                    display.animate();
                }
            }
        });
    });

    return challenge;
});
