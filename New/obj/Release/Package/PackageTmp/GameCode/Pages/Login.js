var Login = (function () {
    function Login() {
        var _this = this;
        this.busy = false;
        $('#loginButton').on('click', function () {
            return _this.Login();
        });
        $("#Name").on('keyup', function (e) {
            return _this.keyPress(e);
        });
        $("#Password").on('keyup', function (e) {
            return _this.keyPress(e);
        });
    }
    Login.prototype.Show = function () {
        this.username = System.GetLocalStorage().Get("username");
        this.password = System.GetLocalStorage().Get("password");
        $("#Name").val(this.username);
        $("#Password").val(this.password);

        if (System.IsLoggedIn()) {
            this.Call();
        } else {
            $("#signin").show();
            $("#loginButton").removeClass('ui-disabled');
            $.mobile.changePage("#login", { changeHash: false, transition: transitions });
        }
    };

    Login.prototype.Call = function () {
        var _this = this;
        $.mobile.loading("show");
        System.Login(function (success) {
            return _this.LoginCB(success);
        }, this.username, this.password);
    };

    Login.prototype.LoginCB = function (success) {
        if (success == null) {
            $("#loginmessage").html("<strong>Connection failed</strong>");
            $("#loginButton").removeClass('ui-disabled');
            $("#signin").show();
            $.mobile.changePage("#login", { changeHash: false, transition: transitions });
        } else if (!success) {
            $("#loginmessage").html("<strong>Login failed</strong>");
            $("#loginButton").removeClass('ui-disabled');
            $("#signin").show();
            $.mobile.changePage("#login", { changeHash: false, transition: transitions });
        } else if (success) {
            Game.DataReady();
        }

        $.mobile.loading("hide");
        this.busy = false;
    };

    Login.prototype.keyPress = function (event) {
        if (event.keyCode == 13) {
            if ($("#Name").val() != "" && $("#Password").val() != "") {
                this.Login();
            } else {
                $('#Name').blur();
            }
        }
    };

    Login.prototype.Login = function () {
        if (this.busy)
            return;

        this.busy = true;
        System.RememberMe();
        $("#loginButton").addClass('ui-disabled');
        this.username = $("#Name").val();
        this.password = $("#Password").val();
        this.Call();
    };
    return Login;
})();
