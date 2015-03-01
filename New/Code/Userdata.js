var UserData = (function () {
    function UserData() {
    }
    UserData.prototype.SetData = function (r) {
        var clientTime = new Date();
        var serviceTime = new Date(r["serviceTime"]);
        this.timeDelta = clientTime.getTime() - serviceTime.getTime();
        this.updateHour = (r["updateHour"]);
        this.dayReady = r["dayReady"];
        if (!this.dayReady)
            return;
        this.event = r["todaysEvent"];
        this.reward = r["reward"];
        var playerData = r["playerdata"];
        this.usage = r["usage"];
        this.electricity = playerData["electricity"];
        this.buddyName = playerData["pet"];
        this.score = playerData["score"];
        this.male = playerData["male"];
        this.water = playerData["water"];
        this.ActionsReady(r["activities"]);
    };

    UserData.prototype.ActionsReady = function (r) {
        this.more = false;

        var actionList = new Array();

        for (var i = 0; i < r.length; i++) {
            var element = r[i];
            var type = element["type"];
            var value = element["value"];
            var description = element["description"];
            var electricity = element["electricity"];
            var water = element["water"];
            var id = element["id"];
            var played = element["played"];
            var boosted = element["boost"];
            var blocked = element["blocked"];
            var affordable;

            if (electricity == 0) {
                affordable = (water <= this.water);
            } else {
                affordable = electricity <= this.electricity;
            }
            if (affordable && !played && !blocked) {
                this.more = true;
            }

            var action = new Action(type, value, description, electricity, water, id, played, boosted, blocked);
            action.setAffordable(this.electricity, this.water);
            actionList.push(action);
        }

        this.actions = new Actions(actionList);
    };

    UserData.prototype.PerformAction = function (action, score, cancelled) {
        this.score += action.GetValue() + action.GetBoosted() + score;
        this.water -= action.GetWater();
        this.electricity -= action.GetElectricity();

        var moreOptions = this.actions.UpdateActions(action.GetType(), this.electricity, this.water);
        System.GetConnection().PerformAction(action.GetId(), score, action.GetType(), cancelled, moreOptions);
        this.more = moreOptions;
    };

    UserData.prototype.GetActions = function () {
        return this.actions;
    };

    UserData.prototype.GetBuddyName = function () {
        return this.buddyName;
    };

    UserData.prototype.GetScore = function () {
        return this.score;
    };

    UserData.prototype.GetElectricity = function () {
        return this.electricity;
    };

    UserData.prototype.GetWater = function () {
        return this.water;
    };

    UserData.prototype.GetReward = function () {
        return this.reward;
    };

    UserData.prototype.GetUpdateHour = function () {
        return this.updateHour;
    };

    UserData.prototype.GetUsage = function () {
        return this.usage;
    };

    UserData.prototype.GetTimeDelta = function () {
        return this.timeDelta;
    };

    UserData.prototype.SetBuddyName = function (name) {
        this.buddyName = name;
    };

    UserData.prototype.SetMale = function (male) {
        this.male = male;
    };

    UserData.prototype.IsDayReady = function () {
        return this.dayReady;
    };

    UserData.prototype.IsMale = function () {
        return this.male;
    };

    UserData.prototype.IsMore = function () {
        return this.more;
    };

    UserData.prototype.GetEvent = function () {
        return this.event;
    };
    return UserData;
})();
