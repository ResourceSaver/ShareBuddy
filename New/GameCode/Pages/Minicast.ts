 class MiniCast{
     private static currentHourBox: HTMLDivElement;
     private static label: HTMLSpanElement;
     private static coloursToday;
     private static coloursTomorrow;
     private static currentHour: number;
     private static currentMinutte: number;

     public static Setup(): void {
         $("#miniforecast").css({ "left": (System.GetGW() - 110).toString() + "px" });
         this.currentHourBox = <HTMLDivElement> $("#currentHour")[0];
         this.label = <HTMLSpanElement> $("#minitimer")[0];
         this.coloursToday = Forecast.GetColoursToday();
    }

     public static MinutteChanged(hour: number, minutte: number) {
         if ($("#offline").is(":visible")) return;

         this.currentMinutte = minutte;

         var minutteStr: string = "";
         var hourStr: string = "";

         if (minutte < 10) minutteStr = "0" + minutte;
         else minutteStr = minutte.toString();

         if (hour < 10) hourStr = "0" + hour;
         else hourStr = hour.toString();

         if (this.label != null)
             this.label.innerHTML = hourStr + ":" + minutteStr + "&nbsp;" + "&nbsp;";
     }

     public static HourChanged(hour: number) {

         if ($("#offline").is(":visible")) return;

         this.currentHour = hour;

         if (hour == 0 && this.currentMinutte == 59) {
             this.coloursToday = this.coloursTomorrow;
             this.coloursTomorrow = null;
         }

         this.CheckTomorow();
     }

     private static CheckTomorow() {
         if (this.coloursTomorrow == null && (this.currentHour > 18 || this.currentHour < Timer.newDayHour)) {
             System.GetConnection().GetTomorrowsForecast((r) => this.TomorowsForecastReadyCallback(r));
         }
         else {
             this.UpdateBoxes();
         }
     }

     private static TomorowsForecastReadyCallback(forecast) {
         if (forecast == null) return;

         this.coloursTomorrow = ForecastService.GetForecastColours(forecast);
         this.UpdateBoxes();
     }

     private static UpdateBoxes() {
         this.ColourBox("currentHour", this.currentHour);
         this.ColourBox("nextHour", this.currentHour + 1);
         this.ColourBox("thirdHour", this.currentHour + 2);
     }

     private static ColourBox(divName: string, hour: number) {
         var colour;

         if (this.coloursToday == null) return;

         if (this.coloursTomorrow != null && hour >= this.coloursToday.length) {
             colour = this.coloursTomorrow[hour % 24];
         }
         else if (this.coloursToday != null) {
             colour = this.coloursToday[hour];
         }

         if (colour == null) return;

         var div = <HTMLDivElement> $("#" + divName)[0];
         div.style.backgroundColor = "rgb(" + colour[0] + ", " + colour[1] + ", " + colour[2] + ")";
     }
 }