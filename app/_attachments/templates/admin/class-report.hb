<table>
    <tr><th>Student</th></tr>
    <tr><th></th><th>Difficulty</th><th>Correct</th><th>Incorrect</th></tr>
    {{#each rows}}
    <tr><td class="subheader">{{studentID}}</td></tr>
    {{#each_with_index scoresByDifficulty}}
    <tr><td class="emptycell"></td><td>{{formatDifficulty index}}</td><td>{{correct}}</td><td>{{incorrect}}</td></tr>
    {{/each_with_index}}
      {{/each}}
</table>
