var System = (function () {
    function System() {
        this.version = "ShareBuddy v. 2.0.0.0";
        $("#version").html(this.version);
        System.os = this.CheckOS();
        System.ls = new LocalStorageSB();
        System.connection = new Connection();
    }
    System.prototype.Setup = function () {
        this.SetScreenSize();
        System.gesture = new Gesture(System.os);
    };

    System.Login = function (callback, username, password) {
        var _this = this;
        this.loginCallback = callback;
        this.connection.Login(function (r) {
            return _this.LoginResponse(r);
        }, username, password);
    };

    System.LoginResponse = function (data) {
        if (data == null) {
            this.loginCallback(null);
        } else {
            if (data["login"]) {
                this.GetLocalStorage().write('loggedin', 'true');
                this.userData = new UserData();
                this.userData.SetData(data);
            }

            this.loginCallback(data["login"]);
        }
    };

    System.prototype.SetScreenSize = function () {
        System.gw = $(window).width();
        System.gh = $(window).height();

        if (System.gh > System.gw) {
            System.gw = $(window).height();
            System.gh = $(window).width();
        }

        if (System.os == 3 /* OTHER */) {
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
    };

    System.RememberMe = function () {
        System.GetLocalStorage().write("username", $("#Name").val());
        System.GetLocalStorage().write("password", $("#Password").val());
    };

    System.Logout = function () {
        System.GetLocalStorage().Remove('loggedin');
        refreshPage();
    };

    System.GetUserData = function () {
        return this.userData;
    };

    System.GetLocalStorage = function () {
        return this.ls;
    };

    System.IsLoggedIn = function () {
        return System.GetLocalStorage().Get("loggedin") == 'true';
    };

    System.GetOS = function () {
        return this.os;
    };

    System.prototype.CheckOS = function () {
        var os = 3 /* OTHER */;
        var ua = navigator.userAgent;

        var checker = {
            iphone: ua.match(/(iPhone|iPod|iPad)/),
            blackberry: ua.match(/BlackBerry/),
            android: ua.match(/Android/),
            windowsmobile: ua.match(/iemobile/)
        };

        if (checker.android) {
            os = 0 /* ANDROID */;
        } else if (checker.windowsmobile) {
            os = 2 /* WINDOWSMOBILE */;
        } else if (checker.iphone) {
            os = 1 /* IOS */;
        }

        return os;
    };

    System.GetGesture = function () {
        return System.gesture;
    };

    System.GetConnection = function () {
        return System.connection;
    };

    System.StandAloneMode = function () {
        if (this.os == 0 /* ANDROID */) {
            return StandAloneDetectorAndroid();
        } else if (this.os == 1 /* IOS */)
            return StandAloneDetectorIOS();
        return false;
    };

    System.GetGH = function () {
        return System.gh;
    };

    System.GetGW = function () {
        return System.gw;
    };
    System.CanvasWidth = 480;
    System.CanvasHeight = 320;
    return System;
})();

var LocalStorageSB = (function () {
    function LocalStorageSB() {
        this.supported = typeof (Storage) != "undefined";
    }
    LocalStorageSB.prototype.ShowRankingOverlay = function () {
        if (this.Get('ranking') == 'true') {
            return false;
        } else {
            this.write('ranking', 'true');
            return true;
        }
    };

    LocalStorageSB.prototype.IsItANewDay = function () {
        var date = new Date();

        if (date.getHours() < System.GetUserData().GetUpdateHour())
            date.setDate(date.getDate() - 1);

        var day = (date.getDate() + date.getMonth() + date.getFullYear()).toString();

        if (this.Get('day') == null || this.Get('day') === '') {
            this.write('day', day);
            return false;
        }

        if (this.Get('day') === day) {
            return false;
        } else {
            this.write('day', day);
            return true;
        }
    };

    LocalStorageSB.prototype.write = function (key, value) {
        if (!this.supported)
            return;

        try  {
            window.localStorage.setItem(key, value);
        } catch (e) {
        }
    };

    LocalStorageSB.prototype.Remove = function (key) {
        if (!this.supported)
            return;

        try  {
            window.localStorage.removeItem(key);
        } catch (e) {
        }
    };

    LocalStorageSB.prototype.Get = function (key) {
        if (!this.supported)
            return "";

        try  {
            return window.localStorage.getItem(key);
        } catch (e) {
            return "";
        }

        return "";
    };
    return LocalStorageSB;
})();

var Gesture = (function () {
    function Gesture(os) {
        var _this = this;
        this.pcOffset = 0;
        if (os == 3 /* OTHER */) {
            this.pcOffset = -(Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2) + (System.GetGW() / 2);
        }

        $("#text").on('vmousedown', function (event) {
            return _this.Click(event);
        });
        $("#text").on('vmouseup', function (event) {
            return _this.ClickUp(event);
        });
    }
    Gesture.prototype.Subscribe = function (subscriber) {
        this.subscriber = subscriber;
    };

    Gesture.prototype.ClickUp = function (event) {
        this.subscriber.ClickUp();
    };

    Gesture.prototype.Click = function (event) {
        event.preventDefault();

        if (this.subscriber != null)
            this.subscriber.Click(event.pageX + this.pcOffset, event.pageY);
    };
    return Gesture;
})();
