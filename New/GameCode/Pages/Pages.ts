class SetPet {
    public constructor() {
        $('#closePet').on('click', () => this.Click());
        $("#petname").on("keyup", (e) => this.keyPress(e));
        $("#male").on("click", () => this.EnableNextButton());
        $("#radio-choice-t-6b").on("click", () => this.EnableNextButton());

        if (System.GetUserData().GetBuddyName() != null && System.GetUserData().GetBuddyName() != "") {
            System.GetUserData().SetBuddyName(System.GetUserData().GetBuddyName().charAt(0).toUpperCase() + System.GetUserData().GetBuddyName().slice(1));
            $(".buddyName").html("<strong>" + System.GetUserData().GetBuddyName() + "</strong>");
        }
    }

    private EnableNextButton() {
        if (($("#petname").val()).length > 0 && ($("#male").is(":checked") || $("#radio-choice-t-6b").is(":checked"))) {
            $("#closePet").removeClass("ui-disabled");
        }
        else {
            $("#closePet").addClass("ui-disabled");
        }
    }

    public IsSet() {
        return System.GetUserData().GetBuddyName() != "";
    }

    public Show() {
        $.mobile.changePage("#setname", { changeHash: false, transition: transitions });
    }

    private keyPress(event: KeyboardEvent) {
        var name: string = $("#petname").val();

        if (name.length > 10) {
            $("#petname").val(name.substr(0, 10));
            $("#max10").show();
            event.preventDefault();
            return;
        }
        this.EnableNextButton();

        if (event.keyCode == 13) {

            if ($("#petname").val() == "") {
                $("#petname").blur();
            }
            else { this.Click(); }
        }
    }

    private bussy:boolean = false;

    public Click() {
        if (this.bussy) {
            return;
        }

        this.bussy = true;
        var label: HTMLInputElement = <HTMLInputElement> document.getElementById("petname");
        var male: boolean = $("#male").is(":checked");
        System.GetConnection().SetPetName(label.value, male, (r) => this.setnameCallback(r));
        System.GetUserData().SetBuddyName(label.value.charAt(0).toUpperCase() + label.value.slice(1));
        System.GetUserData().SetMale(male);
        $(".buddyName").html("<strong>" + System.GetUserData().GetBuddyName() + "</strong>");
        $.mobile.loading("show");
    }

    public setnameCallback(code:number) {
        $.mobile.loading("hide");

        if (code == 0) {
            $("#petnameerror").text("An error occurred. Please try again");
        }
        else if (code == 1) {
            $("#petnameerror").text("Name already taken.");
        }      
        else if (code == 2) {
            System.GetUserData().SetMale($("#male").is(":checked"));
            Game.ShowAgree();
        }  

        this.bussy = false;
    }
} 

class Agree {
    constructor() { $('#agrClose').on('click', () => this.Click()); }

    private Click() { Game.ChangePage(); }

    public Show() { $.mobile.changePage("#agreement", { changeHash: false, transition: transitions }); }
} 

declare function addToHomescreen(x);

class Homescreen {

    private ath;
    private callback;

    constructor(callback) {
        this.callback = callback;

        this.ath = addToHomescreen({
            autostart: false,
            lifespan: 0,
            modal: true,
            startDelay: 0,
            maxDisplayCount: 0,
            displayPace: 0
        });

        $("#showHomeScreenButton").bind('click', () => { this.ath.show(); });
        $("#closeATH").on('click', function () {
            callback();
        });
    }

    public Show() { $.mobile.changePage("#homescreen", { changeHash: false, transition: transitions }); }
}

class WelcomeBack {
    public constructor() {
        $("#closeWelcomeBack").bind('click', () => { Game.ChangePage(); });
    }

    public NewDay(): boolean {
        return System.GetLocalStorage().IsItANewDay();
    }

    public Show() {
        $.mobile.changePage("#welcomeback", { changeHash: false, transition: transitions });
    }
}

class Tutorial {

    private numberOfSlides: number = 0;
    private slideCount: number;
    private divs: HTMLDivElement;
    private first: boolean;
    private closed: boolean = false;

    public constructor() {
        $('#tutButton').on('click', () => Game.ShowTutorialAgain());
        $("#closeTut").on("click", () => this.Next());
        $("#back").on("click", () => this.Back());
        $("#tutcont").css({ "height": "100%" });
        $("#tutcont").css({ "width": "100%" });

        this.divs = <HTMLDivElement> $("#tutcont")[0];
        this.numberOfSlides = this.divs.children.length - 1;
    }

    public ShowFirst() {
        this.first = true;
        this.slideCount = 1;
        $("#back").addClass("ui-disabled");
        this.Show();
    }

    public ShowAgain() {
        this.slideCount = 0;
        this.first = false;
        $("#back").removeClass("ui-disabled");
        this.Show();
    }

    private Show() {
        this.closed = false;
        $(this.divs.children[this.slideCount]).show();
        $.mobile.changePage("#tutorial", { changeHash: false, transition: transitions });
    }

    public HasBeenSeen() { return System.GetLocalStorage().Get('isTutRead') == 'true'; }

    private Back() {
        if (this.slideCount == 2  && this.first) {
            $("#back").addClass("ui-disabled");
            $("#back").removeClass("ui-btn-active");
            $("#closeTut").removeClass("ui-btn-active");
        }

        if (this.slideCount > 0) {
            this.slideCount--;

            $(this.divs.children[this.slideCount + 1]).hide();
            $(this.divs.children[this.slideCount]).show();
        }
        else { Game.ChangePage(); }
    }

    private Next() {
        this.slideCount++;

        if (this.slideCount > 0 && this.first)
            $("#back").removeClass("ui-disabled");

        if (this.slideCount > this.numberOfSlides && !this.closed) {
            this.closed = true;
            System.GetLocalStorage().write('isTutRead', 'true');
            $(this.divs.children[this.slideCount - 1]).hide();
            Game.ChangePage()
        }
        else {
            $(this.divs.children[this.slideCount - 1]).hide();
            $(this.divs.children[this.slideCount]).show();
        }
    }
} 

class MiniGameResult {

    private cancelled: boolean;
    private score: number;
    private message: string;

    public constructor() {
        $("#minigameresultbutton").bind('click', (score, cancelled) => Game.MinigameCompleted(this.score, this.cancelled));
    }

    public Show(score: number, cancelled: boolean, id: number, action:Action) {
        this.cancelled = cancelled;
        this.score = score;

        var oldScore = this.CheckHighScore(id, score);
        $("#highscore").html("Your highscore: " + oldScore);

        $.mobile.changePage("#minigameresult", { changeHash: false, transition: transitions });

        $("#minigamescore").text(score.toString());
        $("#activityValue").text(action.GetValue().toString());
        $("#minigameresulttotal").html("<strong> Total " + (score + action.GetValue() + "</strong>"));
    }

    public CheckHighScore(id: number, score: number): number {
        var oldScore: number = +System.GetLocalStorage().Get("MG" + id.toString());

        if (oldScore == null) oldScore = 0;

        if (oldScore < score) {
            System.GetLocalStorage().write("MG" + id.toString(), score.toString());
        }

        return oldScore;
    }
}

class WaitingForNewDay {
    public Show() {
        $.mobile.changePage("#waitingfornewday", { changeHash: false, transition: transitions });
        System.GetConnection().IsDayReady((r) => this.IsDayReadyCB(r));
    }

    public IsDayReadyCB(r) {
        if (r == true) { refreshPage(); }
        else { setTimeout((r) => System.GetConnection().IsDayReady((r) => this.IsDayReadyCB(r)), 30000); }
    }
} 

class ConnectionError {
    public static Show() {
        $.mobile.changePage("#errorCon", { changeHash: false, transition: transitions });
        setTimeout(() => this.Close(), 4000);
    }

    public static Close() {
        System.GetLocalStorage().Remove("loggedin");
        refreshPage();
    }
} 

class Events {
    private hasBeenSeen: boolean = false;

    public constructor() { $("#eventsbutton").bind('click', () => Game.ChangePage()); }

    public Show() {
        this.hasBeenSeen = true;
        var event = System.GetUserData().GetEvent();

        if (event != null) {
            var eventText: string = event['text'];
            eventText = eventText.replace('[p]', System.GetUserData().GetBuddyName());
            eventText = eventText.replace('[v]', Math.abs(event['value']).toString());

            if (System.GetUserData().IsMale())
                eventText = eventText.replace('[g]', 'his');
            else
                eventText = eventText.replace('[g]', 'her');

            $("#eventmessage").html(eventText);
        }
        $.mobile.changePage("#events", { changeHash: false, transition: transitions });
    }

    public HasBeenSeen() { return (System.GetUserData().GetEvent() == null || this.hasBeenSeen); }
}

class HowToPlay {
    private actionType: string;

    public constructor() { $("#howtoplaybutton").on("click", () => this.Click()); }

    public Show(action: Action) {
        var actionType: string = action.GetType();
        var advice: string = Advice.GetAdvice(actionType);
        this.actionType = actionType;

        $("#advicetext").html('"' + advice + '"');
        $("#htpWhack").hide();
        $("#htpLeisure").hide();
        $("#htpCooking").hide();
        $("#htpRain").hide();

        switch (actionType) {
            case "Fitness":
                $("#htpWhack").show();
                break;
            case "Leisure":
                $("#htpLeisure").show();
                break;
            case "Cooking":
                $("#htpCooking").show();
                break;
            case "Hygiene":
                $("#htpRain").show();
                break;
        }

        $.mobile.changePage("#howotplay", { changeHash: false, transition: transitions });
    }

    private Click() { Game.ShowMinigame(this.actionType); }
} 

class Offline {
    public constructor() {
        $("#forecastO").hide();
        $("#rankingO").hide();
        $("#forecastButtonO").on("click", () => { $("#messageO").hide(); $("#forecastO").show(); $("#rankingO").hide(); });
        $("#rankingButtonO").on("click", () => { $("#messageO").hide(); $("#forecastO").hide(); $("#rankingO").show(); System.GetConnection().GetRanking((val) => this.RankingReady(val)); });
        $("#frontButtonO").on("click", () => { $("#messageO").show(); $("#forecastO").hide(); $("#rankingO").hide(); });
    }

    public Show() {
        $(".today").html(Day.GetToday());

        $(".newDayStartsAt").text("0" + System.GetUserData().GetUpdateHour() + ":00");
        $.mobile.changePage("#offline", { changeHash: false, transition: transitions });
    }

    public MoreToShow() { return System.GetUserData().IsMore(); }

    private RankingReady(val: string[][]) {
        $("#rankTableO tr").remove();
        $("#rankTableO").table("refresh");

        var html: string = "<tr class=\"ui - bar - d\" ><th data - priority = \"3\" > Place </th > <th data - priority = \"2\" > Name </th > <th data - priority = \"1\" > Score </th > < / tr>";

        for (var i = 0; i < val.length; i++) {
            var o = val[i];

            if (o["name"] == null || o["name"] == "") continue;

            html = html + "<tr>";
            if (o["king"] == true) {
                $("#shifternameO").html(o["name"]);
                html = html + "<td>" + (i + 1) + "<img src='Images/medal.png'/></td>";
            }
            else {
                html = html + "<td>" + (i + 1) + "</td>";
            }

            html = html + "<td>" + o["name"] + "</td>";
            html = html + "<td>" + o["score"] + "</td>";
            html = html + "</tr>";
        }

        $("#rankTableO > tbody").append(html);
        $("#rankTableO").table("refresh");
    }
}

class Ranking {
    public constructor() {
        $('#rankingButton').on('click', () => Game.ShowRankingPage());
        $("#closeRankButton").bind("click", () => Game.ChangePage());
    }

    public RankingReady(val: string[][]) {
        $("#rankTable tr").remove();
        $("#rankTable").table("refresh");

        var html: string = "<tr class=\"ui - bar - d\" ><th data - priority = \"3\" > Place </th > <th data - priority = \"2\" > Name </th > <th data - priority = \"1\" > Score </th > < / tr>";

        for (var i = 0; i < val.length; i++) {
            var o = val[i];

            if (o["name"] == null || o["name"] == "") continue;

            var name: string = o["name"];

            html = html + "<tr>";
            if (o["king"] == true) {
                $("#shiftername").html(o["name"]);
                html = html + "<td>" + (i + 1) + "<img src='Images/medal.png'/></td>";
            }
            else {
                html = html + "<td>" + (i + 1) + "</td>";
            }

            if (name.toLowerCase() == System.GetUserData().GetBuddyName().toLowerCase()) {
                html = html + "<td><strong>" + o["name"] + "</strong></td>";
            }
            else
                html = html + "<td>" + o["name"] + "</td>";

            html = html + "<td>" + o["score"] + "</td>";
            html = html + "</tr>";
        }

        $("#rankTable > tbody").append(html);
        $("#rankTable").table("refresh");
        $.mobile.loading("hide");
    }

    public Show() {

        if (System.GetLocalStorage().ShowRankingOverlay()) {
            var rankingOverlay: RankingOverLay = new RankingOverLay();
            rankingOverlay.Show();
        }
        else {
            $.mobile.changePage("#ranking", { changeHash: false, transition: transitions });
            $.mobile.loading("show");
            System.GetConnection().GetRanking((val) => this.RankingReady(val));
        }
    }
} 

class RankingOverLay {

    public constructor() { $("#rankingOverlayButton").bind('click', () => this.Close()); }

    private Close() { Game.ShowRankingPage(); }

    public Show() { $.mobile.changePage("#rankingOverlay", { changeHash: false, transition: transitions }); }
}

class Usage {
    private loaded: boolean = false;

    public constructor() {
        $('#usageButton').on('click', () => Game.ShowResourcePage());
        $("#usageCloseButton").bind("click", () => Game.ChangePage());
        $("#forecasttext").html("Consume your electricity in the green hours to save electricity points for " + System.GetUserData().GetBuddyName() + ".");
    }

    public Show() {
        $.mobile.loading("show");
        System.GetConnection().GetUsageHistory((val) => this.UsageReady(val));
    }

    private UsageReady(result: string[][]) {
        if (!this.loaded) {
            this.loaded = true;
            $("#text24").html("The top list shows the hours where you consumed most electricity for yesterday (indicated by yellow). The bottom list shows the hours where it would have been best to do so (indicated by green). Your shifting score: " + result["shifting"] + "(positive values are good)");

            if ((result["UsageExists"] != null && result["UsageExists"])) {
                var elUsage: number = result["co2"];
                var elBaseline: number = result["co2baseline"];
                var waterBaseline: number = result["waterbaseline"];
                var waterUsage: number = result["waterUsage"];
                var elPct = Math.round(((elBaseline - elUsage) / elBaseline) * 100);
                var waterPct = Math.round(((waterBaseline - waterUsage) / waterBaseline) * 100);

                if (waterPct < 0 ||waterBaseline == 0) waterPct = 0;
                if (elPct < 0 || elBaseline == 0) elPct = 0;

                $("#waterRedText").html("You reduced your water usage by " + waterPct + "% compared to your usual " + Day.GetYesterday());
                $("#elRedText").html("You reduced your electricity usage by " + elPct + "% compared to your usual " + Day.GetYesterday());

                $("#waterCont").append(this.GetUsageDiv(waterUsage, waterBaseline));
                $("#elCont").append(this.GetUsageDiv(elUsage, elBaseline));
            }
        }
        $.mobile.changePage("#usage", { changeHash: false, transition: transitions });
        $.mobile.loading("hide");
    }

    private GetUsageDiv(usage: number, baseline: number): HTMLDivElement {
        var container: HTMLDivElement = <HTMLDivElement> document.createElement('div');
        container.className = "usageContainer";

        var centered: HTMLDivElement = <HTMLDivElement> document.createElement('div');
        centered.className = "usageCentered";

        var centeredText: HTMLDivElement = <HTMLDivElement> document.createElement('div');
        centeredText.style.width = "60%";
        centeredText.style.display = "inline-block";

        var percent = 0;

        if (baseline != 0) percent = Math.round(((baseline - usage) / baseline) * 100);
        if (percent > 100) percent = 100;
        else if (percent < 0) percent = 0;

        var green: HTMLDivElement = <HTMLDivElement> document.createElement('div');
        green.style.width = (percent) + "%";
        green.innerHTML = "<span style='font-size:12px;'>" + System.GetUserData().GetBuddyName() + "</span>";
        green.className = "usageGreen";

        var red: HTMLDivElement = <HTMLDivElement> document.createElement('div');
        red.style.width = (100 - percent) + "%";
        red.innerHTML = "<span style='font-size:12px;'>You</span>";
        red.className = "usageRed";

        if (percent == 100) {
            green.style.borderTopLeftRadius = "25px";
            green.style.borderBottomLeftRadius = "25px";
        }
        else if (percent == 0) {
            red.style.borderTopRightRadius = "25px";
            red.style.borderBottomRightRadius = "25px";
        }

        centered.appendChild(red);
        centered.appendChild(green);
        container.appendChild(centered);

        return container;
    }
}

class Rewards {
    private reward;
    private numberOfSlides: number = 0;
    private slideCount: number = 0;
    private divs: HTMLDivElement;
    private shown: boolean = false;

    public constructor() {
        $("#nowaterpresent").hide();
        $(".yesterday").html(Day.GetYesterday());
        $("#noElectricityPresent").hide();
        $("#rewardNext").bind("click", () => this.Next());
    }

    public Show() {
        this.reward = System.GetUserData().GetReward();
        this.shown = true;

        if (this.reward == null) {
            Game.ChangePage();
            return;
        }

        this.divs = <HTMLDivElement> $("#rewardCont")[0];

        if (System.GetUserData().GetUsage()["co2"] == -1) {
            this.divs.removeChild(this.divs.children[1]);
            this.divs.removeChild(this.divs.children[1]);
        }

        this.numberOfSlides = this.divs.children.length - 1;

        for (var i = 1; i <= this.divs.children.length; i++) {
            $(this.divs.children[i]).hide();
        }

        this.SetWater();
        this.SetElectricity();

        $.mobile.changePage("#rewards", { changeHash: false, transition: transitions });
    }

    public HasBeenShown() {
        return this.shown;
    }

    private Next() {
        this.slideCount++;
        if (this.slideCount > this.numberOfSlides) {
            Game.ChangePage();
        }
        else {
            $(this.divs.children[this.slideCount - 1]).hide();
            $(this.divs.children[this.slideCount]).show();
        }
    }

    private SetWater() {
        $("#waterpoints").html(Math.round(this.reward["waterScore"]).toString());

        if (System.GetUserData().GetUsage()["waterUsage"] == -1) {
            $("#waterpresent").hide();
            $("#nowaterpresent").show();
        }
        else {
            var delta: number = Math.round(this.reward["waterReduction"]);
            var reductionOrIncrease: string = "";
            var percentReductionString = "";

            if (delta >= 0) {
                reductionOrIncrease = " reduced ";

                if (delta > 30)
                    percentReductionString = " more than 30%";
                else
                    percentReductionString = delta.toString() + "%";
            }
            else {
                reductionOrIncrease = " increased ";
                percentReductionString = (-1 * delta).toString() + "%";
            }

            $("#waterchange").html(reductionOrIncrease);
            $("#waterreduction").html(percentReductionString);
        }
    }

    private SetElectricity() {
        var score: number = Math.round(this.reward["electricityScore"]);
        $("#electricitypoints").html(score.toString());

        if (System.GetUserData().GetUsage()["co2"] == -1) {
            $("#noElectricityPresent").show();
            $("#electricityPresent").hide();

        }
        else {
            var electricity: number = System.GetUserData().GetUsage()["electricity"];
            var electricityBaseline: number = System.GetUserData().GetUsage()["electricitybaseline"];
            var delta: number = 0;

            if (electricityBaseline != 0)
                delta = Math.round(((electricityBaseline - electricity) / electricityBaseline) * 100);

            var reducedOrIncreasedString = "";
            var percentReductionString = "";

            if (delta >= 0) {
                reducedOrIncreasedString = " reduced ";

                if (delta > 30) {
                    percentReductionString = " more than 30%";
                }
                else {
                    percentReductionString = delta.toString() + "%";
                }
            }
            else {
                reducedOrIncreasedString = " increased ";
                percentReductionString = (-1 * delta).toString() + "%";
            }

            $("#electricitychange").html(reducedOrIncreasedString);
            $("#electricityreduction").html(percentReductionString);

            $("#shiftingamount").html(System.GetUserData().GetUsage()["shifting"]);
            $("#elsham").html("<strong>Reduction</strong>(" + delta + "%) + <strong>Shifting</strong>(" + System.GetUserData().GetUsage()["shifting"] + ") = ");
        }
    }
}