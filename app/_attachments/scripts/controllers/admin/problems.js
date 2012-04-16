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
        this.post("#/admin/problems", function (context) {
            problemSet.saveProblem(problemSet.createProblem(this.params.question, this.params.answer, this.params.difficulty), function () {
                context.redirect('#/admin/problems/new');
            });
        });

        this.get("#/admin/problems/new", function () {
            problemSet.getProblems(this, function (view) {
                $.validator.addMethod("answer", function(value, element) {
                    var keyWords = ["look", "examine", "north", "south", "east", "west", "northwest", "northeast", "southwest", "southeast", "up", "move", "go", "walk", "climb", "pick up", "take", "get", "grab", "yoink", "inventory", "say", "speak", "shout", "yell", "zzz", "wait", "help"]; 
                    return this.optional(element) || (/^[a-zA-Z0-9- .]+$/i.test(value) && $.inArray(value,keyWords) === -1);
                }, "May not use command keywords (look, examine, move, go, pick up, drop, take, yoink, north, south, east, west, etc");
                this.partial('templates/admin/addproblem.hb', {
                    rows: view.rows
                }).then(function () {
                    $('#question').focus();
                    $('form').validate({rules: {
                        difficulty: {
                            number: true,
                            min: 1,
                            max: 5
                        }
                    }
                        });
                });
            });
        });
 
        this.get("#/admin/problems/delete/:id/:rev", function (context) {
            problemSet.deleteProblem(this.params.id, this.params.rev, function () {
                context.redirect("#/admin/problems/new");
            });
        });
    });

});
