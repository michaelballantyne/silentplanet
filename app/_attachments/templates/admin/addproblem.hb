<table>
    <tr><th>Problem</th><th>Answer</th><th>Difficulty</th></tr>
    {{#rows}}
    <tr><td>{{value.problem}}</td><td>{{value.answer}}</td><td>{{formatDifficulty value.difficulty}}</td><td><a href="#/admin/problems/delete/{{value._id}}/{{value._rev}}">X</a></td></tr>
    {{/rows}}
</table>
    
</table>

<form action="#/admin/problems" method="post">
    <label>Problem: </label><textarea class="required" rows="4" cols="30" id="question" name="question"></textarea>
	<label>Difficulty: </label><input class="required" type="number" name="difficulty" min="1" max="5">
    <label>Answer: </label><input class="answer required" type="text" name="answer"><input class="submit" type="submit" value="Submit">
</form>