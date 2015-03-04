var MiniCast = (function () {
    function MiniCast() {
    }
    MiniCast.Setup = function () {
        $("#miniforecast").css({ "left": (System.GetGW() - 110).toString() + "px" });
        this.currentHourBox = $("#currentHour")[0];
        this.label = $("#minitimer")[0];
        this.coloursToday = Forecast.GetColoursToday();
    };

    MiniCast.MinutteChanged = function (hour, minutte) {
        if ($("#offline").is(":visible"))
            return;

        this.currentMinutte = minutte;

        var minutteStr = "";
        var hourStr = "";

        if (minutte < 10)
            minutteStr = "0" + minutte;
        else
            minutteStr = minutte.toString();

        if (hour < 10)
            hourStr = "0" + hour;
        else
            hourStr = hour.toString();

        if (this.label != null)
            this.label.innerHTML = hourStr + ":" + minutteStr + "&nbsp;" + "&nbsp;";
    };

    MiniCast.HourChanged = function (hour) {
        if ($("#offline").is(":visible"))
            return;

        this.currentHour = hour;

        if (hour == 0 && this.currentMinutte == 59) {
            this.coloursToday = this.coloursTomorrow;
            this.coloursTomorrow = null;
        }

        this.CheckTomorow();
    };

    MiniCast.CheckTomorow = function () {
        var _this = this;
        if (this.coloursTomorrow == null && (this.currentHour > 18 || this.currentHour < Timer.newDayHour)) {
            System.GetConnection().GetTomorrowsForecast(function (r) {
                return _this.TomorowsForecastReadyCallback(r);
            });
        } else {
            this.UpdateBoxes();
        }
    };

    MiniCast.TomorowsForecastReadyCallback = function (forecast) {
        if (forecast == null)
            return;

        this.coloursTomorrow = ForecastService.GetForecastColours(forecast);
        this.UpdateBoxes();
    };

    MiniCast.UpdateBoxes = function () {
        this.ColourBox("currentHour", this.currentHour);
        this.ColourBox("nextHour", this.currentHour + 1);
        this.ColourBox("thirdHour", this.currentHour + 2);
    };

    MiniCast.ColourBox = function (divName, hour) {
        var colour;

        if (this.coloursToday == null)
            return;

        if (this.coloursTomorrow != null && hour >= this.coloursToday.length) {
            colour = this.coloursTomorrow[hour % 24];
        } else if (this.coloursToday != null) {
            colour = this.coloursToday[hour];
        }

        if (colour == null)
            return;

        var div = $("#" + divName)[0];
        div.style.backgroundColor = "rgb(" + colour[0] + ", " + colour[1] + ", " + colour[2] + ")";
    };
    return MiniCast;
})();
