<table>
    <tr><th>Problem</th><th>Difficulty</th><th>Correct</th><th>Incorrect</th></tr>
    {{#rows}}
    <tr><td>{{problem}}</td><td>{{formatDifficulty difficulty}}</td><td>{{correct}}</td><td>{{incorrect}}</td></tr>
    {{/rows}}
</table>