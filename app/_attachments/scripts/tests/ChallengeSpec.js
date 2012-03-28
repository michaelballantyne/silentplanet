define('controllers/login', [], {currentStudent: {difficultySetting: 3}});

require(['controllers/challenge', 'controllers/login', 'models/problems'], function (challenge, login, problems) {
    describe("Challenge", function () {
            var problem = [];
                problem[0] = {value: problems.createProblem("1", "1", 1)};
                problem[1]={value: problems.createProblem("1","1",2)};
                problem[2]={value: problems.createProblem("1","1",3)};
                problem[3]={value: problems.createProblem("1","1",4)};
                problem[4]={value: problems.createProblem("1","1",5)};

            it("shouldn't call problems above the students difficulty setting", function(){
                for(var i=0; i<1000; i++)
                {
                    var currentProblem = challenge.chooseRandomProblem(problem, {difficultySetting: 3});
                    expect(3 >= currentProblem.difficulty).toBeTruthy();
                }
            });
            it("test", function () {
                expect(login.currentStudent.difficultySetting === 3).toBeTruthy();
            });
    });
});