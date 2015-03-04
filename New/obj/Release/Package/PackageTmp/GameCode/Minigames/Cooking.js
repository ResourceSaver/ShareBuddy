var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Cooking = (function (_super) {
    __extends(Cooking, _super);
    function Cooking() {
        _super.call(this);
        this.cookTime = 5;

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
    Cooking.prototype.Start = function () {
        _super.prototype.Start.call(this, 250, 80);

        this.toSpawnPerLevel = 5;

        System.GetGesture().Subscribe(this);
        Minigame.minigameHelper.Reset(this.allowedMisses, true);

        for (var i = 0; i < this.panSize; i++) {
            for (var j = 0; j < this.panSize; j++) {
                this.foods[i][j].Reset();
            }
        }
    };

    Cooking.prototype.CreateFoods = function () {
        var animationData = new AnimationData(images.eggs, Minigame.mid1Context, 4, 2);

        for (var i = 0; i < this.panSize; i++) {
            var sub = new Array(this.panSize);

            for (var j = 0; j < this.panSize; j++) {
                var food = new Food(animationData, Minigame.mid2Context);
                sub[j] = food;
            }

            this.foods[i] = sub;
        }

        this.foods[0][0].SetType(0 /* DUMMY */);
        this.foods[2][0].SetType(0 /* DUMMY */);
        this.foods[0][2].SetType(0 /* DUMMY */);
        this.foods[2][2].SetType(0 /* DUMMY */);
    };

    Cooking.prototype.Click = function (x, y) {
        x = x - 66;
        y = y - 2;
        var x1 = Math.floor((x / (System.GetGW() / (this.panSize + 1))));
        var y1 = Math.floor((y / (System.GetGH() / this.panSize)));

        if (x1 >= this.panSize || x1 < 0 || y1 >= this.panSize || y1 < 0)
            return;

        var point = this.foods[x1][y1].Click();

        if (point >= 0) {
            this.score += point;
            Minigame.minigameHelper.WritePoints(this.score);
            Minigame.minigameHelper.WriteTempText(point);
            _super.prototype.SpawnHandled.call(this);
        }
    };

    Cooking.prototype.Act = function () {
        this.SpawnIfReady();
        this.Draw();
        if (this.missedTotal == this.allowedMisses)
            return true;
        return this.gameOver;
    };

    Cooking.prototype.Spawn = function () {
        for (var i = 0; i < this.panSize; i++) {
            for (var j = 0; j < this.panSize; j++) {
                if (this.foods[i][j].GetType() == 1 /* NONE */) {
                    var x = (i * this.spacingX) + 66 + (this.spacingX / 2);
                    var y = (j * this.spacingY) + 2 + (this.spacingY / 2);
                    this.foods[i][j].Spawn(4 /* MEATBALL */, this.cookTime, x, y);
                    _super.prototype.Spawn.call(this);
                    return;
                }
            }
        }
    };

    Cooking.prototype.Draw = function () {
        for (var i = 0; i < this.panSize; i++) {
            for (var j = 0; j < this.panSize; j++) {
                var food = this.foods[i][j];

                if (food.Draw()) {
                    _super.prototype.SpawnHandled.call(this);
                    Minigame.minigameHelper.UpdateMissedBox();
                    this.missedTotal++;
                }
            }
        }
    };

    Cooking.prototype.GetScore = function () {
        return this.score;
    };

    Cooking.prototype.GetId = function () {
        return this.id;
    };

    Cooking.prototype.ClickUp = function () {
    };
    return Cooking;
})(SuperMini);

var Food = (function () {
    function Food(animationData, canvas) {
        this.foodType = 1 /* NONE */;
        this.animation = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 0, 0, 4);
        this.burned = new Animation(animationData, 5 /* Fast */, 0 /* horizontal */, 1, 0, 4);

        var animationData = new AnimationData(images.eggs, canvas, 4, 2);
        this.clickAni = new Animation(animationData, 5 /* Fast */, 0 /* horizontal */, 0, 0, 4);
    }
    Food.prototype.Reset = function () {
        if (this.foodType != 0 /* DUMMY */) {
            this.foodType = 1 /* NONE */;
            clearInterval(this.timer);
        }
    };

    Food.prototype.Draw = function () {
        if (this.foodType == 2 /* CLICKED */) {
            this.y -= 40;
            this.clickAni.DrawLoop(this.x, this.y);
        } else if (this.foodType == 4 /* MEATBALL */)
            this.animation.DrawLoop(this.x, this.y);
        else if (this.foodType == 3 /* BURNED */) {
            var b = this.burned.DrawOnce(this.x, this.y);
            if (b) {
                this.RemoveMe();
                return true;
            }
        }

        if (this.y < -this.animation.GetAnimationData().GetScreenSizeHeight()) {
            this.foodType = 1 /* NONE */;
        }

        return false;
    };

    Food.prototype.SetType = function (foodType) {
        this.foodType = foodType;
    };

    Food.prototype.GetType = function () {
        return this.foodType;
    };

    Food.prototype.Spawn = function (type, cookTime, x, y) {
        var _this = this;
        this.x = x - (this.animation.GetAnimationData().GetScreenWidht() / 2);
        this.y = y - (this.animation.GetAnimationData().GetScreenSizeHeight() / 2);

        this.points = 0;
        this.cookTime = cookTime;
        this.cookCounter = cookTime;
        this.foodType = type;

        this.timer = setInterval(function () {
            return _this.Tik();
        }, 1000);
    };

    Food.prototype.Click = function () {
        if (this.foodType == 4 /* MEATBALL */) {
            clearInterval(this.timer);
            this.animation.Clear();
            this.foodType = 2 /* CLICKED */;
            return this.points;
        } else
            return -1;
    };

    Food.prototype.Tik = function () {
        this.cookCounter--;
        this.points++;

        if (this.cookCounter < 0) {
            this.foodType = 3 /* BURNED */;
            clearInterval(this.timer);
            return;
        }
    };

    Food.prototype.RemoveMe = function () {
        this.burned.Clear();
        this.foodType = 1 /* NONE */;
    };
    return Food;
})();

var FoodType;
(function (FoodType) {
    FoodType[FoodType["DUMMY"] = 0] = "DUMMY";
    FoodType[FoodType["NONE"] = 1] = "NONE";
    FoodType[FoodType["CLICKED"] = 2] = "CLICKED";
    FoodType[FoodType["BURNED"] = 3] = "BURNED";
    FoodType[FoodType["MEATBALL"] = 4] = "MEATBALL";
})(FoodType || (FoodType = {}));
