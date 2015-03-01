class ActionSelector{
    private actions: Actions;
    private selectedAction: Action;
    
    public constructor(r) {
        this.actions = r;

        for (var i = 0; i < System.GetUserData().GetActions().GetActions().length; i++) {
            var action: Action = System.GetUserData().GetActions().GetActions()[i];

            if (action.GetPlayed() || action.GetBlocked())
                $("#" + action.GetType() + "Button").addClass('ui-disabled');
        }

        $('#closeActionButton').bind('click', () => Game.ChangePage());
        $('#CookingButton').on('click', () => this.Show("Cooking"));
        $('#LeisureButton').on('click', () => this.Show("Leisure"));
        $('#FitnessButton').on('click', () => this.Show("Fitness"));
        $('#HygieneButton').on('click', () => this.Show("Hygiene"));
    }
   
    public Show(type: String) {
        $.mobile.changePage("#actions", { changeHash: false, transition: transitions });

        var actionDiv: HTMLDivElement = <HTMLDivElement> document.getElementById("actionMain");
        actionDiv.innerHTML = "";

        for (var i = 0; i < this.actions.GetActions().length; i++) {
            var action = this.actions.GetActions()[i];

            if (action.GetType() != type)
                continue;

            actionDiv.appendChild(this.CreateButton(action));
        }
    }

    private CreateButton(action) : HTMLDivElement {

        // HEADER

        var hdiv: HTMLDivElement = document.createElement("div");
        hdiv.className = "ui-bar ui-bar-a";

        var header = document.createElement("h3");
        header.innerHTML = action["description"];
        header.style.cssFloat = "left";

        // BODY

        // Score box
        var divScore: HTMLDivElement = document.createElement("div");
        $(divScore).addClass('actionBox actionBoxScore');
        divScore.innerHTML = action['value'];

        // Cost box
        var divCost: HTMLDivElement = document.createElement("div");

        if (action["electricity"] != 0) {
            $(divCost).addClass('actionBox actionBoxEl');
            divCost.innerHTML = action["electricity"].toString();
        }
        else {
            $(divCost).addClass('actionBox actionBoxWater');
            divCost.innerHTML = action["water"].toString();
        }

        var bdiv: HTMLDivElement = document.createElement("div");
        bdiv.className = "ui-body ui-body-a";
        bdiv.style.height = "50px";
        bdiv.appendChild(divCost);
        bdiv.appendChild(divScore);

        if (action.GetBoosted() != 0) {
            var boosted:HTMLDivElement = document.createElement("div");
            $(boosted).addClass('actionBox actionBoxScore');
            boosted.innerHTML += action.GetBoosted();

            var sp = document.createElement("span");
            sp.style.cssFloat = "left";
            sp.innerHTML = "+";
            bdiv.appendChild(sp);
            bdiv.appendChild(boosted);
        }

        var button: HTMLAnchorElement = document.createElement("a");
        button.className = "ui-btn-right ui-btn ui-btn-inline";
        button.style.padding = "10px";
        button.innerHTML = "Select";

        bdiv.appendChild(button);
        hdiv.appendChild(header);

        var div: HTMLDivElement = document.createElement("div");
        div.className = "ui-corner-all custom-corners";
        div.id = action["id"].toString();
        div.appendChild(hdiv);
        div.appendChild(bdiv);

        if (!action.GetPlayed() && action.isAffordable() && !action.GetBlocked()) {
            $(div).on('click', (event) => this.ActionClick(event));
        }
        else {
            var p2: HTMLParagraphElement = document.createElement("p");
            if (action.GetPlayed()) { p2.innerHTML += "Already played today"; }
            else if (action.GetBlocked()) { p2.innerHTML += "Blocked"; }
            else { p2.innerHTML += "Not enough resources"; }
            div.style.opacity = "0.3";
            p2.style.color = "red";
            bdiv.appendChild(p2);
        }

        return div;
    }

    public ActionClick(event: Event) {
        var div: HTMLDivElement = <HTMLDivElement> event.currentTarget;
        var id: number = +div.id;
        this.selectedAction = this.actions.GetSelectedAction(id);
        $("#" + this.selectedAction.GetType() + "Button").addClass('ui-disabled');      
        Game.ShowHowToPlay(this.selectedAction);
    }

    public GetSelectedAction() { return this.selectedAction; }
} 

class Actions {
    private actions: Action[];

    public constructor(actions: Action[]) { this.actions = actions; }

    public GetActions() { return this.actions; }

    public GetSelectedAction(id: number) {
        for (var i = 0; i < this.actions.length; i++) {
            if (this.actions[i].GetId() == id) {
                return this.actions[i];
            }
        }

        return null;
    }

    public UpdateActions(type: string, electricity: number, water: number) {
        var res: boolean = false;

        for (var i = 0; i < this.actions.length; i++) {
            var action: Action = this.actions[i];

            if (action.GetType() == type) {
                action.SetPlayed();
            }

            action.setAffordable(electricity, water);

            if (!action.GetPlayed() && action.isAffordable() && !action.GetBlocked())
                res = true;
        }

        return res;
    }
}

class Action {
    private type: string;
    private value: number;
    private description: string;
    private electricity: number;
    private water: number;
    private id: number;
    private affordable; boolean;
    private played: boolean;
    private blocked: boolean;
    private boosted: number;

    public constructor(type: string, value: number, description: string, electricity: number, water: number, id: number, played: boolean, boosted: number, blocked: boolean) {
        this.type = type;
        this.value = value;
        this.description = description;
        this.electricity = electricity;
        this.water = water;
        this.id = id;
        this.played = played;
        this.boosted = boosted;
        this.blocked = blocked;
    }

    public GetId() { return this.id; }

    public GetValue() { return this.value; }

    public GetWater() { return this.water; }

    public GetElectricity() { return this.electricity; }

    public GetType() { return this.type; }

    public GetPlayed() { return this.played; }

    public isAffordable() { return this.affordable; }

    public setAffordable(el: number, wa: number) {

        if (this.GetElectricity() > 0) {
            this.affordable = (el >= this.electricity);
        }

        else if (this.GetWater() > 0) {
            this.affordable = (wa >= this.water);
        }
        else
            this.affordable = false;
    }

    public GetDescription() {
        return this.description;
    }

    public SetPlayed() { this.played = true; }

    public SetBoosted(val: number) { this.boosted = val; }

    public GetBoosted() { return this.boosted; }

    public GetBlocked() { return this.blocked; }

    public SetBlocked() { this.blocked = true; }
}