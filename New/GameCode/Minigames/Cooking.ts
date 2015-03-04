class Cooking extends SuperMini implements IMiniGame {
    private foods: Food[][];
    private panSize: number;
    private spacingX: number;
    private spacingY: number;
    private cookTime: number = 5;

    private allowedMisses: number;

    public constructor() {
        super();

        this.backgroundImage = images.pan;
        this.id = 1;
        this.panSize = 3;

        this.foods = new Array(this.panSize);
        this.CreateFoods();

        this.spacingX = System.CanvasWidth / (this.panSize + 1);
        this.spacingY = System.CanvasHeight / (this.panSize);

        this.allowedMisses = 5;
        this.finalLevel = 5;
    }

    public Start() {
        super.Start(250, 80);

        this.toSpawnPerLevel = 5;

        System.GetGesture().Subscribe(this);
        Minigame.minigameHelper.Reset(this.allowedMisses, true);

        // RESET

        for (var i = 0; i < this.panSize; i++) {
            for (var j = 0; j < this.panSize; j++) {
                this.foods[i][j].Reset();
            }
        }

    }

    private CreateFoods() {
        var animationData: AnimationData = new AnimationData(images.eggs, Minigame.mid1Context, 4, 2);

        for (var i = 0; i < this.panSize; i++) {
            var sub: Food[] = new Array(this.panSize);

            for (var j = 0; j < this.panSize; j++) {
                var food = new Food(animationData, Minigame.mid2Context);
                sub[j] = food;
            }

            this.foods[i] = sub;
        }

        this.foods[0][0].SetType(FoodType.DUMMY);
        this.foods[2][0].SetType(FoodType.DUMMY);
        this.foods[0][2].SetType(FoodType.DUMMY);
        this.foods[2][2].SetType(FoodType.DUMMY);
    }

    public Click(x: number, y: number) {
        x = x - 66;
        y = y - 2;
        var x1 = Math.floor((x / (System.GetGW() / (this.panSize  + 1))));
        var y1 = Math.floor((y / (System.GetGH() / this.panSize)));

        if (x1 >= this.panSize || x1 < 0 || y1 >= this.panSize || y1 < 0)
            return;


        var point = this.foods[x1][y1].Click();

        if (point >= 0) {
            this.score += point;
            Minigame.minigameHelper.WritePoints(this.score);
            Minigame.minigameHelper.WriteTempText(point);
            super.SpawnHandled();
        }
    }

    public Act() {
        this.SpawnIfReady();
        this.Draw();
        if (this.missedTotal == this.allowedMisses) return true;
        return this.gameOver;
    }
      
    public Spawn() {
        for (var i = 0; i < this.panSize; i++) {
            for (var j = 0; j < this.panSize; j++) {
                if (this.foods[i][j].GetType() == FoodType.NONE) {
                    var x = (i * this.spacingX) + 66 + (this.spacingX / 2);
                    var y = (j * this.spacingY) + 2 + (this.spacingY / 2);
                    this.foods[i][j].Spawn(FoodType.MEATBALL, this.cookTime, x, y);
                    super.Spawn();
                    return;
                }
            }
        }
    }
    
    private Draw() {
        for (var i = 0; i < this.panSize; i++) {
            for (var j = 0; j < this.panSize; j++) {
                var food: Food = this.foods[i][j];

                if (food.Draw()) {
                    super.SpawnHandled();
                    Minigame.minigameHelper.UpdateMissedBox();
                    this.missedTotal++;
                }
            }
        }
    }

    public GetScore() { return this.score; }

    public GetId() { return this.id; }

    public ClickUp() { }
} 

class Food {
    private foodType: FoodType;
    private cookTime: number;
    private cookCounter: number;
    private animation: Animation;
    private burned: Animation;
    private clickAni: Animation;
    private timer;
    private points: number;
    private x: number;
    private y: number;

    public constructor(animationData: AnimationData, canvas:CanvasRenderingContext2D) {
        this.foodType = FoodType.NONE;
        this.animation = new Animation(animationData, AnimationSpeed.Medium, Direction.horizontal, 0, 0, 4);
        this.burned = new Animation(animationData, AnimationSpeed.Fast, Direction.horizontal, 1, 0, 4);

        var animationData = new AnimationData(images.eggs, canvas, 4, 2);
        this.clickAni = new Animation(animationData, AnimationSpeed.Fast, Direction.horizontal, 0, 0, 4);
    }

    public Reset() {
        if (this.foodType != FoodType.DUMMY) {
            this.foodType = FoodType.NONE;
            clearInterval(this.timer);
        } 
    }
        
    public Draw() {
        if (this.foodType == FoodType.CLICKED) {
            this.y -= 40;
            this.clickAni.DrawLoop(this.x, this.y);
        }
        else if (this.foodType == FoodType.MEATBALL)
            this.animation.DrawLoop(this.x, this.y);
        else if (this.foodType == FoodType.BURNED) {
            var b: boolean = this.burned.DrawOnce(this.x, this.y);
            if (b) {
                this.RemoveMe();
                return true;
            }
        }

        if (this.y < - this.animation.GetAnimationData().GetScreenSizeHeight()) {
            this.foodType = FoodType.NONE;
        }

        return false;
    }

    public SetType(foodType: FoodType) {
        this.foodType = foodType;
    }

    public GetType() {
        return this.foodType;
    }

    public Spawn(type: FoodType, cookTime: number, x: number, y: number) {
        this.x = x - (this.animation.GetAnimationData().GetScreenWidht() / 2);
        this.y = y - (this.animation.GetAnimationData().GetScreenSizeHeight() / 2);

        this.points = 0;
        this.cookTime = cookTime;
        this.cookCounter = cookTime;
        this.foodType = type;

        this.timer = setInterval(() => this.Tik(), 1000);
    }

    public Click() {
        if (this.foodType == FoodType.MEATBALL) {
            clearInterval(this.timer);
            this.animation.Clear();
            this.foodType = FoodType.CLICKED;
            return this.points;
        }
        else return -1;
    }

    private Tik() {

        this.cookCounter--;
        this.points++;

        if (this.cookCounter < 0) {
            this.foodType = FoodType.BURNED;
            clearInterval(this.timer);
            return;
        }
    }

    private RemoveMe() {
        this.burned.Clear();
        this.foodType = FoodType.NONE;
    }
}

enum FoodType {
    DUMMY,
    NONE,
    CLICKED,
    BURNED,
    MEATBALL
}