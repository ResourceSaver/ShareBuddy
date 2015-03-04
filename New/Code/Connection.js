var Connection = (function () {
    function Connection() {
    }
    Connection.prototype.Login = function (callback, username, password) {
        this.username = username;
        this.password = password;
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '"}';
        Ajax("Login", arr, callback);
    };

    Connection.prototype.SetPetName = function (petname, male, callback, referral) {
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","male":"' + male + '","petname":"' + petname + '","referral":"' + referral + '"}';
        Ajax("SetPetName", arr, callback);
    };

    Connection.prototype.GetTomorrowsForecast = function (callback) {
        Ajax("GetTomorrowsForecast", '{}', callback);
    };

    Connection.prototype.IsDayReady = function (callback) {
        Ajax("IsDayReady", '{}', callback);
    };

    Connection.prototype.GetRanking = function (callback) {
        Ajax("GetRanking", '{"username":"' + this.username + '"}', callback);
    };

    Connection.prototype.PerformAction = function (action, minigamescore, cancelled, moreOptions, callback) {
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","actionid":"' + action.GetId() + '","minigamescore":"' + minigamescore + '","type":"' + action.GetType() + '","cancelled":"' + cancelled + '","exhausted":"' + moreOptions + '"}';
        Ajax("CompleteAction", arr, callback);
    };

    Connection.prototype.Gethighscore = function (minigameid, callback) {
        var arr = '{"minigameid":"' + minigameid + '"}';
        Ajax("GetMiniGameHighScore", arr, callback);
    };

    Connection.prototype.GetUsageHistory = function (callback) {
        var date = new Date();
        var dd = date.getDate().toString();
        var mm = (date.getMonth() + 1).toString();
        var yy = date.getFullYear().toString();
        var today = yy + "-" + mm + "-" + dd;

        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","date":"' + today + '"}';
        Ajax("GetUsageHistory", arr, callback);
    };
    return Connection;
})();

function Ajax(method, param, callback) {
    console.log(GetUrl() + method);
    $.ajax(GetUrl() + method, {
        type: 'POST',
        data: param,
        contentType: 'application/json',
        success: function (r) {
            if (r == null) {
                callback(null);
            } else {
                callback(JSON.parse(r.d));
            }
        },
        error: function (r) {
            ConnectionError.Show();
        }
    });
}
