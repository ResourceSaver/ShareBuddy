declare function GetUrl(): string;

interface iConnection {
    Login(callback, username: string, password: string);
    SetPetName(petname, male, callback, referral: string);
    GetTomorrowsForecast(callback);
    IsDayReady(callback);
    GetRanking(callback);
    PerformAction(action: Action, minigamescore: number, cancelled: boolean, moreOptions: boolean, callback);
    Gethighscore(minigameid: number, callback);
    GetUsageHistory(callback);
}

// values/reductions/shifting

class ConnectionDemo implements iConnection {

    private score: number = 0;
    private mgscore1: number = 0;
    private mgscore2: number = 0;
    private mgscore3: number = 0;
    private mgscore4: number = 0;

    public Login(callback, username: string, password: string) {
        var activities: string = "\"activities\":[{\"type\":\"Cooking\",\"description\":\"Cook popcorn\",\"value\":25,\"electricity\":1,\"water\":0,\"id\":1,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Cooking\",\"description\":\"Cook pasta\",\"value\":200,\"electricity\":10,\"water\":0,\"id\":2,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Cooking\",\"description\":\"Cook pizza\",\"value\":700,\"electricity\":60,\"water\":0,\"id\":3,\"played\":false,\"blocked\":false,\"boost\":300},{\"type\":\"Leisure\",\"description\":\"Use e-reader\",\"value\":25,\"electricity\":1,\"water\":0,\"id\":4,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Leisure\",\"description\":\"Use laptop\",\"value\":200,\"electricity\":10,\"water\":0,\"id\":5,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Leisure\",\"description\":\"Watch TV\",\"value\":700,\"electricity\":60,\"water\":0,\"id\":6,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Fitness\",\"description\":\"Work out to music\",\"value\":25,\"electricity\":1,\"water\":0,\"id\":7,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Fitness\",\"description\":\"Use solarium\",\"value\":200,\"electricity\":10,\"water\":0,\"id\":8,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Fitness\",\"description\":\"Use treadmill\",\"value\":700,\"electricity\":60,\"water\":0,\"id\":9,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Hygiene\",\"description\":\"Brush teeth\",\"value\":25,\"electricity\":0,\"water\":1,\"id\":10,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Hygiene\",\"description\":\"Shave\",\"value\":600,\"electricity\":0,\"water\":15,\"id\":11,\"played\":false,\"blocked\":false,\"boost\":0},{\"type\":\"Hygiene\",\"description\":\"Shower\",\"value\":1500,\"electricity\":0,\"water\":60,\"id\":12,\"played\":false,\"blocked\":false,\"boost\":0}],";
        var playerData: string = "\"playerdata\":{\"score\":0,\"username\":23,\"pet\":\"\",\"water\":1,\"electricity\":1,\"male\":false},";
        var usage: string = "\"usage\":{\"waterUsage\":200,\"waterbaseline\":345,\"co2\":150,\"co2baseline\":345,\"electricity\":3465,\"electricitybaseline\":3699,\"eusage\":[1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,5,6,3,1,1,1,6,1],\"electricityBaselineArray\":[0.068,0.078,0.056,0.051,0.051,0.046,0.046,0.13,0.055,0.038,0.04,0.058,0.302,0.04,0.364,0.26,0.172,0.26,0.377,0.679,0.267,0.765,0.422,0.114],\"shifting\":21,";
        var forecast: string = "\"forecastToday\":[358,362,367,373,351,344,360,345,332,335,344,350,342,337,351,345,365,338,356,360,375,355,318,341],\"forecastYesterday\":[346,367,388,386,412,392,346,373,383,377,371,375,384,383,368,364,352,331,326,321,276,300,328,350],";
        var reward: string = "\"reward\":{\"electricityScore\":30,\"electricityReduction\":56.522,\"waterScore\":30,\"waterReduction\":42.029},";
        var event: string = "\"todaysEvent\":{\"id\":26,\"type\":\"boost\",\"target\":\"3\",\"value\":300,\"released\":false,\"text\":\"[p] watched The Godfather last night and is in the mood for italian. There is a [v] mood point bonus for cooking pizza today.\"},";
        var retVal: string = "{\"login\":true," + activities + playerData + usage + forecast + "\"UsageExists\":true}," + reward + event + "\"updateHour\":1,\"serviceTime\":\"03-20-2015 14:27:57\",\"dayReady\":true}";
        callback(JSON.parse(retVal));
    }

    public GetRanking(callback) { // PROBLEM
        var user: string = ",{\"name\":\"" + System.GetUserData().GetBuddyName() + "\",\"score\":" + this.score + ",\"king\":false,\"username\":\"5\"}";
        var retVal: string = "[{\"name\":\"Monster\",\"score\":5543,\"king\":false,\"username\":\"3\"},{\"name\":\"Prince\",\"score\":3234,\"king\":true,\"username\":\"thomas\"},{\"name\":\"Lance\",\"score\":2323,\"king\":false,\"username\":\"2\"},{\"name\":\"BuddyGuy\",\"score\":1323,\"king\":false,\"username\":\"4\"},{\"name\":\"FireCaster\",\"score\":0,\"king\":false,\"username\":\"5\"}" + user + "]";

        var x = JSON.parse(retVal);
        this.bubbleSort(x);
        callback(x);
    }

    public Gethighscore(minigameid: number, callback) { // PROBLEM
        var newmg: string = "";
        console.log(minigameid);

        if (minigameid == 1) {
            newmg = "{\"buddyname\":\"" + System.GetUserData().GetBuddyName() + " \",\"score\":"+ this.mgscore1 + "}";
        }
        else if (minigameid == 2) {
            newmg = "{\"buddyname\":\"" + System.GetUserData().GetBuddyName() + " \",\"score\":" + this.mgscore4 + "}";
        }
        else if (minigameid == 3) {
            newmg = "{\"buddyname\":\"" + System.GetUserData().GetBuddyName() + " \",\"score\":" + this.mgscore2 + "}";
        }
        else if (minigameid == 4) {
            newmg = "{\"buddyname\":\"" + System.GetUserData().GetBuddyName() + " \",\"score\":" + this.mgscore3 + "}";
        }
        var ret: string = "[{\"buddyname\":\"BuddyGuy\",\"score\":32},{\"buddyname\":\"Firecaster\",\"score\":23},{\"buddyname\":\"Lance\",\"score\":12},{\"buddyname\":\"Prince\",\"score\":11},{\"buddyname\":\"Monster\",\"score\":2}, "+ newmg + "]";

        var x = JSON.parse(ret);
        this.bubbleSort(x);
        callback(x);
    }

    public PerformAction(action: Action, minigamescore: number, cancelled: boolean, moreOptions: boolean, callback) { // update users
        this.score += action.GetValue() + minigamescore;

        console.log(action.GetId());

        if (action.GetId() <= 3) {
            this.mgscore1 = minigamescore;
        }
        else if (action.GetId() <= 6) {
            this.mgscore2= minigamescore;

        }
        else if (action.GetId() <= 9) {
            this.mgscore3 = minigamescore;

        }
        else if (action.GetId() <= 12) {
            this.mgscore4 = minigamescore;

        }
        callback();
    }

    public GetUsageHistory(callback) {
        var retVal: string = "{\"waterUsage\":200,\"waterbaseline\":345,\"co2\":150,\"co2baseline\":345,\"electricity\":3465,\"electricitybaseline\":3699,\"eusage\":[1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,5,6,3,1,1,1,6,1],\"electricityBaselineArray\":[0.068,0.078,0.056,0.051,0.051,0.046,0.046,0.13,0.055,0.038,0.04,0.058,0.302,0.04,0.364,0.26,0.172,0.26,0.377,0.679,0.267,0.765,0.422,0.114],\"shifting\":21,\"forecastToday\":[358,362,367,373,351,344,360,345,332,335,344,350,342,337,351,345,365,338,356,360,375,355,318,341],\"forecastYesterday\":[346,367,388,386,412,392,346,373,383,377,371,375,384,383,368,364,352,331,326,321,276,300,328,350],\"UsageExists\":true}";
        callback(JSON.parse(retVal));
    }

    // DONE

    public SetPetName(petname, male, callback, referral: string) {
        callback(2);
    }

    public IsDayReady(callback) {
        var retVal: string = "true";
        callback(retVal);
    }

    public GetTomorrowsForecast(callback) {
        callback(null);
    }

    // Helper

    public bubbleSort(array) {
        var n: number = array.length;
        var k: number;
        for (var m = n; m >= 0; m--) {
            for (var i = 0; i < m - 1; i++) {
                k = i + 1;
                if (array[i]['score'] < array[k]['score']) {
                    this.swapNumbers(i, k, array);
                }
            }
        }
    }

    public swapNumbers(i: number, j: number, array) {

        var temp;
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

class Connection implements iConnection {
    private username: string;
    private password: string;

    public Login(callback, username: string, password: string) {
        this.username = username;
        this.password = password;
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '"}';
        Ajax("Login", arr, callback);
    }

    public SetPetName(petname, male, callback, referral:string) {
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","male":"' + male + '","petname":"' + petname + '","referral":"' + referral + '"}';
        Ajax("SetPetName", arr, callback);
    }

    public GetTomorrowsForecast(callback) { Ajax("GetTomorrowsForecast", '{}', callback); }

    public IsDayReady(callback) { Ajax("IsDayReady", '{}', callback); }

    public GetRanking(callback) { Ajax("GetRanking", '{"username":"' + this.username + '"}', callback); }

    public PerformAction(action:Action, minigamescore: number, cancelled:boolean, moreOptions:boolean, callback) {
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","actionid":"' + action.GetId() + '","minigamescore":"' + minigamescore + '","type":"' + action.GetType() + '","cancelled":"' + cancelled + '","exhausted":"' + moreOptions + '"}';
        Ajax("CompleteAction", arr, callback);
    }

    public Gethighscore(minigameid:number, callback) {
        var arr = '{"minigameid":"' + minigameid + '"}';
        Ajax("GetMiniGameHighScore", arr, callback);
    }

    public GetUsageHistory(callback) {
        var date = new Date();
        var dd = date.getDate().toString();
        var mm = (date.getMonth() + 1).toString();
        var yy = date.getFullYear().toString();
        var today = yy + "-" + mm + "-" + dd;

        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","date":"' + today + '"}';
        Ajax("GetUsageHistory", arr, callback);
    }
} 

function Ajax(method: string, param: string, callback) {
    console.log(GetUrl() + method);
    $.ajax(GetUrl() + method, {
        type: 'POST',
        data: param,
        contentType: 'application/json',
        success: function (r) {
            if (r == null) { callback(null); }
            else { callback(JSON.parse(r.d)); } },
        error: function (r) { ConnectionError.Show(); }
    });
}