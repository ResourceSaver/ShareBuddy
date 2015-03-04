declare function StandAloneDetectorIOS();
declare function StandAloneDetectorAndroid();

class System {
    private static connection: Connection;
    private static gw: number;
    private static gh: number;
    private static gesture: Gesture;
    private static userData: UserData;
    public static CanvasWidth = 480;
    public static CanvasHeight = 320;
    private static os: OS;
    private static ls: LocalStorageSB;
    private static loginCallback;
    private version: string = "ShareBuddy v. 2.1.0";

    public constructor() {
        $("#version").html(this.version);
        System.os = this.CheckOS();
        System.ls = new LocalStorageSB();
        System.connection = new Connection();
    }

    public Setup() {
        this.SetScreenSize();
        System.gesture = new Gesture(System.os);
    }
    
    public static Login(callback, username: string, password: string) {
        this.loginCallback = callback;
        this.connection.Login((r) => this.LoginResponse(r), username, password);
    }

    public static LoginResponse(data) {
        if (data == null) { this.loginCallback(null); }
        else {
            if (data["login"]) {
                this.GetLocalStorage().write('loggedin', 'true');
                this.userData = new UserData();
                this.userData.SetData(data);
            }

            this.loginCallback(data["login"]);
        }
    }

    private SetScreenSize() {

        System.gw = $(window).width();
        System.gh = $(window).height();

        if (System.gh > System.gw) {

            System.gw = $(window).height();
            System.gh = $(window).width();
        }

        if (System.os == OS.OTHER) { 

            System.gw = 480;
            System.gh = 320;

            $("[data-role=page]").addClass('pagePC');

            $("#background").removeClass("canvas");
            $("#background").addClass("canvasPC");
            $("#mid1").removeClass("canvas");
            $("#mid1").addClass("canvasPC");
            $("#mid2").removeClass("canvas");
            $("#mid2").addClass("canvasPC");
            $("#text").removeClass("canvas");
            $("#text").addClass("canvasPC");

            $("#backgroundMain").removeClass("canvas");
            $("#backgroundMain").addClass("canvasPC");
            $("#canvasMain").removeClass("canvas");
            $("#canvasMain").addClass("canvasPC");

            $("[data-role=page]").addClass("page");
            $("[data-role=header]").addClass("header");
            $("[data-role=footer]").addClass("footer");
            $("[data-role=header]").attr('data-theme', 'b');
            $("[data-role=footer]").attr('data-theme', 'b');
            $(".ui-content").addClass("mainPC");
            $("[data-role=footer]").removeAttr('data-position');
        }
    }

    public static RememberMe() {
        System.GetLocalStorage().write("username", $("#Name").val());
        System.GetLocalStorage().write("password", $("#Password").val());
    }

    public static Logout() {
        System.GetLocalStorage().Remove('loggedin');
        refreshPage();
    }

    public static GetUserData() { return this.userData; }

    public static GetLocalStorage() { return this.ls; }

    public static IsLoggedIn(): boolean { return System.GetLocalStorage().Get("loggedin") == 'true'; }

    public static GetOS() { return this.os; }

    private CheckOS() {
        var os: OS = OS.OTHER;
        var ua = navigator.userAgent;

        var checker = {
            iphone: ua.match(/(iPhone|iPod|iPad)/),
            blackberry: ua.match(/BlackBerry/),
            android: ua.match(/Android/),
            windowsmobile: ua.match(/iemobile/)
        };

        if (checker.android) { os = OS.ANDROID; }
        else if (checker.windowsmobile) { os = OS.WINDOWSMOBILE; }
        else if (checker.iphone) { os = OS.IOS; }

        return os;
    }

    public static GetGesture() { return System.gesture; }

    public static GetConnection() { return System.connection; }

    public static StandAloneMode(): boolean {

        if (this.os == OS.ANDROID) {  return StandAloneDetectorAndroid(); }
        else if (this.os == OS.IOS) return StandAloneDetectorIOS();
        return false;
    }

    public static GetGH() { return System.gh; }

    public static GetGW() { return System.gw; }
}

class LocalStorageSB {

    private supported: boolean;

    public ShowRankingOverlay(): boolean {
        if (this.Get('ranking') == 'true'){
            return false;
        }
        else {
            this.write('ranking', 'true');
            return true;
        }
    }

    public IsItANewDay(): boolean {
        var date: Date = new Date();

        if (date.getHours() < System.GetUserData().GetUpdateHour())
            date.setDate(date.getDate() - 1);

        var day = (date.getDate() + date.getMonth() + date.getFullYear()).toString();

        if (this.Get('day') == null || this.Get('day') === '') {
            this.write('day', day);
            return false;
        }

        if (this.Get('day') === day) {
            return false;
        }
        else {
            this.write('day', day);
            return true;
        }
    }

    public constructor() { this.supported = typeof(Storage) != "undefined"; }

    public write(key: string, value: string): void {

        if (!this.supported) return;

        try { window.localStorage.setItem(key, value); }
        catch (e)
        {
             // private mode
        }
    }

    public Remove(key: string): void {

        if (!this.supported) return;

        try { window.localStorage.removeItem(key); }
        catch (e) {
            // private mode
        }

    }

    public Get(key: string): string {

        if (!this.supported) return "";

        try {
            return window.localStorage.getItem(key);
        }
        catch (e) {
            return "";
               // private mode
        }

        return "";
    }
}

class Gesture {
    private subscriber: IMiniGame;
    private pcOffset: number = 0;

    public Subscribe(subscriber: IMiniGame) { this.subscriber = subscriber; }

    public constructor(os: OS) {
        if (os == OS.OTHER) {
            this.pcOffset = - (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2) + (System.GetGW() / 2);
        }

        $("#text").on('vmousedown', (event) => this.Click(event));
        $("#text").on('vmouseup', (event) => this.ClickUp(event));
    }

    private ClickUp(event) {
        this.subscriber.ClickUp();
    }

    private Click(event) {
        event.preventDefault();

        if (this.subscriber != null)
        this.subscriber.Click(event.pageX + this.pcOffset, event.pageY);
    }
}

