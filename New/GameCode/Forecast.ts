class Forecast {
    private forecast;
    private forecastYesterday;
    private baseline;
    private usage;
    private static coloursToday;

    public constructor() {
        if (System.GetUserData().GetUsage() == null) return;

        this.forecast = System.GetUserData().GetUsage()["forecastToday"];
        this.forecastYesterday = System.GetUserData().GetUsage()["forecastYesterday"];
        this.baseline = System.GetUserData().GetUsage()["electricityBaselineArray"];
        this.usage = System.GetUserData().GetUsage()["eusage"];
    }

    public Setup() {
        this.ForecastToday();
        this.UsageForecast();
        this.ForecastYesterday();
        //this.ForecastBaseline();
        this.Suggestions();
    }

    private  ForecastToday() {
        Forecast.coloursToday = ForecastService.GetForecastColours(this.forecast);
        var div = ForecastDivMaker.Make(true);
        ForecastDivMaker.Fill(div, Forecast.coloursToday);
        $(".forecast").append(div);
    }

    public static GetColoursToday() { return Forecast.coloursToday; }

    private UsageForecast() {
        var colourCodeUsage = ForecastService.GetUsageColours(this.usage);
        var div = ForecastDivMaker.Make(true);
        ForecastDivMaker.Fill(div, colourCodeUsage);
        $(".usageforecast").append(div);
    }

    private  ForecastYesterday() {
        var colourCodes = ForecastService.GetForecastColours(this.forecastYesterday);
        var div = ForecastDivMaker.Make(true);
        ForecastDivMaker.Fill(div, colourCodes);
        $(".forecastyesterday").append(div);
    }

    private  ForecastBaseline() {
        var colourCodeBaseline = ForecastService.GetUsageColours(this.baseline);
        var div = ForecastDivMaker.Make(false);
        ForecastDivMaker.Fill(div, colourCodeBaseline);
        $(".forecastBaseline").append(div);
    }

    public  Suggestions() {
        var suggestions = ForecastService.GetSuggestions(this.forecast);
        $(".forecastSuggestions").append(suggestions);
    }

}

class ForecastService {
    public static GetForecastColours(forecastToday: number[]) {
        return ColourArray.GetColourArray(forecastToday);
    }

    public static GetUsageColours(usage: number[]) {
        return ColourArray.GetColourArray2(usage, 255, 246, 0, false);
    }

    public static GetSuggestions(forecast): HTMLDivElement {

        if (forecast == null) return document.createElement('div');

        var startHour: number = 17;
        var endHour: number = 20;
        var startHourMorning: number = 6;
        var endHourMorning: number = 9;
        var startHourLunch: number = 12;
        var endHourLunch: number = 14;

        var bestVal: number = forecast[startHour];
        var bestI: number;
        var bestValMorning: number = forecast[startHourMorning];
        var bestValLunch: number = forecast[startHourLunch];
        var bestIMorning: number;
        var bestILunch: number;

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

        var div: HTMLDivElement = document.createElement('div');
        var p: HTMLParagraphElement = document.createElement('p');
        p.innerHTML = "<strong>Suggestions</strong><br/>" + "Morning ritual at <span>0" + bestIMorning + ":00" + "</span><br / > Cooking lunch at <span>" + bestILunch + ":00" + "</span><br / > Cooking dinner at <span>" + bestI + ":00" +"</span><br / ><br / > ";
        
        div.appendChild(p);

        return div;
    }
}

class ForecastDivMaker {

    public static Make(makeTime: boolean) {
        var div: HTMLDivElement = <HTMLDivElement> document.createElement("div");
        var timeofday: HTMLDivElement = <HTMLDivElement> document.createElement("div");
        var containerDiv: HTMLDivElement = <HTMLDivElement> document.createElement("div");

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
                if (i == 0) timeDiv.innerHTML = "24.00";
                else timeDiv.innerHTML = i + ".00";
            }
            if (makeTime)
                timeofday.appendChild(timeDiv);

            div.appendChild(newDiv);
        }
        containerDiv.appendChild(div);
        containerDiv.appendChild(timeofday);

        return containerDiv;
    }

    public static Fill(div:HTMLDivElement, forecast:number[]) {

        if (forecast == null || forecast.length == 0) {
            $(div).html("No data available");
            return;
        }

        var div: HTMLDivElement = <HTMLDivElement> div.firstElementChild;
        if (div == null) return;
        if (forecast == null) return;

        for (var i = 0; i < forecast.length; i++) {
            var d: HTMLDivElement = <HTMLDivElement> div.children[i];

            var colour = forecast[i];
            d.style.backgroundColor = "rgb(" + colour[0] + ", " + colour[1] + ", " + colour[2] + ")";
        }
    }
}

class ColourArray {

    public  static GetColourArray2(list:number[], red:number, green:number, blue:number, invert:boolean) {

        if (list == null || list.length == 0) return;

        var max: number = 0;
        var min: number = 10000;

        for (var i = 0; i < list.length; i++) {
            if (list[i] > max) { max = list[i]; }
            if (list[i] < min) { min = list[i]; }
        }

        var diff = max - min;
        var rfact: number = red / diff;
        var gfact: number = green / diff;
        var bfact: number = blue / diff;
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
    }

    public static GetColourArray(list: number[]) {

        if (list == null || list.length == 0) return;

        var max: number = 0;
        var min: number = 10000;

        for (var i = 0; i < list.length; i++) {
            if (list[i] > max) { max = list[i]; }
            if (list[i] < min) { min = list[i]; }
        }

        var orgHalf = (max - min) / 2;
        var fact = 255 / orgHalf;
        var colourCodes = new Array();

        for (var i = 0; i < list.length; i++) {

            if (list[i] - min < orgHalf) {
                var colour = Math.round(((list[i] - min) * fact));

                colourCodes.push([colour, 255, 0]);
            }
            else {
                var colour = Math.round( 255 - ((list[i] - orgHalf) * fact));

                colourCodes.push([255, colour, 0]);
            }
        }

        return colourCodes;
    }
}

class Day {

    private static weekday = new Array(7);

    constructor() {
        Day.weekday[0] = "Sunday";
        Day.weekday[1] = "Monday";
        Day.weekday[2] = "Tuesday";
        Day.weekday[3] = "Wednesday";
        Day.weekday[4] = "Thursday";
        Day.weekday[5] = "Friday";
        Day.weekday[6] = "Saturday";
    }

    public static GetYesterday() {

        var d = new Date();
        var n = d.getDay() - 1;

        if (n < 0) n = 6;

        return Day.weekday[n];
    }

    public static GetToday() {
        var d = new Date();
        return Day.weekday[d.getDay()];
    }
}