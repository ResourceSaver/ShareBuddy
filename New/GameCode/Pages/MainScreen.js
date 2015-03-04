var MainScreen = (function () {
    function MainScreen() {
        $("#logoutbutton").bind("click", function () {
            return System.Logout();
        });
        $("#menu").hide();

        MiniCast.Setup();
        this.pet = new Pet();

        $("#main").bind("pageshow", function () {
            var headerHeight = $("[data-role=header]:visible").height();
            $("#menu").css({ 'top': headerHeight.toString() + "px" });
            $("#menu").fadeIn();
            $("#main").unbind("pageshow");
        });
    }
    MainScreen.prototype.UpdateLabels = function () {
        $("#name").html(" &nbsp;" + System.GetUserData().GetBuddyName() + " &nbsp;");
        $("#score").html(System.GetUserData().GetScore().toString() + " &nbsp;");
        $("#water").html(System.GetUserData().GetWater().toString() + " &nbsp;");
        $("#electricity").html(System.GetUserData().GetElectricity().toString() + " &nbsp;");
    };

    MainScreen.prototype.ShowAnimation = function (action) {
        var _this = this;
        this.UpdateLabels();
        this.pet.SetAnimation(action);

        if (!System.GetUserData().IsMore())
            setTimeout(function () {
                return _this.TodayOverMessage();
            }, 3000);
    };

    MainScreen.prototype.TodayOverMessage = function () {
        Game.ChangePage();
    };

    MainScreen.prototype.Act = function () {
        this.pet.Act();
    };

    MainScreen.prototype.Show = function () {
        Game.SetMain();
        $.mobile.changePage("#main", { changeHash: false, transition: transitions });
        this.UpdateLabels();
    };
    return MainScreen;
})();

var AnimationWrapper = (function () {
    function AnimationWrapper() {
        this.repeat = 0;
        var canvas = document.getElementById("backgroundMain");
        this.background = canvas.getContext("2d");
        canvas.style.width = System.GetGW() + "px";
        canvas.style.height = System.GetGH() + "px";
        this.background.canvas.height = System.CanvasHeight;
        this.background.canvas.width = System.CanvasWidth;

        var canvasMain = document.getElementById("canvasMain");
        var contextMain = canvasMain.getContext("2d");
        contextMain.canvas.height = System.CanvasHeight;
        contextMain.canvas.width = System.CanvasWidth;
        contextMain.canvas.style.height = System.GetGH() + "px";
        contextMain.canvas.style.width = System.GetGW() + "px";

        var image;
        if (System.GetUserData().IsMale()) {
            image = images.pet;
        } else {
            image = images.female;
        }

        var animationData = new AnimationData(image, contextMain, 6, 6);
        this.animationNeutral = new Animation(animationData, 40 /* Slowest */, 1 /* vertical */, 0, 2, 2);
        this.animationPasta = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 1, 0, 2);
        this.animationTv = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 0, 3, 3);
        this.animationEReader = new Animation(animationData, 30 /* Slow */, 0 /* horizontal */, 0, 0, 2);
        this.animationShower = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 1, 3, 3);
        this.animationShave = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 2, 0, 3);
        this.animationPizza = new Animation(animationData, 30 /* Slow */, 0 /* horizontal */, 2, 3, 3);
        this.animationSun = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 3, 0, 3);
        this.animationTMill = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 3, 3, 3);
        this.animationBrushteeth = new Animation(animationData, 30 /* Slow */, 0 /* horizontal */, 4, 0, 3);
        this.animationDumbell = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 4, 3, 3);
        this.animationPopcorn = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 5, 0, 3);
        this.animationLaptop = new Animation(animationData, 30 /* Slow */, 0 /* horizontal */, 5, 3, 2);
        this.animationCurrent = this.animationNeutral;
        this.DrawBackground();
    }
    AnimationWrapper.prototype.DrawBackground = function () {
        this.background.drawImage(images.background, 0, 0, images.background.width, images.background.height, 0, 0, System.CanvasWidth, System.CanvasHeight);
    };

    AnimationWrapper.prototype.SetPopcorn = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationPopcorn;
    };

    AnimationWrapper.prototype.SetDumbell = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationDumbell;
    };

    AnimationWrapper.prototype.Setteeth = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationBrushteeth;
    };

    AnimationWrapper.prototype.SetLaptop = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationLaptop;
    };

    AnimationWrapper.prototype.SetShower = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationShower;
    };

    AnimationWrapper.prototype.SetEReader = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationEReader;
    };

    AnimationWrapper.prototype.SetTMill = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationTMill;
    };

    AnimationWrapper.prototype.setPasta = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationPasta;
    };

    AnimationWrapper.prototype.SetNeutral = function () {
        this.repeat = -1;
        this.animationCurrent = this.animationNeutral;
    };

    AnimationWrapper.prototype.SetTV = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationTv;
    };

    AnimationWrapper.prototype.SetPizza = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationPizza;
    };

    AnimationWrapper.prototype.Workout = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationDumbell;
    };

    AnimationWrapper.prototype.Solarium = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationSun;
    };

    AnimationWrapper.prototype.Shave = function (repeat) {
        this.repeat = repeat;
        this.animationCurrent = this.animationShave;
    };

    AnimationWrapper.prototype.Draw = function () {
        if (this.repeat == -1) {
            this.animationCurrent.DrawLoopAligned();
            return false;
        } else {
            var done = this.animationCurrent.DrawOnceAligned();
            if (done) {
                this.repeat--;

                if (this.repeat == 0) {
                    this.repeat = -1;
                    return true;
                }
            }
        }
    };
    return AnimationWrapper;
})();

var PetState;
(function (PetState) {
    PetState[PetState["NEUTRAL"] = 0] = "NEUTRAL";
    PetState[PetState["NOTHING"] = 1] = "NOTHING";
})(PetState || (PetState = {}));

var Pet = (function () {
    function Pet() {
        this.state = 0 /* NEUTRAL */;
        this.wrapper = new AnimationWrapper();
    }
    Pet.prototype.Act = function () {
        switch (this.state) {
            case 0 /* NEUTRAL */:
                this.wrapper.Draw();
                break;
            case 1 /* NOTHING */:
                var done = this.wrapper.Draw();
                if (done) {
                    this.state = 0 /* NEUTRAL */;
                    this.wrapper.SetNeutral();
                }
                break;
        }
    };

    Pet.prototype.SetAnimation = function (action) {
        switch (action.GetId()) {
            case 1:
                this.wrapper.SetPopcorn(7);
                break;
            case 2:
                this.wrapper.setPasta(7);
                break;
            case 3:
                this.wrapper.SetPizza(7);
                break;
            case 4:
                this.wrapper.SetEReader(7);
                break;

            case 5:
                this.wrapper.SetLaptop(7);
                break;
            case 6:
                this.wrapper.SetTV(7);
                break;
            case 7:
                this.wrapper.Workout(7);
                break;
            case 8:
                this.wrapper.Solarium(7);
                break;
            case 9:
                this.wrapper.SetTMill(7);
                break;
            case 10:
                this.wrapper.Setteeth(7);
                break;
            case 11:
                this.wrapper.Shave(7);
                break;
            case 12:
                this.wrapper.SetShower(7);
                break;
        }

        this.state = 1 /* NOTHING */;
    };
    return Pet;
})();
