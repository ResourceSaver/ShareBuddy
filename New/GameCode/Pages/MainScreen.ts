class MainScreen implements Actor {
    private pet: Pet;

    public constructor() {
        $("#logoutbutton").bind("click", () => System.Logout());
        $("#menu").hide();

        MiniCast.Setup();
        this.pet = new Pet();

        $("#main").bind("pageshow", function ()  {
            var headerHeight = $("[data-role=header]:visible").height();
            $("#menu").css({ 'top': headerHeight.toString() + "px" });
            $("#menu").fadeIn();
            $("#main").unbind("pageshow");
        });
    }

    private UpdateLabels() {
        $("#name").html(" &nbsp;" + System.GetUserData().GetBuddyName() + " &nbsp;");
        $("#score").html(System.GetUserData().GetScore().toString() + " &nbsp;");
        $("#water").html(System.GetUserData().GetWater().toString() + " &nbsp;");
        $("#electricity").html(System.GetUserData().GetElectricity().toString() + " &nbsp;");
    }

    public ShowAnimation(action:Action) {
        this.UpdateLabels();
        this.pet.SetAnimation(action);

        if (!System.GetUserData().IsMore())
            setTimeout(() => this.TodayOverMessage(), 3000);
    }

    private TodayOverMessage() {
        Game.ChangePage();
    }
    
    public Act() { this.pet.Act(); }  

    public Show() {
        Game.SetMain();
        $.mobile.changePage("#main", { changeHash: false, transition: transitions });
        this.UpdateLabels();
    }
}

class AnimationWrapper {
    private background: CanvasRenderingContext2D;
    private animationNeutral: Animation;
    private animationPasta: Animation;
    private animationTv: Animation;
    private animationEReader: Animation;
    private animationShower: Animation;
    private animationShave: Animation;
    private animationPizza: Animation;
    private animationSun: Animation;
    private animationTMill: Animation;
    private animationBrushteeth: Animation;
    private animationDumbell: Animation;
    private animationPopcorn: Animation;
    private animationLaptop: Animation;
    private animationCurrent: Animation;

    constructor() {
        var canvas = <HTMLCanvasElement>  document.getElementById("backgroundMain");
        this.background = canvas.getContext("2d");
        canvas.style.width = System.GetGW()  + "px";
        canvas.style.height = System.GetGH() + "px"; // use to remove 33 for android
        this.background.canvas.height = System.CanvasHeight;
        this.background.canvas.width = System.CanvasWidth;

        var canvasMain = <HTMLCanvasElement>  document.getElementById("canvasMain");
        var contextMain = canvasMain.getContext("2d");
        contextMain.canvas.height = System.CanvasHeight;
        contextMain.canvas.width = System.CanvasWidth;
        contextMain.canvas.style.height = System.GetGH() + "px"; // use to - 33 for android
        contextMain.canvas.style.width = System.GetGW() + "px";

        var image: HTMLImageElement;
        if (System.GetUserData().IsMale()) { image = images.pet; }
        else { image = images.female; }

        var animationData: AnimationData = new AnimationData(image, contextMain, 6, 6);
        this.animationNeutral = new Animation(animationData, AnimationSpeed.Slowest, Direction.vertical, 0, 2, 2);
        this.animationPasta = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 1, 0, 2);
        this.animationTv = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 0, 3, 3);
        this.animationEReader = new Animation(animationData, AnimationSpeed.Slow, Direction.horizontal, 0, 0, 2);
        this.animationShower = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 1, 3, 3);
        this.animationShave = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 2, 0, 3);
        this.animationPizza = new Animation(animationData, AnimationSpeed.Slow, Direction.horizontal, 2, 3, 3);
        this.animationSun = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 3, 0, 3);
        this.animationTMill = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 3, 3, 3);
        this.animationBrushteeth = new Animation(animationData, AnimationSpeed.Slow, Direction.horizontal, 4, 0, 3);
        this.animationDumbell = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 4, 3, 3);
        this.animationPopcorn = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 5, 0, 3);
        this.animationLaptop = new Animation(animationData, AnimationSpeed.Slow, Direction.horizontal, 5, 3, 2);
        this.animationCurrent = this.animationNeutral;
        this.DrawBackground();
    }

    private DrawBackground() {
        this.background.drawImage(images.background, 0, 0, images.background.width, images.background.height, 0, 0, System.CanvasWidth, System.CanvasHeight);
    }

    private repeat: number = 0;

    public SetPopcorn(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationPopcorn;
    }

    public SetDumbell(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationDumbell;
    }

    public Setteeth(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationBrushteeth;
    }

    public SetLaptop(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationLaptop;
    }

    public SetShower(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationShower;
    }

    public SetEReader(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationEReader;
    }

    public SetTMill(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationTMill;
    }

    public setPasta(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationPasta;
    }

    public SetNeutral() {
        this.repeat = -1;
        this.animationCurrent = this.animationNeutral;
    }

    public SetTV(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationTv;
    }

    public SetPizza(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationPizza;
    }

    public Workout(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationDumbell;
    }

    public Solarium(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationSun;
    }

    public Shave(repeat: number) {
        this.repeat = repeat;
        this.animationCurrent = this.animationShave;
    }

    public Draw() {

        if (this.repeat == -1) {
            this.animationCurrent.DrawLoopAligned();
            return false;
        }
        else {
            var done: boolean = this.animationCurrent.DrawOnceAligned();
            if (done) {

                this.repeat--;

                if (this.repeat == 0) {
                    this.repeat = -1;
                    return true;
                }
            }
        }
    }
}


enum PetState {
    NEUTRAL,
    NOTHING
}

class Pet {
    private state: PetState;
    private wrapper: AnimationWrapper;

    constructor() {
        this.state = PetState.NEUTRAL;
        this.wrapper = new AnimationWrapper();
    }

    public Act() {
        switch (this.state) {
            case PetState.NEUTRAL:
                this.wrapper.Draw();
                break;
            case PetState.NOTHING:
                var done: boolean = this.wrapper.Draw();
                if (done) {
                    this.state = PetState.NEUTRAL;
                    this.wrapper.SetNeutral();
                }
                break;
        }

    }

    public SetAnimation(action: Action) {

        switch (action.GetId()) {
            case 1: this.wrapper.SetPopcorn(7); break;
            case 2: this.wrapper.setPasta(7); break;
            case 3: this.wrapper.SetPizza(7); break;
            case 4: this.wrapper.SetEReader(7); break;

            case 5: this.wrapper.SetLaptop(7); break;
            case 6: this.wrapper.SetTV(7); break;
            case 7: this.wrapper.Workout(7); break;
            case 8: this.wrapper.Solarium(7); break;
            case 9: this.wrapper.SetTMill(7); break;
            case 10: this.wrapper.Setteeth(7); break;
            case 11: this.wrapper.Shave(7); break;
            case 12: this.wrapper.SetShower(7); break;
        }

        this.state = PetState.NOTHING;
    }
}