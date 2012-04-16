<table>
    <tr><th>Students</th><th>Difficulty Level</th></tr>
    {{#rows}}
    <tr><td>{{value.username}}</td><td>{{formatDifficulty value.difficultySetting}}</td><td><a href="#/admin/students/delete/{{value._id}}/{{value._rev}}">X</a></td></tr>
    {{/rows}}
</table>
    
</table>

<form action="#/admin/students" method="post">
    <label>Student: </label><input class="required username" type="text" name="username"/>
    <label>Difficulty Setting:  </label><input class="required" type="number" name="difficultySetting" min="1" max="5"/>
    <label>Password (provide a value to make admin): </label><input type="password" name="password"/>
    <input type="submit" value="Submit">
</form>