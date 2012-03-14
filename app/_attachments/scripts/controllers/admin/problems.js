define(['libraries/jquery', 'libraries/sammy', 'libraries/handlebars', 'models/model', 'models/problems'], function($, Sammy, Handlebars, model) {
    Handlebars.registerHelper("formatDifficulty", function(difficulty)
    {
        var difficultyAsAsterisk = "";
        for(var i = 0; i < difficulty; i++)
        {
            difficultyAsAsterisk += "*";
        }
        return new Handlebars.SafeString(difficultyAsAsterisk);
    });
    
    Sammy('#main', function()
    {
        this.post("#/problems", function(context)
        {
            model.problemSet.saveProblem(new model.Problem(this.params['question'], this.params['answer'], this.params['difficulty']), function()
            {
                context.redirect('#/problems/new');
            });
        });

        this.get("#/problems/new", function()
        {
            model.problemSet.getProblems(this, function(view)
            {
                this.partial('templates/admin/addproblem.hb', {
                    rows: view.rows
                })
                .then(function()
                {
                    $('#question').focus();
                });
            });
        });

        this.get("#/problems/delete/:id/:rev", function(context)
        {
            model.problemSet.deleteProblem(this.params['id'], this.params['rev'], function()
            {
                context.redirect("#/problems/new");
            });
        });
    });
    
});