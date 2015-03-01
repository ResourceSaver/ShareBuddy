class PizzaGame extends SuperMini implements IMiniGame {
    private static baker1: Baker;
    private static baker2: Baker;
    private numberOfSlides: number = 5;
    private pizzaPool: PizzaPool;
    private spacing: number;
    private allowedMisses: number;

    public constructor() {
        super();

        this.backgroundImage = images.circuit;

        jumpat = Math.floor((System.CanvasWidth / 100) * 60);
        this.spacing = Math.round(System.CanvasHeight / this.numberOfSlides);
        this.id = 4;

        this.finalLevel = 10;
        this.allowedMisses = 10;

        this.CreateBakers();
        this.pizzaPool = new PizzaPool(this.spacing, this, this.numberOfSlides);
    }

    public Start() {
        super.Start(200, 65);
        System.GetGesture().Subscribe(this);

        this.toSpawnPerLevel = 10;

        this.pizzaPool.Reset();
        this.ResetBakers();
        Minigame.minigameHelper.Reset(this.allowedMisses, true);
    }

    private CreateBakers() {

        var animationData: AnimationData = new AnimationData(images.plate, Minigame.mid1Context, 1, 1);
        PizzaGame.baker1 = new Baker(animationData, this.spacing);
        PizzaGame.baker2 = new Baker(animationData, this.spacing);
    }

    private ResetBakers() {
        var x1: number = (System.CanvasWidth / 5);
        var x2: number = System.CanvasWidth - (System.CanvasWidth * 2 / 8);
        var y: number = this.spacing * 2;

        PizzaGame.baker1.Set(x1, y);
        PizzaGame.baker2.Set(x2, y);
    }

    public Miss() {
        this.missedTotal++;
        Minigame.minigameHelper.UpdateMissedBox();
    }

    public Hit(points: number) {
        this.score += points;
        Minigame.minigameHelper.WritePoints(this.score);
    }
    
    private down: boolean = false;
    private x: number;
    private y: number;
    private moveCounter: number = 0;
    private moveCounterTop: number = 10;

    public ClickUp() {
        this.moveCounter = 0;
        this.down = false;
    }

    public Click(x: number, y: number) {
        this.moveCounter = this.moveCounterTop;
        this.x = x;
        this.y = y;
        this.down = true;
    }

    public MovePad() {

        this.moveCounter++;

        if (this.moveCounter < this.moveCounterTop) return;

        this.moveCounter = 0;


        if (this.x < (System.GetGW() / 2)) { // left
            if (this.y < (System.GetGH() / 2)) // top
                PizzaGame.baker1.MoveUp();
            else
                PizzaGame.baker1.MoveDown();
        }
        else {
            if (this.y < (System.GetGH() / 2)) // top
                PizzaGame.baker2.MoveUp();
            else
                PizzaGame.baker2.MoveDown();
        }
    }

    public Act() {

        var gameOver = this.SpawnIfReady();

        if (this.down) this.MovePad();
        this.pizzaPool.Act();

        if (this.missedTotal == this.allowedMisses) return true;

        return gameOver;
    }

    public Spawn() {
        if (this.pizzaPool.Spawn()) {
            super.Spawn();
        }
    }

    public GetScore() { return this.score; }

    public GetId() { return this.id; }

    public static GetBaker1() { return PizzaGame.baker1; }
    public static GetBaker2() { return PizzaGame.baker2; }
}

class Baker {
    private x: number;
    private y: number;
    private animation: Animation;
    private spacing: number;

    public constructor(animationData: AnimationData, spacing: number) {
        this.spacing = spacing;
        animationData.SetScreenSize(this.spacing, System.CanvasWidth / 20);
        this.animation = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 0, 0, 1);
    }

    public GetX2() { return this.animation.GetAnimationData().GetScreenWidht() + this.x; }
    public GetX1() { return this.x; }
    public GetY() { return this.y; }

    public Set(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.Draw();
    }

    public MoveUp() {
        if (this.y - this.spacing < 0)
            return;

        this.y -= this.spacing;
        this.Draw();
    }

    public MoveDown() {
        if (this.y + this.spacing >= System.CanvasHeight)
            return;

        this.y += this.spacing;
        this.Draw();
    }

    private Draw() {
        this.animation.DrawLoop(this.x, this.y);
    }
}

class PizzaPool {
    private pizze: Pizza[];
    private maxNumberOfPizze: number;
    private spacing: number;
    private numberOfSlides: number;
    private game: PizzaGame;

    public Reset() {
        for (var i = 0; i < this.pizze.length; i++) {
            this.pizze[i].Reset();
        }
    }

    public constructor(spacing: number, pizzaGame: PizzaGame, ss: number) {
        this.game = pizzaGame;
        this.numberOfSlides = ss;
        this.spacing = spacing;
        this.maxNumberOfPizze = 10;
        this.pizze = new Array(this.maxNumberOfPizze);
        this.CreatePizze();
    }

    private CreatePizze() {
        var animationData: AnimationData = new AnimationData(images.cookie, Minigame.mid2Context, 4, 2);

        for (var i = 0; i <= this.maxNumberOfPizze; i++) {
            this.pizze[i] = new Pizza(animationData, this.spacing );
        }
    }

    public Spawn() {
        var speed = 1;

        var r: number = Math.random();
        var t: CurrentType = CurrentType.SMALL;

        if (r < 0.05) t = CurrentType.BIG;

        var row: number = Math.round(r * 10) % this.numberOfSlides;

        var jump = (row < this.numberOfSlides - 1 && Math.random() < 0.1);

        if (!this.pizze[this.maxNumberOfPizze].IsSliding()) {
            this.pizze[this.maxNumberOfPizze].Spawn(row, speed, t, jump);
            this.pizze.unshift(this.pizze.pop());
            return true;
        }

        return false;
    }

    public Act() {
        for (var i = 0; i < this.pizze.length; i++) {
            if (!this.pizze[i].IsSliding()) {
                break;
            }

            this.pizze[i].Draw();
            var pizzaState: PizzaState = this.pizze[i].Move();

            if (pizzaState == PizzaState.MISS) {
                this.pizze.push(this.pizze.splice(i, 1)[0]);
                this.game.Miss();
            }
            else if (pizzaState == PizzaState.HIT) {                // hit

                if (this.pizze[i].GetType() == CurrentType.BIG) this.game.Hit(5);
                else (this.game.Hit(1));
                
            }
        }
    }
}

var jumpat: number;

class Pizza {
    private x: number;
    private y: number;
    private drawY: number;
    private animation: Animation;
    private animationbig: Animation;
    private animationSmall: Animation;
    private pizzaState: PizzaState;
    private speed: number;
    private OffsetY: number;
    private static spacing: number;
    private type: CurrentType;
    private jump: boolean;
    private row: number;
    
    public Reset() {
        this.x = 0;
        this.pizzaState = PizzaState.NONE;
    }

    public constructor(animationData: AnimationData, spacing: number) {
        Pizza.spacing = spacing;
        this.animationSmall = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 0, 0, 4);
        this.animationbig = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 1, 0, 4);

        this.OffsetY = animationData.GetScreenSizeHeight() / 2;
        this.pizzaState = PizzaState.NONE;
    }

    public Spawn(row: number, speed, type: CurrentType, jump: boolean) {
        this.jumped = false;
        this.speed = speed;

        this.type = type;
        if (type == CurrentType.BIG) this.animation = this.animationbig;
        else this.animation = this.animationSmall;
        
        this.row = row;
        this.jump = jump;

        this.pizzaState = PizzaState.SLIDING;
        this.x = - this.animation.GetAnimationData().GetScreenWidht();
        this.y = row * Pizza.spacing;

        this.drawY = this.y + (Pizza.spacing / 2) - this.OffsetY;
    }

    public GetType() { return this.type; }

    public IsSliding() {
        return (this.pizzaState == PizzaState.SLIDING);
    }

    private moveCounter = 0;
    private moveCounterTop = 1;
    private jumped: boolean = false;

    public Move() {

        if (this.x == jumpat && this.jump && !this.jumped) {
            this.jumped = true;
            this.row++;
            this.y = this.row * Pizza.spacing;
            this.drawY = this.y + (Pizza.spacing / 2) - this.OffsetY;
        }

        this.moveCounter++;

        if (this.moveCounter > this.moveCounterTop) {
            this.moveCounter = 0;
            this.x += this.speed;
        }

        if (this.x > System.CanvasWidth) {
            this.pizzaState = PizzaState.NONE;
            return PizzaState.HIT;
        }

        else if (this.CheckCollision())
            return PizzaState.MISS;

        return PizzaState.NONE;
    }

    private CheckCollision() {

        var baker1: Baker = PizzaGame.GetBaker1();
        var baker2: Baker = PizzaGame.GetBaker2();
        var x2: number = this.animation.GetAnimationData().GetSpriteWidth() + this.x;

        if (baker1.GetX1() <= x2 && baker1.GetX2() >= this.x && baker1.GetY() == this.y) { // GOTIT
            this.x = baker1.GetX2();
        }
        else if (baker2.GetX1() <= x2 && baker2.GetX2() >= this.x && baker2.GetY() == this.y) { // GOTIT
            this.x = baker2.GetX2();
        }
        else if (x2 >= baker1.GetX1() && baker1.GetX2() > this.x && this.y != baker1.GetY()) { // DROPPED
            this.pizzaState = PizzaState.NONE;
            this.animation.Clear();
            return true;
        }
        else if (x2 >= baker2.GetX1() && baker2.GetX2() > this.x && this.y != baker2.GetY()) { // DROPPED
            this.pizzaState = PizzaState.NONE;
            this.animation.Clear();
            return true;
        }

        return false;
    }

    public Draw() {
        this.animation.DrawLoop(this.x, this.drawY);
    }
}

