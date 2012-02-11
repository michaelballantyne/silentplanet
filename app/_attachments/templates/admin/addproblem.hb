<table>
    <tr><th>Problem</th><th>Answer</th><th>Difficulty</th></tr>
    {{#rows}}
    <tr><td>{{value.problem}}</td><td>{{value.answer}}</td><td>{{value.difficulty}}</td><td><a href="#/problems/delete/{{value._id}}/{{value._rev}}">X</a></td></tr>
    {{/rows}}
</table>
    
</table>

<form action="#/problems" method="post">
    <label>Problem: </label><textarea rows="4" cols="30" id="question" name="question"></textarea>
	<label>Difficulty: </label><input  type="number" name="difficulty" min="1" max="5">
    <label>Answer: </label><input type="text" name="answer"><input type="submit" value="Submit">
</form>