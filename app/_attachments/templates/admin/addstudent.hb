<table>
    <tr><th>Students</th></tr>
    {{#rows}}
    <tr><td>{{value.username}}</td><td><a href="#/students/delete/{{value._id}}/{{value._rev}}">X</a></td></tr>
    {{/rows}}
</table>
    
</table>

<form action="#/students" method="post">
    <label>Student: </label><input type="text" name="username"/>
    <input type="submit" value="Submit">
</form>