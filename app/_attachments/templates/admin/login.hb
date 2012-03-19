<form action="#/login" method="post">
    <input type="hidden" name="redirectpath" value="{{redirectpath}}">
    <label>Username: </label><input type="text" name="user"/>
    <label>Password: </label><input type="password" name="password"/>
    <input class="submit" type="submit" value="Log In"/>
</form>
<div id="loginInfo" style="display: none">Invalid username or password</div>