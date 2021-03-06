﻿var Forecast = (function () {
    function Forecast() {
        if (System.GetUserData().GetUsage() == null)
            return;

        this.forecast = System.GetUserData().GetUsage()["forecastToday"];
        this.forecastYesterday = System.GetUserData().GetUsage()["forecastYesterday"];
        this.baseline = System.GetUserData().GetUsage()["electricityBaselineArray"];
        this.usage = System.GetUserData().GetUsage()["eusage"];
    }
    Forecast.prototype.Setup = function () {
        this.ForecastToday();
        this.UsageForecast();
        this.ForecastYesterday();

        this.Suggestions();
    };

    Forecast.prototype.ForecastToday = function () {
        Forecast.coloursToday = ForecastService.GetForecastColours(this.forecast);
        var div = ForecastDivMaker.Make(true);
        ForecastDivMaker.Fill(div, Forecast.coloursToday);
        $(".forecast").append(div);
    };

    Forecast.GetColoursToday = function () {
        return Forecast.coloursToday;
    };

    Forecast.prototype.UsageForecast = function () {
        var colourCodeUsage = ForecastService.GetUsageColours(this.usage);
        var div = ForecastDivMaker.Make(true);
        ForecastDivMaker.Fill(div, colourCodeUsage);
        $(".usageforecast").append(div);
    };

    Forecast.prototype.ForecastYesterday = function () {
        var colourCodes = ForecastService.GetForecastColours(this.forecastYesterday);
        var div = ForecastDivMaker.Make(true);
        ForecastDivMaker.Fill(div, colourCodes);
        $(".forecastyesterday").append(div);
    };

    Forecast.prototype.ForecastBaseline = function () {
        var colourCodeBaseline = ForecastService.GetUsageColours(this.baseline);
        var div = ForecastDivMaker.Make(false);
        ForecastDivMaker.Fill(div, colourCodeBaseline);
        $(".forecastBaseline").append(div);
    };

    Forecast.prototype.Suggestions = function () {
        var suggestions = ForecastService.GetSuggestions(this.forecast);
        $(".forecastSuggestions").append(suggestions);
    };
    return Forecast;
})();

var ForecastService = (function () {
    function ForecastService() {
    }
    ForecastService.GetForecastColours = function (forecastToday) {
        return ColourArray.GetColourArray(forecastToday);
    };

    ForecastService.GetUsageColours = function (usage) {
        return ColourArray.GetColourArray2(usage, 255, 246, 0, false);
    };

    ForecastService.GetSuggestions = function (forecast) {
        if (forecast == null)
            return document.createElement('div');

        var startHour = 17;
        var endHour = 20;
        var startHourMorning = 6;
        var endHourMorning = 9;
        var startHourLunch = 12;
        var endHourLunch = 14;

        var bestVal = forecast[startHour];
        var bestI;
        var bestValMorning = forecast[startHourMorning];
        var bestValLunch = forecast[startHourLunch];
        var bestIMorning;
        var bestILunch;

        for (var i = 0; i <= forecast.length; i++) {
            if (i >= startHour && i <= endHour)
                if (forecast[i] <= bestVal) {
                    bestVal = forecast[i];
                    bestI = i;
                }
            if (i >= startHourMorning && i <= endHourMorning) {
                if (forecast[i] <= bestValMorning) {
                    bestValMorning = forecast[i];
                    bestIMorning = i;
                }
            }

            if (i >= startHourLunch && i <= endHourLunch) {
                if (forecast[i] <= bestValLunch) {
                    bestValLunch = forecast[i];
                    bestILunch = i;
                }
            }
        }

        var div = document.createElement('div');
        var p = document.createElement('p');
        p.innerHTML = "<strong>Suggestions</strong><br/>" + "Morning ritual at <span>0" + bestIMorning + ":00" + "</span><br / > Cooking lunch at <span>" + bestILunch + ":00" + "</span><br / > Cooking dinner at <span>" + bestI + ":00" + "</span><br / ><br / > ";

        div.appendChild(p);

        return div;
    };
    return ForecastService;
})();

var ForecastDivMaker = (function () {
    function ForecastDivMaker() {
    }
    ForecastDivMaker.Make = function (makeTime) {
        var div = document.createElement("div");
        var timeofday = document.createElement("div");
        var containerDiv = document.createElement("div");

        var size = (100 / 24);

        for (var i = 0; i < 24; i++) {
            var newDiv = document.createElement("div");
            newDiv.className = "forecastElement";
            newDiv.style.width = size + "%";

            if (i == 23) {
                newDiv.style.borderRight = "solid";
                newDiv.style.borderRightWidth = "1px";
                newDiv.style.borderRightColor = "#black";
            }

            var timeDiv = document.createElement("div");
            timeDiv.className = "forecastTime";
            timeDiv.style.width = size + "%";
            timeDiv.innerHTML = "&nbsp;";

            if (i % 3 == 0 && makeTime) {
                if (i == 0)
                    timeDiv.innerHTML = "24.00";
                else
                    timeDiv.innerHTML = i + ".00";
            }
            if (makeTime)
                timeofday.appendChild(timeDiv);

            div.appendChild(newDiv);
        }
        containerDiv.appendChild(div);
        containerDiv.appendChild(timeofday);

        return containerDiv;
    };

    ForecastDivMaker.Fill = function (div, forecast) {
        if (forecast == null || forecast.length == 0) {
            $(div).html("No data available");
            return;
        }

        var div = div.firstElementChild;
        if (div == null)
            return;
        if (forecast == null)
            return;

        for (var i = 0; i < forecast.length; i++) {
            var d = div.children[i];

            var colour = forecast[i];
            d.style.backgroundColor = "rgb(" + colour[0] + ", " + colour[1] + ", " + colour[2] + ")";
        }
    };
    return ForecastDivMaker;
})();

var ColourArray = (function () {
    function ColourArray() {
    }
    ColourArray.GetColourArray2 = function (list, red, green, blue, invert) {
        if (list == null || list.length == 0)
            return;

        var max = 0;
        var min = 10000;

        for (var i = 0; i < list.length; i++) {
            if (list[i] > max) {
                max = list[i];
            }
            if (list[i] < min) {
                min = list[i];
            }
        }

        var diff = max - min;
        var rfact = red / diff;
        var gfact = green / diff;
        var bfact = blue / diff;
        var colourCodes = new Array();

        for (var i = 0; i < list.length; i++) {
            var g = Math.floor(gfact * (list[i] - min));
            var r = Math.floor(rfact * (list[i] - min));
            var b = Math.floor(bfact * (list[i] - min));

            if (invert) {
                g = Math.abs(g - green);
                r = Math.abs(r - red);
                b = Math.abs(b - blue);
            }

            colourCodes.push([r, g, b]);
        }

        return colourCodes;
    };

    ColourArray.GetColourArray = function (list) {
        if (list == null || list.length == 0)
            return;

        var max = 0;
        var min = 10000;

        for (var i = 0; i < list.length; i++) {
            if (list[i] > max) {
                max = list[i];
            }
            if (list[i] < min) {
                min = list[i];
            }
        }

        var orgHalf = (max - min) / 2;
        var fact = 255 / orgHalf;
        var colourCodes = new Array();

        for (var i = 0; i < list.length; i++) {
            if (list[i] - min < orgHalf) {
                var colour = Math.round(((list[i] - min) * fact));

                colourCodes.push([colour, 255, 0]);
            } else {
                var colour = Math.round(255 - ((list[i] - orgHalf) * fact));

                colourCodes.push([255, colour, 0]);
            }
        }

        return colourCodes;
    };
    return ColourArray;
})();

var Day = (function () {
    function Day() {
        Day.weekday[0] = "Sunday";
        Day.weekday[1] = "Monday";
        Day.weekday[2] = "Tuesday";
        Day.weekday[3] = "Wednesday";
        Day.weekday[4] = "Thursday";
        Day.weekday[5] = "Friday";
        Day.weekday[6] = "Saturday";
    }
    Day.GetYesterday = function () {
        var d = new Date();
        var n = d.getDay() - 1;

        if (n < 0)
            n = 6;

        return Day.weekday[n];
    };

    Day.GetToday = function () {
        var d = new Date();
        return Day.weekday[d.getDay()];
    };
    Day.weekday = new Array(7);
    return Day;
})();

var Highscore = (function () {
    function Highscore() {
    }
    Highscore.LoadHighscores = function (id) {
        var _this = this;
        System.GetConnection().Gethighscore(id, function (data) {
            return _this.LoadHighscoresCB(data);
        });
    };

    Highscore.LoadHighscoresCB = function (data) {
        this.data = data;
        this.Make();
    };

    Highscore.Make = function () {
        $(".hightable tr").remove();

        var html = "<tr class=\"ui - bar - d\" ><th data - priority = \"2\" > User </th > <th data - priority = \"1\" > Score </th >< / tr>";

        for (var i = 0; i < this.data.length; i++) {
            var o = this.data[i];

            html = html + "<tr>";
            html = html + "<td>" + o["buddyname"] + "</td>";
            html = html + "<td>" + o["score"] + "</td>";
            html = html + "</tr>";
        }

        $(".hightable > tbody").append(html);
    };
    return Highscore;
})();
