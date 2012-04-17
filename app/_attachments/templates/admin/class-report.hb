<table>
    <tr><th>Student Name</th><th>Difficulty Level</th><th>Answered Correctly</th><th>Answered Incorrectly</th></tr>
    {{#each rows}}
    <tr><td class="subheader">{{studentID}}</td></tr>
    {{#each_with_index scoresByDifficulty}}
    <tr><td class="emptycell"></td><td>{{index}}</td><td>{{correct}}</td><td>{{incorrect}}</td></tr>
    {{/each_with_index}}
      {{/each}}
</table>
