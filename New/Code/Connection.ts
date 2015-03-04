declare function GetUrl(): string;

class Connection {
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

    public PerformAction(id: number, minigamescore: number, type:string, cancelled:boolean, moreOptions:boolean) {
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","actionid":"' + id + '","minigamescore":"' + minigamescore + '","type":"' + type + '","cancelled":"' + cancelled +  '","exhausted":"' + moreOptions + '"}';
        Ajax("CompleteAction", arr, () => { });
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