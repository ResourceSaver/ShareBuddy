var Timer = (function () {
    function Timer() {
        this.SetLoginDate(new Date());
        this.currentHour = -1;
        this.currentMinutte = -1;
        Timer.newDayHour = System.GetUserData().GetUpdateHour();
        this.Tick();
    }
    Timer.prototype.start = function () {
        var _this = this;
        this.timer = setInterval(function () {
            return _this.Tick();
        }, 1000);
    };

    Timer.prototype.stop = function () {
        clearInterval(this.timer);
    };

    Timer.prototype.Tick = function () {
        var now = new Date();
        now.setTime(now.getTime() - System.GetUserData().GetTimeDelta());

        if (now.getHours() != this.currentHour) {
            this.currentHour = now.getHours();
            this.CheckNewDay(now, this.loginDate);
            MiniCast.HourChanged(this.currentHour);
        } else if (now.getDay() != this.loginDate.getDay()) {
            this.CheckNewDay(now, this.loginDate);
        }

        if (now.getMinutes() != this.currentMinutte) {
            this.currentMinutte = now.getMinutes();
            MiniCast.MinutteChanged(this.currentHour, this.currentMinutte);
        }
    };

    Timer.prototype.CheckNewDay = function (now, liDate) {
        var mili;

        if (now.getHours() >= Timer.newDayHour) {
            mili = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Timer.newDayHour, 0, 0, 0);
        } else {
            mili = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, Timer.newDayHour, 0, 0, 0);
        }

        if (liDate < mili) {
            this.SetLoginDate(now);
            $.mobile.changePage("#dayisoverpage", { changeHash: false, transition: transitions });
            setTimeout(function () {
                return Game.ShowWaitingForNewDay();
            }, 5000);
        }
    };

    Timer.prototype.SetLoginDate = function (date) {
        this.loginDate = date;
        this.loginDate.setTime(this.loginDate.getTime() - System.GetUserData().GetTimeDelta());
    };
    return Timer;
})();
