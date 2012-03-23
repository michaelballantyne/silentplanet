define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'models/rooms', 'models/students'], function ($, sammy, problemSet, problemReports, roomSet, studentSet) {
    var currentProblemSet = null,
        currentRoom = null;

    sammy('#main', function () {
        this.get('#/story', function () {
            this.partial('templates/storygame.hb').then(function () {
                $('#input').focus();
            });
        });
        
        this.post('#/story/command', function() {
            var command = this.params.command;
                });
    });
});