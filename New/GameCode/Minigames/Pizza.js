var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PizzaGame = (function (_super) {
    __extends(PizzaGame, _super);
    function PizzaGame() {
        _super.call(this);
        this.numberOfSlides = 5;
        this.down = false;
        this.moveCounter = 0;
        this.moveCounterTop = 10;

        this.backgroundImage = images.circuit;

        jumpat = Math.floor((System.CanvasWidth / 100) * 60);
        this.spacing = Math.round(System.CanvasHeight / this.numberOfSlides);
        this.id = 3;

        this.finalLevel = 10;
        this.allowedMisses = 5;

        this.CreateBakers();
        this.pizzaPool = new PizzaPool(this.spacing, this, this.numberOfSlides);
    }
    PizzaGame.prototype.Start = function () {
        _super.prototype.Start.call(this, 200, 65);
        System.GetGesture().Subscribe(this);

        this.toSpawnPerLevel = 10;

        this.pizzaPool.Reset();
        this.ResetBakers();
        Minigame.minigameHelper.Reset(this.allowedMisses, true);
    };

    PizzaGame.prototype.CreateBakers = function () {
        var animationData = new AnimationData(images.plate, Minigame.mid1Context, 1, 1);
        PizzaGame.baker1 = new Baker(animationData, this.spacing);
        PizzaGame.baker2 = new Baker(animationData, this.spacing);
    };

    PizzaGame.prototype.ResetBakers = function () {
        var x1 = (System.CanvasWidth / 5);
        var x2 = System.CanvasWidth - (System.CanvasWidth * 2 / 8);
        var y = this.spacing * 2;

        PizzaGame.baker1.Set(x1, y);
        PizzaGame.baker2.Set(x2, y);
    };

    PizzaGame.prototype.Miss = function () {
        _super.prototype.SpawnHandled.call(this);
        this.missedTotal++;
        Minigame.minigameHelper.UpdateMissedBox();
    };

    PizzaGame.prototype.Hit = function (points) {
        _super.prototype.SpawnHandled.call(this);
        this.score += points;
        Minigame.minigameHelper.WritePoints(this.score);
    };

    PizzaGame.prototype.ClickUp = function () {
        this.moveCounter = 0;
        this.down = false;
    };

    PizzaGame.prototype.Click = function (x, y) {
        this.moveCounter = this.moveCounterTop;
        this.x = x;
        this.y = y;
        this.down = true;
    };

    PizzaGame.prototype.MovePad = function () {
        this.moveCounter++;

        if (this.moveCounter < this.moveCounterTop)
            return;

        this.moveCounter = 0;

        if (this.x < (System.GetGW() / 2)) {
            if (this.y < (System.GetGH() / 2))
                PizzaGame.baker1.MoveUp();
            else
                PizzaGame.baker1.MoveDown();
        } else {
            if (this.y < (System.GetGH() / 2))
                PizzaGame.baker2.MoveUp();
            else
                PizzaGame.baker2.MoveDown();
        }
    };

    PizzaGame.prototype.Act = function () {
        this.SpawnIfReady();

        if (this.down)
            this.MovePad();
        this.pizzaPool.Act();

        if (this.missedTotal == this.allowedMisses)
            return true;

        return this.gameOver;
    };

    PizzaGame.prototype.Spawn = function () {
        if (this.pizzaPool.Spawn()) {
            _super.prototype.Spawn.call(this);
        }
    };

    PizzaGame.prototype.GetScore = function () {
        return this.score;
    };

    PizzaGame.prototype.GetId = function () {
        return this.id;
    };

    PizzaGame.GetBaker1 = function () {
        return PizzaGame.baker1;
    };
    PizzaGame.GetBaker2 = function () {
        return PizzaGame.baker2;
    };
    return PizzaGame;
})(SuperMini);

var Baker = (function () {
    function Baker(animationData, spacing) {
        this.spacing = spacing;
        animationData.SetScreenSize(this.spacing, System.CanvasWidth / 20);
        this.animation = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 0, 0, 1);
    }
    Baker.prototype.GetX2 = function () {
        return this.animation.GetAnimationData().GetScreenWidht() + this.x;
    };
    Baker.prototype.GetX1 = function () {
        return this.x;
    };
    Baker.prototype.GetY = function () {
        return this.y;
    };

    Baker.prototype.Set = function (x, y) {
        this.x = x;
        this.y = y;

        this.Draw();
    };

    Baker.prototype.MoveUp = function () {
        if (this.y - this.spacing < 0)
            return;

        this.y -= this.spacing;
        this.Draw();
    };

    Baker.prototype.MoveDown = function () {
        if (this.y + this.spacing >= System.CanvasHeight)
            return;

        this.y += this.spacing;
        this.Draw();
    };

    Baker.prototype.Draw = function () {
        this.animation.DrawLoop(this.x, this.y);
    };
    return Baker;
})();

var PizzaPool = (function () {
    function PizzaPool(spacing, pizzaGame, ss) {
        this.game = pizzaGame;
        this.numberOfSlides = ss;
        this.spacing = spacing;
        this.maxNumberOfPizze = 10;
        this.pizze = new Array(this.maxNumberOfPizze);
        this.CreatePizze();
    }
    PizzaPool.prototype.Reset = function () {
        for (var i = 0; i < this.pizze.length; i++) {
            this.pizze[i].Reset();
        }
    };

    PizzaPool.prototype.CreatePizze = function () {
        var animationData = new AnimationData(images.cookie, Minigame.mid2Context, 4, 2);

        for (var i = 0; i <= this.maxNumberOfPizze; i++) {
            this.pizze[i] = new Pizza(animationData, this.spacing);
        }
    };

    PizzaPool.prototype.Spawn = function () {
        var speed = 1;

        var r = Math.random();
        var t = 1 /* SMALL */;

        if (r < 0.05)
            t = 0 /* BIG */;

        var row = Math.round(r * 10) % this.numberOfSlides;

        var jump = (row < this.numberOfSlides - 1 && Math.random() < 0.1);

        if (!this.pizze[this.maxNumberOfPizze].IsSliding()) {
            this.pizze[this.maxNumberOfPizze].Spawn(row, speed, t, jump);
            this.pizze.unshift(this.pizze.pop());
            return true;
        }

        return false;
    };

    PizzaPool.prototype.Act = function () {
        for (var i = 0; i < this.pizze.length; i++) {
            if (!this.pizze[i].IsSliding()) {
                break;
            }

            this.pizze[i].Draw();
            var pizzaState = this.pizze[i].Move();

            if (pizzaState == 3 /* MISS */) {
                this.pizze.push(this.pizze.splice(i, 1)[0]);
                this.game.Miss();
            } else if (pizzaState == 2 /* HIT */) {
                if (this.pizze[i].GetType() == 0 /* BIG */)
                    this.game.Hit(5);
                else
                    (this.game.Hit(1));
            }
        }
    };
    return PizzaPool;
})();

var jumpat;

var Pizza = (function () {
    function Pizza(animationData, spacing) {
        this.moveCounter = 0;
        this.moveCounterTop = 1;
        this.jumped = false;
        Pizza.spacing = spacing;
        this.animationSmall = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 0, 0, 4);
        this.animationbig = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 1, 0, 4);

        this.OffsetY = animationData.GetScreenSizeHeight() / 2;
        this.pizzaState = 0 /* NONE */;
    }
    Pizza.prototype.Reset = function () {
        this.x = 0;
        this.pizzaState = 0 /* NONE */;
    };

    Pizza.prototype.Spawn = function (row, speed, type, jump) {
        this.jumped = false;
        this.speed = speed;

        this.type = type;
        if (type == 0 /* BIG */)
            this.animation = this.animationbig;
        else
            this.animation = this.animationSmall;

        this.row = row;
        this.jump = jump;

        this.pizzaState = 1 /* SLIDING */;
        this.x = -this.animation.GetAnimationData().GetScreenWidht();
        this.y = row * Pizza.spacing;

        this.drawY = this.y + (Pizza.spacing / 2) - this.OffsetY;
    };

    Pizza.prototype.GetType = function () {
        return this.type;
    };

    Pizza.prototype.IsSliding = function () {
        return (this.pizzaState == 1 /* SLIDING */);
    };

    Pizza.prototype.Move = function () {
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
            this.pizzaState = 0 /* NONE */;
            return 2 /* HIT */;
        } else if (this.CheckCollision())
            return 3 /* MISS */;

        return 0 /* NONE */;
    };

    Pizza.prototype.CheckCollision = function () {
        var baker1 = PizzaGame.GetBaker1();
        var baker2 = PizzaGame.GetBaker2();
        var x2 = this.animation.GetAnimationData().GetSpriteWidth() + this.x;

        if (baker1.GetX1() <= x2 && baker1.GetX2() >= this.x && baker1.GetY() == this.y) {
            this.x = baker1.GetX2();
        } else if (baker2.GetX1() <= x2 && baker2.GetX2() >= this.x && baker2.GetY() == this.y) {
            this.x = baker2.GetX2();
        } else if (x2 >= baker1.GetX1() && baker1.GetX2() > this.x && this.y != baker1.GetY()) {
            this.pizzaState = 0 /* NONE */;
            this.animation.Clear();
            return true;
        } else if (x2 >= baker2.GetX1() && baker2.GetX2() > this.x && this.y != baker2.GetY()) {
            this.pizzaState = 0 /* NONE */;
            this.animation.Clear();
            return true;
        }

        return false;
    };

    Pizza.prototype.Draw = function () {
        this.animation.DrawLoop(this.x, this.drawY);
    };
    return Pizza;
})();
