var Connection = (function () {
    function Connection() {
    }
    Connection.prototype.Login = function (callback, username, password) {
        this.username = username;
        this.password = password;
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '"}';
        Ajax("Login", arr, callback);
    };

    Connection.prototype.SetPetName = function (petname, male, callback) {
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","male":"' + male + '","petname":"' + petname + '"}';
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

    Connection.prototype.PerformAction = function (id, minigamescore, type, cancelled, moreOptions) {
        var arr = '{"username":"' + this.username + '","password":"' + this.password + '","actionid":"' + id + '","minigamescore":"' + minigamescore + '","type":"' + type + '","cancelled":"' + cancelled + '","exhausted":"' + moreOptions + '"}';
        Ajax("CompleteAction", arr, function () {
        });
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
