<table>
    <tr><th>Problem</th><th>Answer</th></tr>
    {{#rows}}
    <tr><td>{{value.problem}}</td><td>{{value.answer}}</td><td><a href="#/problems/delete/{{value._id}}/{{value._rev}}">X</a></td></tr>
    {{/rows}}
</table>
    
</table>

<form action="#/problems" method="post">
    <label>Problem: </label><textarea rows="4" cols="30" name="question"></textarea>

    <label>Answer: </label><input type="text" name="answer">
    <input type="submit" value="Submit">
</form>