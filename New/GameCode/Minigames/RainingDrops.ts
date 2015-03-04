class RainingDrops extends SuperMini implements IMiniGame {
    private bucket: Frog;
    private cookies: DropPool;
    private bee: Bee;
    private allowedMisses: number;

    constructor() {
        super();
        this.backgroundImage = images.rainbg;
        this.id = 2;

        this.finalLevel = 10;
        this.allowedMisses = 10;

        this.bucket = new Frog(Minigame.mid1Context);
        this.bee = new Bee(this.bucket);
        this.cookies = new DropPool(Minigame.mid1Context, Minigame.mid2Context, this, this.bucket, this.bee);
    }

    public Start() {
        super.Start(50, 1);
        System.GetGesture().Subscribe(this);
        Minigame.minigameHelper.SetButtonLocation(System.CanvasWidth - 110, 5, "Shoot");
        this.toSpawnPerLevel = 10;
        this.cookies.Reset();
        this.bucket.SetDirection(0);
        this.bucket.SetXY();

        Minigame.minigameHelper.Reset(this.allowedMisses, true);
    }

    private gameOver = false;

    public Act() {
        if (this.SpawnIfReady())
            return true;
        
        this.bucket.Act();
        this.cookies.Draw();
        this.bee.Act();

        if (this.bucket.GetX2() - 28 > this.bee.GetX() && this.bucket.GetX() + 28 < this.bee.GetX2() && this.bee.GetY2() - 15 > this.bucket.GetY()) {
            this.gameOver = true;
        }

        if (this.missedTotal == this.allowedMisses) this.gameOver  = true;

        if (this.gameOver ) {
            this.bucket.Freeze();
        }


        return this.gameOver ;
    }

    public Spawn() {
        if (this.cookies.Spawn()) {
            super.Spawn();
        }
    }

    public Hit(points: number) {
        this.score += points
        Minigame.minigameHelper.WritePoints(this.score);

        if (this.score >= 3) {
            Minigame.minigameHelper.ShowButton();
        }
    }

    public Miss() {
        this.missedTotal++;
        Minigame.minigameHelper.UpdateMissedBox();
    }

    public Click(x: number, y: number) {
        if (this.score >= 3 && x > System.CanvasWidth - 110 && y <  70) {
            this.score -= 3;
            Minigame.minigameHelper.WritePoints(this.score);
            this.cookies.Shoot();

            if (this.score < 3) Minigame.minigameHelper.HideButton();
        }
        else if (x < System.GetGW() / 2) this.bucket.SetDirection(-1);
        else this.bucket.SetDirection(1);
    }

    public GetId() {
        return this.id;
    }

    public GetScore() {
        return this.score;
    }

    public ClickUp() { }
}

class Bee {

    private x: number;
    private y: number;
    private directionY: number;
    private directionX: number;
    private animation: Animation;
    private animationData: AnimationData;
    private hit: boolean;
    private hitCounter: number = 0;

    public constructor(bucket:Frog) {
        this.x = Math.round(System.CanvasWidth / 2);
        this.y = 80;
        this.directionX = 1;
        this.directionY = -1;
        this.hit = false;

        this.animationData = new AnimationData(images.bee, Minigame.textContext, 4, 1);
        this.animation = new Animation(this.animationData, AnimationSpeed.Medium, Direction.horizontal, 0, 0, 4);
    }

    public GetX() { return this.x; }

    public GetY2() { return this.y + this.animationData.GetScreenSizeHeight(); }

    public GetX2() { return this.x + this.animationData.GetScreenWidht(); }

    public GetY() { return this.y; }

    private moveSpeed:number = 0;
    private moveCounter:number = 0;

    private Move() {




        if (this.hit) {
            this.hitCounter++;
            this.x--;
            this.y--;

            if (this.hitCounter > 300) {
                this.hit = false;
                this.hitCounter = 0;
            }
        }
        else {

            this.x += this.directionX;
            this.y += this.directionY;

            if (Math.random() > 0.95) {
                this.directionX = this.directionX * -1;
                return;
            }
            else if (Math.random() < 0.05) {
                this.directionY = this.directionY * -1;
                return;
            }
        }

        if (this.x + this.animationData.GetScreenWidht() >= System.CanvasWidth) {
            this.x = System.CanvasWidth - this.animationData.GetScreenWidht();
        }
        else if (this.x <= 0)
            this.x = 0;
        if (this.y + this.animationData.GetScreenSizeHeight() >= System.CanvasHeight)
            this.y = System.CanvasHeight - this.animationData.GetScreenSizeHeight();
        else if (this.y < 50)
            this.y = 50;
    }

    private Draw() { this.animation.DrawLoop(this.x, this.y); }

    public Hit() {
        this.hitCounter = 0;
        this.hit = true;
    }

    public IsHit() {
        return this.hit;
    }

    public Act() {
        this.moveCounter++;
        if (this.moveCounter < this.moveSpeed) return;
        this.moveCounter = 0;

        this.Move();
        this.Draw();
    }
}

class Clouds {
    private x: number;
    private y: number;
    private picture: SingleImage;
    private static resetX: number;
    private static drawWhen: number;
    private drawCount: number;
    private drawCounter2: number = 0;


    public constructor(image: HTMLImageElement, x: number, y: number, canvas:CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.picture = new SingleImage(canvas, image, image.height, image.width);
        this.drawCount = 0;
        Clouds.drawWhen = 4;
        Clouds.resetX = System.CanvasWidth + (System.CanvasWidth / 2);
    }

    public Act() {
        this.drawCount++;
        if (this.drawCount < Clouds.drawWhen)
            return;

        this.drawCount = 0;

        this.drawCounter2++;

        this.Draw();
        this.Move();
    }

    private Move() {
        if (this.x + this.picture.GetWidth() < 0)
            this.x = Clouds.resetX;

        this.x -= 1;
    }

    private Draw() { this.picture.Draw(this.x, this.y); }
}

class Frog {
    private left: Animation;
    private right: Animation;
    private still: Animation;
    private wet: Animation;
    private lightening: Animation;
    private x: number;
    private y: number;
    private y2: number;
    private speed: number;
    private width: number;
    private height: number;
    private freezeTimer;
    private direction: number;
    private bucketState: BucketState;

    constructor(canvas:CanvasRenderingContext2D) {
        var animationData = new AnimationData(images.bucket, canvas, 4, 4);
        this.left = new Animation(animationData, AnimationSpeed.Fast, Direction.horizontal, 1, 0, 4);
        this.right = new Animation(animationData, AnimationSpeed.Fast, Direction.horizontal, 0, 0, 4);
        this.still = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 1, 0, 1);
        this.lightening = new Animation(animationData, AnimationSpeed.Slow, Direction.horizontal, 2, 0, 3);
        this.wet = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 3, 0, 4);

        this.width = animationData.GetScreenWidht();
        this.height = animationData.GetScreenSizeHeight();

        this.bucketState = BucketState.NORMAL;
        this.speed = 4;
    }

    public SetDirection(direction: number) { this.direction = direction; }
    public GetX() { return this.x; }
    public GetX2() { return this.x + this.width; } // TOTO
    public GetY() { return this.y; }
    public GetY2() { return this.y2; } // TOTO

    public SetXY() {
        this.x = System.CanvasWidth / 2 - (this.width / 2);
        this.y = System.CanvasHeight - this.height;
        this.y2 = this.y + this.height;
    }

    public Act() {
        this.Move();
        this.Draw();
    }

    private Draw() {

        if (this.bucketState == BucketState.FROZEN) {
            this.lightening.DrawLoop(this.x, this.y);
        }
        else if (this.bucketState == BucketState.WET) {
            if (this.wet.DrawOnce(this.x, this.y))
                this.bucketState = BucketState.NORMAL;
        }
        else if (this.direction == -1) {
            this.left.DrawLoop(this.x, this.y);
        }
        else if (this.direction == 1) {
            this.right.DrawLoop(this.x, this.y);
        }
        else { this.still.DrawLoop(this.x, this.y); }
    }

    public Wetten() {
        if (this.bucketState != BucketState.FROZEN)
            this.bucketState = BucketState.WET;
    }

    public Freeze() {
        this.bucketState = BucketState.FROZEN;

        clearInterval(this.freezeTimer);
        this.freezeTimer = setTimeout(() => this.Unfreeze(), 3000);
    }

    private Unfreeze() {
        clearTimeout(this.freezeTimer);
        this.bucketState = BucketState.NORMAL;
    }

    private Move() {
        if (this.bucketState == BucketState.FROZEN)
            return;

        if (this.direction == 1) { this.MoveRight(); }
        else if (this.direction == -1) { this.MoveLeft(); }
    }

    private MoveRight() {
        if (this.x + this.width < System.CanvasWidth) {
            this.x = this.x + this.speed;
        }
        else { this.direction = 0; }
    }

    private MoveLeft() {
        if (this.x > 0) {
            this.x = this.x - this.speed;
        }
        else { this.direction = 0; }
    }
}

class Drop {
    private x: number;
    private y: number;
    private speed: number;
    private direction: number;
    private alive: boolean;
    private animation: Animation;
    private animationRainBig: Animation;
    private animationLightning: Animation;
    private currentAnimation: Animation;
    private type: CookieType;

    constructor(animationData: AnimationData) {

        this.animation = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 0, 0, 4);
        this.animationRainBig = new Animation(animationData, AnimationSpeed.Fast, Direction.horizontal, 2, 0, 4);
        this.animationLightning = new Animation(animationData, AnimationSpeed.Fast, Direction.horizontal, 1, 0, 4);
        this.animationLightning.SetContext(Minigame.mid3Context);
        this.alive = false;
    }

    public Spawn(x: number, y: number, speed: number, typeCookie:CookieType, direction:number) {

        this.type = typeCookie;
        this.x = x;
        this.y = y;

        if (typeCookie == CookieType.RAIN) { this.currentAnimation = this.animation; }
        else if (typeCookie == CookieType.FIRE) {
            this.x +=  this.animation.GetAnimationData().GetScreenWidht() / 2;
            this.y -= 40;
            this.currentAnimation = this.animation;
        }

        else if (typeCookie == CookieType.BIGRAIN) { this.currentAnimation = this.animationRainBig; }
        else { this.currentAnimation = this.animationLightning; }

        if (this.x + this.currentAnimation.GetAnimationData().GetScreenWidht() > System.CanvasWidth) {
            this.x = this.x - this.currentAnimation.GetAnimationData().GetScreenWidht();
        }

        this.direction = direction;
        this.alive = true;
        this.speed = speed;
    }

    public Reset() {
        this.x = 0;
        this.alive = false;
    }

    public Draw() {
        if (this.y > System.CanvasHeight || this.y < - this.currentAnimation.GetAnimationData().GetScreenSizeHeight()) {
            this.alive = false;
            return false;
        }

        //if (this.y % 20 == 0 && this.speed < 4)
        //    this.speed++;

        this.x += this.direction; 
        this.y += this.speed;

        if (this.GetX2() > System.CanvasWidth)
            this.direction = this.direction * -1;
        else if (this.x < 0)
            this.direction = this.direction * -1;;

        this.currentAnimation.DrawLoop(this.x, this.y);

        return true;  // still alive
    }

    public Remove() {
        this.currentAnimation.Clear();
        this.alive = false;
    }

    public GetTypes(): CookieType { return this.type; }
    public IsAlive() { return this.alive; }
    public GetX() { return this.x; }
    public GetY() { return this.y; }
    public GetWidth() { return this.currentAnimation.GetAnimationData().GetScreenWidht(); }
    public GetHeight() { return this.currentAnimation.GetAnimationData().GetScreenSizeHeight(); }
    public GetX2() {  return this.x + this.currentAnimation.GetAnimationData().GetScreenWidht(); }
    public GetY2() {  return this.GetY() + this.GetHeight(); }
}

class DropPool {
    private drops: Drop[];
    private maxSize: number = 10;
    private catcher: RainingDrops;
    private cloud1: Clouds;
    private cloud2: Clouds;
    private bucket: Frog;
    private bee: Bee;

    public Shoot() {
        this.drops[this.maxSize].Spawn(this.bucket.GetX(), this.bucket.GetY(), -3, CookieType.FIRE, 0);
        this.drops.unshift(this.drops.pop());
    }

    constructor(canvas:CanvasRenderingContext2D, canvas2:CanvasRenderingContext2D, catcher: RainingDrops, bucket:Frog, bee:Bee) {
        this.bucket = bucket;
        this.bee = bee;
        this.cloud1 = new Clouds(images.clouds1, 0, -60, canvas2);
        this.cloud2 = new Clouds(images.clouds2, System.CanvasWidth, -30, canvas2);
        this.catcher = catcher;
        this.drops = new Array(this.maxSize);
        var animationData: AnimationData = new AnimationData(images.drop, canvas, 4, 3);

        for (var i = 0; i <= this.maxSize; i++) {
            this.drops[i] = new Drop(animationData);
        }
    }

    public Reset() {
        for (var i = 0; i < this.drops.length; i++) {
            this.drops[i].Reset();
        }
    }

    private ran: number = Math.random();

    public Spawn() {
        if (this.drops[this.maxSize].IsAlive()) return false;

        var direction: number = (Math.random() * 4 - 2);
        var spawned: boolean = false;

        var speed = 2;

        this.ran = Math.random();

        var x = Math.round(System.CanvasWidth * this.ran);

        if (this.ran < 0.05) {
            this.drops[this.maxSize].Spawn(x, 0, speed, CookieType.BIGRAIN, direction);
            spawned = true;
            this.drops.unshift(this.drops.pop());

        }
        else if (this.ran < 0.6) {
            this.drops[this.maxSize].Spawn(x, 0, speed, CookieType.RAIN, direction);
            spawned = true;
            this.drops.unshift(this.drops.pop());

        }
        else if (!this.bee.IsHit()) {
            this.drops[this.maxSize].Spawn(this.bee.GetX(), this.bee.GetY(), speed, CookieType.LIGHTNING, direction);
            this.drops.unshift(this.drops.pop());
        }
        else {
            this.drops[this.maxSize].Spawn(x, 0, speed, CookieType.RAIN, direction);
            spawned = true;
            this.drops.unshift(this.drops.pop());
        }

        return spawned;
    }

    public Draw() {
        this.cloud1.Act();
        this.cloud2.Act();

        for (var i = 0; i <= this.maxSize; i++) {
            if (!this.drops[i].IsAlive())
                break;
            if (!this.drops[i].Draw()) { // missed
                //if (this.drops[i].GetTypes() == CookieType.LIGHTNING) {
                //    this.catcher.Miss();
                //}
                this.RemoveCookie(i);
            }
            else if (this.drops[i].GetTypes() == CookieType.FIRE && this.CheckCollision2(this.drops[i])) {
                this.bee.Hit();
                this.RemoveCookie(i);
            }
            else if (this.drops[i].GetTypes() == CookieType.LIGHTNING && this.CheckCollision3(this.drops[i])) {
                this.catcher.Miss();
                this.bucket.Freeze();
                this.RemoveCookie(i);
            }
            else if (this.CheckCollision(this.drops[i]) && this.drops[i].GetTypes() != CookieType.FIRE && this.drops[i].GetTypes() != CookieType.LIGHTNING) {
                if (this.drops[i].GetTypes() == CookieType.RAIN) {
                    this.bucket.Wetten();
                    this.catcher.Hit(1);
                }
                else if (this.drops[i].GetTypes() == CookieType.BIGRAIN) {
                    this.bucket.Wetten();
                    this.catcher.Hit(5);
                }
                //else if (this.drops[i].GetTypes() == CookieType.LIGHTNING) {
                //    this.catcher.Miss();
                //    this.bucket.Freeze();
                //}
                this.RemoveCookie(i);
            }
        }
    }
    private CheckCollision3(cookie: Drop) {
        //if (!cookie.IsAlive()) return false;

        return (cookie.GetX2() >= this.bucket.GetX() + 25 && cookie.GetX() <= this.bucket.GetX2() - 25 && cookie.GetY2() >= this.bucket.GetY() + 10 && cookie.GetY() <= this.bucket.GetY2() );
    }
    private CheckCollision2(cookie: Drop) {
        //if (!cookie.IsAlive()) return false;
        return (cookie.GetX2() >= this.bee.GetX() && cookie.GetX() <= this.bee.GetX2() && cookie.GetY2() >= this.bee.GetY() && cookie.GetY() <= this.bee.GetY2());
    }
    private CheckCollision(cookie: Drop) {
        //if (!cookie.IsAlive()) return false;

        return (cookie.GetX2() >= this.bucket.GetX() && cookie.GetX() <= this.bucket.GetX2() && cookie.GetY2() >= this.bucket.GetY() && cookie.GetY() <= this.bucket.GetY2());
    }

    private RemoveCookie(i: number) {
        this.drops[i].Remove();
        this.drops.push(this.drops.splice(i, 1)[0]);
    }
}