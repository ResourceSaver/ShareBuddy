class Login{
    private busy: boolean = false;
    private username: string;
    private password: string;

    public constructor() {
        $('#loginButton').on('click', () => this.Login());
        $("#Name").on('keyup', (e) => this.keyPress(e));
        $("#Password").on('keyup', (e) => this.keyPress(e));
    }

    public Show() {

        this.username = System.GetLocalStorage().Get("username");
        this.password = System.GetLocalStorage().Get("password");
        $("#Name").val(this.username);
        $("#Password").val(this.password);

        if (System.IsLoggedIn()) { this.Call(); }
        else {
            $("#signin").show();
            $("#loginButton").removeClass('ui-disabled');
            $.mobile.changePage("#login", { changeHash: false, transition: transitions });
        }
    }

    private Call() {
        $.mobile.loading("show");
        System.Login((success) => this.LoginCB(success), this.username, this.password);
    }
    
    public LoginCB(success:boolean) {
        if (success == null) {
            $("#loginmessage").html("<strong>Connection failed</strong>");
            $("#loginButton").removeClass('ui-disabled');
            $("#signin").show();
            $.mobile.changePage("#login", { changeHash: false, transition: transitions });
        }
        else if (!success) {
            $("#loginmessage").html("<strong>Login failed</strong>");
            $("#loginButton").removeClass('ui-disabled');
            $("#signin").show();
            $.mobile.changePage("#login", { changeHash: false, transition: transitions });
        }
        else if (success) { Game.DataReady(); }

        $.mobile.loading("hide");
        this.busy = false;
    }

    private keyPress(event: KeyboardEvent) {
        if (event.keyCode == 13) {
            if ($("#Name").val() != "" && $("#Password").val() != "") { this.Login(); }
            else { $('#Name').blur(); }
        }
    }

    private Login() {
        if (this.busy) return;

        this.busy = true;
        System.RememberMe()
        $("#loginButton").addClass('ui-disabled');
        this.username = $("#Name").val();
        this.password = $("#Password").val();
        this.Call();
    }
} 