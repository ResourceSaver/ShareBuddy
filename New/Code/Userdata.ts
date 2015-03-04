class UserData{
    private buddyName: string;
    private score: number;
    private electricity: number;
    private water: number;
    private male: boolean;
    private usage;
    private event;
    private reward;
    private more: boolean;
    
    private actions: Actions;
    private updateHour: number;
    private timeDelta: number;
    private dayReady: boolean;

    public SetData(r) {
        var clientTime = new Date();
        var serviceTime = new Date(r["serviceTime"]);
        this.timeDelta = clientTime.getTime() - serviceTime.getTime();
        this.updateHour = (r["updateHour"]);
        this.dayReady = r["dayReady"];
        if (!this.dayReady) return;
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
    }
    
    public ActionsReady(r) {
        this.more = false;

        var actionList: Action[] = new Array();

        for (var i = 0; i < r.length; i++) {
            var element: string[] = r[i];
            var type: string = element["type"];
            var value: number = element["value"];
            var description: string = element["description"];
            var electricity: number = element["electricity"];
            var water: number = element["water"];
            var id: number = element["id"];
            var played: boolean = element["played"];
            var boosted: number = element["boost"];
            var blocked: boolean = element["blocked"];
            var affordable: boolean;

            if (electricity == 0) { affordable = (water <= this.water); }
            else { affordable = electricity <= this.electricity; }
            if (affordable && !played && !blocked) { this.more = true; }

            var action: Action = new Action(type, value, description, electricity, water, id, played, boosted, blocked);
            action.setAffordable(this.electricity, this.water);
            actionList.push(action);
        }

        this.actions = new Actions(actionList);
    }
    
    public UpdateActions(action: Action, score: number) {
        this.score += action.GetValue() + action.GetBoosted() + score;
        this.water -= action.GetWater();
        this.electricity -= action.GetElectricity();

        this.more = this.actions.UpdateActions(action.GetType(), this.electricity, this.water);
    }

    public GetActions() { return this.actions; }

    public GetBuddyName() { return this.buddyName; }

    public GetScore() { return this.score; }

    public GetElectricity() { return this.electricity; }

    public GetWater() { return this.water; }
   
    public GetReward() { return this.reward; }

    public GetUpdateHour() { return this.updateHour; }

    public GetUsage() { return this.usage; }

    public GetTimeDelta() { return this.timeDelta; }

    public SetBuddyName(name: string) { this.buddyName = name; }

    public SetMale(male: boolean) { this.male = male; }

    public IsDayReady() { return this.dayReady; }

    public IsMale() { return this.male; }

    public IsMore() { return this.more; }

    public GetEvent() { return this.event; }
} 