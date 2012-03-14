define(['libraries/jquery', 'controllers/login'], function ($, login) {
    var ProblemReport = function (id, correct, incorrect) {
        this.id = id;
        this.correct = correct;
        this.incorrect = incorrect;
    };

    return {
        addOrUpdateProblemReport: function (id, correct, context) {
            var i;
            if (!login.currentStudent.problemReports) {
                login.currentStudent.problemReports = [];
            }
            for (i = 0; i < login.currentStudent.problemReports.length; i++) {
                if (login.currentStudent.problemReports[i].id === id) {
                    break;
                }
            }
            if (i === login.currentStudent.problemReports.length) {
                login.currentStudent.problemReports[i] = new ProblemReport(id, 0, 0);
            }

            if (correct) {
                login.currentStudent.problemReports[i].correct += 1;
            } else {
                login.currentStudent.problemReports[i].incorrect += 1;
            }
            login.updateStudentOnServer(context);
        },

        trimProblemReports: function (ids) {
            var i;
            for (i = 0; i < login.currentStudent.problemReports.length; i++) {
                if ($.inArray(login.currentStudent.problemReports[i].id, ids) >= 0) {
                    login.currentStudent.problemReports.splice(i, 1);
                    i--;
                }
            }
            login.updateStudentOnServer();
        }
    };
});