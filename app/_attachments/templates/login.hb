<form action="#/login" method="post">
    <input type="hidden" name="redirectpath" value="{{redirectpath}}">
    <label>Username: </label><input type="text" name="user"/>
    <input class="submit" type="submit" value="Log In"/>
</form>
<div id="loginInfo" style="display: none">Invalid username</div>
<a href="#/admin/login?page={{escape redirectpath}}">Administrator Login</a>