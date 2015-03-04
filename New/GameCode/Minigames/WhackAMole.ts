class WhackAMole extends SuperMini implements IMiniGame {
    private moleSpaceX: number;
    private moleSpaceY: number;
    private piles: NonAnimation;
    private moles: Mole[][];
    private numberOfMoles: number;
    private moleAliveDuration: number;
    private molesAllowedToMiss: number;

    public constructor() {
        super();
        this.numberOfMoles = 3;
        this.backgroundImage = images.molebg;
        this.moleSpaceY = Math.round(System.CanvasHeight / this.numberOfMoles); // 3 = number of moles
        this.moleSpaceX = Math.round(System.CanvasWidth / this.numberOfMoles);
        this.piles = new NonAnimation(Minigame.mid3Context, this.moleSpaceY, this.moleSpaceX);
        this.id = 4;

        this.finalLevel = 10;
        this.molesAllowedToMiss = 5;

        this.moles = new Array(3); // 3 = number of moles
        this.CreateMoles();
    }

    public Start() {
        super.Start(45, 1 );
        System.GetGesture().Subscribe(this);
        this.piles.Draw();
        this.moleAliveDuration = 400;

        this.toSpawnPerLevel = 15;

        // reset moles
        for (var i = 0; i < this.numberOfMoles; i++) {
            for (var j = 0; j < this.numberOfMoles; j++) {
                this.moles[i][j].Reset();
            }
        }

        Minigame.minigameHelper.Reset(this.molesAllowedToMiss, true);
    }

    private CreateMoles() {
        var animationData: AnimationData = new AnimationData(images.mole, Minigame.mid1Context, 6, 4);
        var x: number = 0;
        var y: number = 0;

        for (var i = 0; i < this.numberOfMoles; i++) {
            var arr: Mole[] = new Array(this.numberOfMoles);

            for (var j = 0; j < this.numberOfMoles; j++) {
                arr[j] = new Mole(x + (this.moleSpaceX / 2), y + (this.moleSpaceY / 2), animationData);
                this.piles.AddImage(images.pile, x, y);
                x += this.moleSpaceX;
            }
            y += this.moleSpaceY;
            x = 0;
            this.moles[i] = arr;
        }
    }

    public Spawn() {
        var x = Math.round(Math.random() * (this.numberOfMoles - 1));
        var y = Math.round(Math.random() * (this.numberOfMoles - 1));

        if (this.moles[x][y].Spawn(this.moleAliveDuration)) {
            super.Spawn();
        }
    }

    public Click(holdX: number, holdY:number) {
        var x = Math.floor(holdX / (System.GetGW() / this.numberOfMoles));
        var y = Math.floor(holdY / (System.GetGH() / this.numberOfMoles));

        if (x < 0 || x >= this.numberOfMoles || y < 0 || y >= this.numberOfMoles) return;

        if (this.moles[y][x].Hit()) {
            if (this.moles[y][x].IsMole()) {
                this.score++;
                super.SpawnHandled();
                Minigame.minigameHelper.WritePoints(this.score);
            }
            else { // player clicked bomb
                this.missedTotal++;
                super.SpawnHandled();
                Minigame.minigameHelper.UpdateMissedBox();
            }
        }
    }

    public Act() {
        if (this.missedTotal == this.molesAllowedToMiss) return true;

        this.SpawnIfReady(); // spawns if time, return true if final level is reached

        for (var i = 0; i < this.numberOfMoles; i++) {
            for (var j = 0; j < this.numberOfMoles; j++) {
                if (this.moles[i][j].Draw()) {
                    if (this.moles[i][j].IsMole()) {
                        this.missedTotal++;
                        Minigame.minigameHelper.UpdateMissedBox();
                    }

                    super.SpawnHandled();
                }
            }
        }

        return this.gameOver;
    }

    public GetId() { return this.id; }

    public GetScore() { return this.score; }

    public ClickUp() { }
}

class Mole {
    private state: MoleState;
    private x: number;
    private y: number;
    private animation: Animation;
    private animationAppear: Animation;
    private animationMissed: Animation;
    private animationHit: Animation;

    private nanimation: Animation;
    private nanimationAppear: Animation;
    private nanimationMissed: Animation;
    private nanimationHit: Animation;

    private manimation: Animation;
    private manimationAppear: Animation;
    private manimationMissed: Animation;
    private manimationHit: Animation;
    
    private timer;
    private isMole: boolean;
    private duration: number;
    private data: AnimationData;

    constructor(x: number, y: number, data: AnimationData) {
        this.state = MoleState.DEAD;
        this.x = x - (data.GetScreenWidht() / 2);
        this.y = y - (data.GetScreenSizeHeight() / 2);
        this.data = data;
        this.manimation = new Animation(this.data, AnimationSpeed.Medium, Direction.horizontal, 0, 0, 2);
        this.manimationMissed = new Animation(this.data, AnimationSpeed.Fast, Direction.horizontal, 2, 0, 3);
        this.manimationHit = new Animation(this.data, AnimationSpeed.Fast, Direction.horizontal, 1, 0, 3);
        this.manimationAppear = new Animation(this.data, AnimationSpeed.Fast, Direction.horizontal, 3, 0, 3);
        this.nanimation = new Animation(this.data, AnimationSpeed.Medium, Direction.horizontal, 0, 3, 2);
        this.nanimationMissed = new Animation(this.data, AnimationSpeed.Fast, Direction.horizontal, 2, 3, 3);
        this.nanimationHit = new Animation(this.data, AnimationSpeed.Fast, Direction.horizontal, 1, 3, 3);
        this.nanimationAppear = new Animation(this.data, AnimationSpeed.Fast, Direction.horizontal, 3, 3, 3);
    }

    public Spawn(duration: number) {

        if (this.state != MoleState.DEAD) {
            return false;
        }

        this.duration = duration;
        this.isMole = (Math.random() < 0.9);

        if (this.isMole) {
            this.animation = this.manimation;
            this.animationAppear = this.manimationAppear;
            this.animationHit = this.manimationHit;
            this.animationMissed = this.manimationMissed;
        }
        else {
            this.animation = this.nanimation;
            this.animationAppear = this.nanimationAppear;
            this.animationHit = this.nanimationHit;
            this.animationMissed = this.nanimationMissed;
        }
        
        this.state = MoleState.APPEARING;
        return true;
        //return (this.isMole);
    }

    public IsMole() { return this.isMole; }

    private Missed() {
        if (this.state != MoleState.HIT) {
            clearInterval(this.timer);
            this.state = MoleState.MISSED;
        }
    }

    public Reset() {
        this.state = MoleState.DEAD;
        clearInterval(this.timer);
    }

    public Draw() {
        switch (this.state) {
            case MoleState.APPEARING:
                if (!this.animationAppear.DrawOnce(this.x, this.y)) { break; }
                this.timer = setTimeout(() => this.Missed(), this.duration);
                this.state = MoleState.VISIBLE;
                break;
            case MoleState.VISIBLE:
                this.animation.DrawLoop(this.x, this.y);
                break;
            case MoleState.MISSED:
                if (!this.animationMissed.DrawOnce(this.x, this.y)) { break; }
                this.animationMissed.Clear();
                this.state = MoleState.DEAD;
                return true;
            case MoleState.HIT:
                if (!this.animationHit.DrawOnce(this.x, this.y)) { break; }
                this.state = MoleState.DEAD;
                this.animationHit.Clear();
        }
        return false;
    }

    public Hit(): boolean {
        if (this.state != MoleState.DEAD && this.state != MoleState.HIT && this.state != MoleState.MISSED) {
            clearInterval(this.timer);
            this.state = MoleState.HIT;
            return true;
        }

        return false;
    }
}