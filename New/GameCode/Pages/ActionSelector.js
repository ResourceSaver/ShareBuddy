var ActionSelector = (function () {
    function ActionSelector(r) {
        var _this = this;
        this.actions = r;

        for (var i = 0; i < System.GetUserData().GetActions().GetActions().length; i++) {
            var action = System.GetUserData().GetActions().GetActions()[i];

            if (action.GetPlayed() || action.GetBlocked())
                $("#" + action.GetType() + "Button").addClass('ui-disabled');
        }

        $('#closeActionButton').bind('click', function () {
            return Game.ChangePage();
        });
        $('#CookingButton').on('click', function () {
            return _this.Show("Cooking");
        });
        $('#LeisureButton').on('click', function () {
            return _this.Show("Leisure");
        });
        $('#FitnessButton').on('click', function () {
            return _this.Show("Fitness");
        });
        $('#HygieneButton').on('click', function () {
            return _this.Show("Hygiene");
        });
    }
    ActionSelector.prototype.Show = function (type) {
        $.mobile.changePage("#actions", { changeHash: false, transition: transitions });

        var actionDiv = document.getElementById("actionMain");
        actionDiv.innerHTML = "";

        for (var i = 0; i < this.actions.GetActions().length; i++) {
            var action = this.actions.GetActions()[i];

            if (action.GetType() != type)
                continue;

            actionDiv.appendChild(this.CreateButton(action));
        }
    };

    ActionSelector.prototype.CreateButton = function (action) {
        var _this = this;
        var hdiv = document.createElement("div");
        hdiv.className = "ui-bar ui-bar-a";

        var header = document.createElement("h3");
        header.innerHTML = action["description"];
        header.style.cssFloat = "left";

        var divScore = document.createElement("div");
        $(divScore).addClass('actionBox actionBoxScore');
        divScore.innerHTML = action['value'];

        var divCost = document.createElement("div");

        if (action["electricity"] != 0) {
            $(divCost).addClass('actionBox actionBoxEl');
            divCost.innerHTML = action["electricity"].toString();
        } else {
            $(divCost).addClass('actionBox actionBoxWater');
            divCost.innerHTML = action["water"].toString();
        }

        var bdiv = document.createElement("div");
        bdiv.className = "ui-body ui-body-a";
        bdiv.style.height = "50px";
        bdiv.appendChild(divCost);
        bdiv.appendChild(divScore);

        if (action.GetBoosted() != 0) {
            var boosted = document.createElement("div");
            $(boosted).addClass('actionBox actionBoxScore');
            boosted.innerHTML += action.GetBoosted();

            var sp = document.createElement("span");
            sp.style.cssFloat = "left";
            sp.innerHTML = "+";
            bdiv.appendChild(sp);
            bdiv.appendChild(boosted);
        }

        var button = document.createElement("a");
        button.className = "ui-btn-right ui-btn ui-btn-inline";
        button.style.padding = "10px";
        button.innerHTML = "Select";

        bdiv.appendChild(button);
        hdiv.appendChild(header);

        var div = document.createElement("div");
        div.className = "ui-corner-all custom-corners";
        div.id = action["id"].toString();
        div.appendChild(hdiv);
        div.appendChild(bdiv);

        if (!action.GetPlayed() && action.isAffordable() && !action.GetBlocked()) {
            $(div).on('click', function (event) {
                return _this.ActionClick(event);
            });
        } else {
            var p2 = document.createElement("p");
            if (action.GetPlayed()) {
                p2.innerHTML += "Already played today";
            } else if (action.GetBlocked()) {
                p2.innerHTML += "Blocked";
            } else {
                p2.innerHTML += "Not enough resources";
            }
            div.style.opacity = "0.3";
            p2.style.color = "red";
            bdiv.appendChild(p2);
        }

        return div;
    };

    ActionSelector.prototype.ActionClick = function (event) {
        var div = event.currentTarget;
        var id = +div.id;
        this.selectedAction = this.actions.GetSelectedAction(id);
        $("#" + this.selectedAction.GetType() + "Button").addClass('ui-disabled');
        Game.ShowHowToPlay(this.selectedAction);
    };

    ActionSelector.prototype.GetSelectedAction = function () {
        return this.selectedAction;
    };
    return ActionSelector;
})();

var Actions = (function () {
    function Actions(actions) {
        this.actions = actions;
    }
    Actions.prototype.GetActions = function () {
        return this.actions;
    };

    Actions.prototype.GetSelectedAction = function (id) {
        for (var i = 0; i < this.actions.length; i++) {
            if (this.actions[i].GetId() == id) {
                return this.actions[i];
            }
        }

        return null;
    };

    Actions.prototype.UpdateActions = function (type, electricity, water) {
        var res = false;

        for (var i = 0; i < this.actions.length; i++) {
            var action = this.actions[i];

            if (action.GetType() == type) {
                action.SetPlayed();
            }

            action.setAffordable(electricity, water);

            if (!action.GetPlayed() && action.isAffordable() && !action.GetBlocked())
                res = true;
        }

        return res;
    };
    return Actions;
})();

var Action = (function () {
    function Action(type, value, description, electricity, water, id, played, boosted, blocked) {
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
    Action.prototype.GetId = function () {
        return this.id;
    };

    Action.prototype.GetValue = function () {
        return this.value;
    };

    Action.prototype.GetWater = function () {
        return this.water;
    };

    Action.prototype.GetElectricity = function () {
        return this.electricity;
    };

    Action.prototype.GetType = function () {
        return this.type;
    };

    Action.prototype.GetPlayed = function () {
        return this.played;
    };

    Action.prototype.isAffordable = function () {
        return this.affordable;
    };

    Action.prototype.setAffordable = function (el, wa) {
        if (this.GetElectricity() > 0) {
            this.affordable = (el >= this.electricity);
        } else if (this.GetWater() > 0) {
            this.affordable = (wa >= this.water);
        } else
            this.affordable = false;
    };

    Action.prototype.GetDescription = function () {
        return this.description;
    };

    Action.prototype.SetPlayed = function () {
        this.played = true;
    };

    Action.prototype.SetBoosted = function (val) {
        this.boosted = val;
    };

    Action.prototype.GetBoosted = function () {
        return this.boosted;
    };

    Action.prototype.GetBlocked = function () {
        return this.blocked;
    };

    Action.prototype.SetBlocked = function () {
        this.blocked = true;
    };
    return Action;
})();
