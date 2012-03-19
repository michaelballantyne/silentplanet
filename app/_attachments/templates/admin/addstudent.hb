<table>
    <tr><th>Students</th><th>Difficulty Level</th></tr>
    {{#rows}}
    <tr><td>{{value.username}}</td><td>{{formatDifficulty value.difficultySetting}}</td><td><a href="#/students/delete/{{value._id}}/{{value._rev}}">X</a></td></tr>
    {{/rows}}
</table>
    
</table>

<form action="#/students" method="post">
    <label>Student: </label><input type="text" name="username"/>
    <label>Difficulty Setting:  </label><input type="number" name="difficultySetting"/>
    <input type="submit" value="Submit">
</form>