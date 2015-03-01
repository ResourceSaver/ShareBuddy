class Minigame implements Actor {
    private whackAMole: IMiniGame;
    private frogger: IMiniGame;
    private pizza: IMiniGame;
    private cooking: IMiniGame;
    private selectedMiniGame: IMiniGame; 

    public static minigameHelper: MiniGameHelper;

    public static backgroundContext;
    public static textContext;
    public static mid1Context;
    public static mid2Context;
    public static mid3Context;


    public constructor() {
        var backgroundCanvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("background");
        Minigame.backgroundContext = <CanvasRenderingContext2D> backgroundCanvas.getContext("2d");
        Minigame.backgroundContext.canvas.height = System.CanvasHeight;
        Minigame.backgroundContext.canvas.width = System.CanvasWidth;
        Minigame.backgroundContext.canvas.style.height = System.GetGH() + "px";
        Minigame.backgroundContext.canvas.style.width = System.GetGW() + "px";

        var frontCanvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("text");
        Minigame.textContext = frontCanvas.getContext("2d");
        Minigame.textContext.canvas.width = System.CanvasWidth;
        Minigame.textContext.canvas.height = System.CanvasHeight;
        Minigame.textContext.canvas.style.height = System.GetGH() + "px";
        Minigame.textContext.canvas.style.width = System.GetGW() + "px";
        Minigame.textContext.font = "bold 14px Trebuchet MS";

        var mid1Canvas = <HTMLCanvasElement>  document.getElementById("mid1");
        Minigame.mid1Context = mid1Canvas.getContext("2d");
        Minigame.mid1Context.canvas.height = System.CanvasHeight;
        Minigame.mid1Context.canvas.width = System.CanvasWidth;
        Minigame.mid1Context.canvas.style.width = System.GetGW() + "px";
        Minigame.mid1Context.canvas.style.height = System.GetGH() + "px";

        var mid2Canvas = <HTMLCanvasElement>  document.getElementById("mid2");
        Minigame.mid2Context = mid2Canvas.getContext("2d");
        Minigame.mid2Context.canvas.height = System.CanvasHeight;
        Minigame.mid2Context.canvas.width = System.CanvasWidth;
        Minigame.mid2Context.canvas.style.width = System.GetGW() + "px";
        Minigame.mid2Context.canvas.style.height = System.GetGH() + "px";

        var mid3Canvas = <HTMLCanvasElement>  document.getElementById("mid3");
        Minigame.mid3Context = mid3Canvas.getContext("2d");
        Minigame.mid3Context.canvas.height = System.CanvasHeight;
        Minigame.mid3Context.canvas.width = System.CanvasWidth;
        Minigame.mid3Context.canvas.style.width = System.GetGW() + "px";
        Minigame.mid3Context.canvas.style.height = System.GetGH() + "px";


        Minigame.minigameHelper = new MiniGameHelper(Minigame.textContext);


        this.whackAMole = new WhackAMole();
        this.frogger = new RainingDrops();
        this.pizza = new PizzaGame();
        this.cooking = new Cooking();

        $("#closeMinigame").on("click", () => this.StopMiniGame(true));
    }

    private ClearCanvas() {
        Minigame.backgroundContext.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
        Minigame.textContext.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
        Minigame.mid1Context.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
        Minigame.mid2Context.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
        Minigame.mid3Context.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
    }

    public StartGame(type: string) {
        this.ClearCanvas();
        $.mobile.changePage("#minigame", { changeHash: false, transition: transitions });

        switch (type) {
            case "Cooking":
                this.selectedMiniGame = this.cooking;
                break;
            case "Leisure":
                this.selectedMiniGame = this.pizza;
                break;
            case "Hygiene":
                this.selectedMiniGame = this.frogger;
                break;
            case "Fitness":
                this.selectedMiniGame = this.whackAMole;
                break;
        }

        this.selectedMiniGame.Start();
        Game.SetMiniGames();
    }

    public Act() {
        if (this.selectedMiniGame.Act()) {
            this.StopMiniGame(false);
        }
    }

    private StopMiniGame(cancelled: boolean) {
        this.selectedMiniGame.Act();

        Game.SetMain();
        setTimeout(() => { Game.ShowMiniGameResult(this.selectedMiniGame.GetScore(), cancelled, this.selectedMiniGame.GetId()); }, 2000);
    }
} 

class MiniGameHelper {
    private missedBox: Box;
    private actionButton: ActionButton;

    public constructor(canvas) {
        this.missedBox = new Box(canvas, 0, System.CanvasWidth - 110, "#b92020");
        this.actionButton = new ActionButton();
    }

    public ShowButton() {
        this.actionButton.Show();
    }

    public SetButtonLocation(x: number, y: number, text: string) {
        this.actionButton.SetLocation(x, y, text);
    }

    public HideButton() {
        this.actionButton.Hide();
    }

    public UpdateMissedBox() {
        this.missedBox.Add();
    }

    public Reset(allowedMiss: number, showBox:boolean) {
        this.WriteLevel(1);
        this.WritePoints(0)

        if(showBox)
            this.missedBox.Reset(allowedMiss);
    }

    private WriteText(text: string, x: number, y: number, color: string, fontsize = 14) {
        Minigame.textContext.clearRect(x, y - 15, 70, 50);
        Minigame.textContext.font = "bold " + fontsize + "px Trebuchet MS";
        Minigame.textContext.fillStyle = "black";
        Minigame.textContext.fillText(text, x + 1, y + 1, 100);
        Minigame.textContext.fillStyle = color;
        Minigame.textContext.fillText(text, x, y, 100);
    }

    private timeout;

    public WriteTempText(points: number) {
        var x = System.CanvasWidth - 100;
        var y = System.CanvasHeight - 50;

        clearTimeout(this.timeout);
        Minigame.textContext.clearRect(x, y - 50, 70, 50); 


        this.WriteText("+" + points, x, y, 'green', 50);

        this.timeout = setTimeout(() => { Minigame.textContext.clearRect(x, y - 50, 70, 50); }, 3000);
    }

    public WritePoints(score: number) {
        this.WriteText("Points " + score, 270, 15, "white");
    }
    public WriteLevel(level: number) {
        this.WriteText("Level " + level, 185, 15, "white");
    }

}

interface IMiniGame {

    Act();
    GetId();
    GetScore();
    Start();
    Click(x: number, y: number);
    ClickUp();
}

class SuperMini {
    public backgroundImage: HTMLImageElement;

    public id: number;
    public score: number;

    private currentSpawnSpeedCounter: number;
    public currentSpawnSpeed: number;
    public spawnSpeedEnd: number;
    public spawnSpeedIncrease: number;

    public missedTotal: number;

    public toSpawnPerLevel: number;
    public spawnedThisLevel: number;
    public spawnedTotal: number;

    public currentLevel: number;
    public finalLevel: number;

    public SpawnIfReady() {
        this.currentSpawnSpeedCounter++;

        if (this.currentSpawnSpeedCounter > this.currentSpawnSpeed && Math.random() > 0.8) {
            this.Spawn();
            this.currentSpawnSpeedCounter = 0;
            
            if (this.spawnedThisLevel == this.toSpawnPerLevel) { // LEVEL UP
                this.currentSpawnSpeed -= this.spawnSpeedIncrease;
                this.spawnedThisLevel = 0;
                this.currentLevel++;
                Minigame.minigameHelper.WriteLevel(this.currentLevel);

                if (this.currentLevel == this.finalLevel) return true;
            }
        }

        return false;
    }

    public Spawn() {
        this.spawnedThisLevel++;
        this.spawnedTotal++;
    }

    public Start(spawnSpeedStart:number, spawnSpeedEnd: number) {

        this.currentSpawnSpeed = spawnSpeedStart;
        this.toSpawnPerLevel = spawnSpeedEnd;
        this.spawnSpeedIncrease = Math.floor(((spawnSpeedStart - spawnSpeedEnd) / (this.finalLevel - 2)));
        this.score = 0;
        this.currentLevel = 1;
        this.currentSpawnSpeedCounter = 0;
        this.spawnedTotal = 0;
        this.spawnedThisLevel = 0;
        this.missedTotal = 0;

        Minigame.backgroundContext.drawImage(this.backgroundImage, 0, 0, this.backgroundImage.width, this.backgroundImage.height, 0, 0, System.CanvasWidth, System.CanvasHeight);
    }
}

class Box {
    private context: CanvasRenderingContext2D;
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    private addSize: number;
    private count: number;
    private color: string;

    public constructor(context: CanvasRenderingContext2D, ys: number, xs: number, color: string) {
        this.color = color;
        this.count = 0;
        this.w = 100;
        this.h = 10;
        this.y = ys + 5;
        this.x = xs - 5;

        this.context = context;
        this.context.lineWidth = 1;
        this.context.strokeStyle = "black";
        this.context.strokeRect(this.x, this.y, this.w, this.h);
    }

    public Reset(dataValue: number) {
        this.count = 0;
        this.context.clearRect(this.x, this.y, this.w, this.h);
        this.addSize = this.w / dataValue;
        this.drawBox();
    }

    public drawBox() {
        this.context.fillStyle = "#06d56d";

        this.context.strokeRect(this.x, this.y, this.w, this.h);
        this.context.fillRect(this.x, this.y, this.w, this.h);
    }

    public Add() {
        this.count++;
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.count * this.addSize, this.h);
    }
}

class ActionButton {
    private context: CanvasRenderingContext2D;
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    private text: string;
    private shown: boolean = false;

    public constructor() {
        this.w = 100;
        this.h = 50;

        this.context = Minigame.textContext;
        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
    }

    public SetLocation(x: number, y: number, text:string) {
        this.x = x;
        this.y = y;
        this.text = text;
    }

    public Hide() {
        this.shown = false;
        this.context.clearRect(this.x, this.y, this.w, this.w);

    }

    public Show() {
        if (this.shown) return;
        this.shown = true;
        this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.context.fillRect(this.x, this.y, this.w, this.h);
        this.context.fillStyle = "white";

        this.context.fillText(this.text, this.x + (30), this.y + 5 + (this.h / 2), 100);
    }
}