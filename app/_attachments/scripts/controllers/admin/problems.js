define(['libraries/jquery', 'libraries/sammy', 'libraries/handlebars', 'models/problems'], function ($, sammy, Handlebars, problemSet) {
    Handlebars.registerHelper("formatDifficulty", function (difficulty) {
        var i,
            difficultyAsAsterisk = "";
        for (i = 0; i < difficulty; i++) {
            difficultyAsAsterisk += "*";
        }
        return new Handlebars.SafeString(difficultyAsAsterisk);
    });

    sammy('#main', function () {
        this.post("#/problems", function (context) {
            problemSet.saveProblem(problemSet.createProblem(this.params.question, this.params.answer, this.params.difficulty), function () {
                context.redirect('#/problems/new');
            });
        });

        this.get("#/problems/new", function () {
            problemSet.getProblems(this, function (view) {
                this.partial('templates/admin/addproblem.hb', {
                    rows: view.rows
                }).then(function () {
                    $('#question').focus();
                });
            });
        });

        this.get("#/problems/delete/:id/:rev", function (context) {
            problemSet.deleteProblem(this.params.id, this.params.rev, function () {
                context.redirect("#/problems/new");
            });
        });
    });

});
