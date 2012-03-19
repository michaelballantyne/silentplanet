define(['libraries/jquery', 'libraries/sammy', 'models/problems', 'models/problemreports', 'models/rooms', 'models/students'], function ($, sammy, problemSet, problemReports) {
    var currentProblemSet = null,
        currentRoom = null,

    sammy('#main', function () {
        this.get('#/story', function () {
            this.partial('templates/game.hb').then(function () {
                $('#input').focus();
                randomObject(this);
            });
        });
    });
});