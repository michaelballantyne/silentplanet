define(['libraries/jquery', 'controllers/login', 'models/problems','models/students', 'models/problemreports', 'libraries/handlebars'], function($, login, problems, students, problemreports, Handlebars){
    Handlebars.registerHelper("each_with_index", function(array, fn) {
        var buffer = "";
        for (var i = 0, j = array.length; i < j; i++) {
            var item = array[i];

            // stick an index property onto the item, starting with 1, may make configurable later
            item.index = i;

            // show the inside of the block
            buffer += fn(item);
        }

        // return the finished buffer
        return buffer;

    });
    
    var DifficultyScore = function(correct, incorrect)
    {
        this.correct = correct;
        this.incorrect = incorrect;
    };
    
    var StudentReport = function(studentID)
    {
        this.studentID = studentID;
        this.scoresByDifficulty = [];
        var i;
        for(i = 0; i <= 5; i++)
            this.scoresByDifficulty[i] = new DifficultyScore(0,0);
    };

    return {
        buildStudentReport: function(context, callback)
        {
            var studentReports;
            var theseStudents = [];
            var idToDifficultyMap = [];
            students.getStudents(context,function(view)
            {
                //grab all the students
                if (view.rows.length !== 0)
                {   
                    var i;
                    for (i = 0; i < view.rows.length; i++)
                    {
                        theseStudents[i] = view.rows[i].value;
                    }
                    
                    //now grab all the problems
                    problems.getProblems(context, function(view)
                    {
                        if (view.rows.length !== 0)
                        {
                            var i;
                            for (i = 0; i < view.rows.length; i++)
                            {
                                var currentProblem = view.rows[i].value;
                                //map every problemID to a difficulty
                                idToDifficultyMap[currentProblem._id] = currentProblem.difficulty;
                            }
                            
                            studentReports = [];
                            for(i = 0; i < theseStudents.length; i++)
                            {
                                studentReports[i] = new StudentReport(theseStudents[i].username);
                                var j;
                                for(j = 0; j < theseStudents[i].problemReports.length; j++)
                                {
                                    var difficulty = idToDifficultyMap[theseStudents[i].problemReports[j].id];
                                    studentReports[i].scoresByDifficulty[difficulty].correct += theseStudents[i].problemReports[j].correct;
                                    studentReports[i].scoresByDifficulty[difficulty].incorrect += theseStudents[i].problemReports[j].incorrect;
                                }
                            }
                        }

                        callback(studentReports);
                    });
                }
            });
        }
    };
        });