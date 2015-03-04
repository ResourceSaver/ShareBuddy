var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RainingDrops = (function (_super) {
    __extends(RainingDrops, _super);
    function RainingDrops() {
        _super.call(this);
        this.backgroundImage = images.rainbg;
        this.id = 2;

        this.finalLevel = 10;
        this.allowedMisses = 5;

        this.bucket = new Frog(Minigame.mid1Context);
        this.bee = new Bee(this.bucket);
        this.cookies = new DropPool(Minigame.mid1Context, Minigame.mid2Context, this, this.bucket, this.bee);
    }
    RainingDrops.prototype.Start = function () {
        _super.prototype.Start.call(this, 50, 30);
        System.GetGesture().Subscribe(this);
        Minigame.minigameHelper.SetButtonLocation(System.CanvasWidth - 110, 5, "Shoot");
        this.toSpawnPerLevel = 10;
        this.cookies.Reset();
        this.bucket.SetDirection(0);
        this.bucket.SetXY();

        Minigame.minigameHelper.Reset(this.allowedMisses, true);
    };

    RainingDrops.prototype.Act = function () {
        this.SpawnIfReady();
        this.bucket.Act();
        this.cookies.Draw();
        this.bee.Act();

        if (this.bucket.GetX2() - 28 > this.bee.GetX() && this.bucket.GetX() + 28 < this.bee.GetX2() && this.bee.GetY2() - 15 > this.bucket.GetY()) {
            this.bucket.Freeze();
            this.gameOver = true;
        }

        if (this.missedTotal == this.allowedMisses) {
            this.bucket.Freeze();
            this.gameOver = true;
        }

        return this.gameOver;
    };

    RainingDrops.prototype.Spawn = function () {
        if (this.cookies.Spawn()) {
            _super.prototype.Spawn.call(this);
        }
    };

    RainingDrops.prototype.Hit = function (points) {
        this.score += points;
        Minigame.minigameHelper.WritePoints(this.score);
        _super.prototype.SpawnHandled.call(this);
        if (this.score >= 3) {
            Minigame.minigameHelper.ShowButton();
        }
    };

    RainingDrops.prototype.Miss = function () {
        this.missedTotal++;
        Minigame.minigameHelper.UpdateMissedBox();
    };

    RainingDrops.prototype.Click = function (x, y) {
        if (this.score >= 3 && x > System.CanvasWidth - 110 && y < 70) {
            this.score -= 3;
            Minigame.minigameHelper.WritePoints(this.score);
            this.cookies.Shoot();

            if (this.score < 3)
                Minigame.minigameHelper.HideButton();
        } else if (x < System.GetGW() / 2)
            this.bucket.SetDirection(-1);
        else
            this.bucket.SetDirection(1);
    };

    RainingDrops.prototype.GetId = function () {
        return this.id;
    };

    RainingDrops.prototype.GetScore = function () {
        return this.score;
    };

    RainingDrops.prototype.ClickUp = function () {
    };
    return RainingDrops;
})(SuperMini);

var Bee = (function () {
    function Bee(bucket) {
        this.hitCounter = 0;
        this.moveSpeed = 0;
        this.moveCounter = 0;
        this.x = Math.round(System.CanvasWidth / 2);
        this.y = 80;
        this.directionX = 1;
        this.directionY = -1;
        this.hit = false;

        this.animationData = new AnimationData(images.bee, Minigame.textContext, 4, 1);
        this.animation = new Animation(this.animationData, 10 /* Medium */, 0 /* horizontal */, 0, 0, 4);
    }
    Bee.prototype.GetX = function () {
        return this.x;
    };

    Bee.prototype.GetY2 = function () {
        return this.y + this.animationData.GetScreenSizeHeight();
    };

    Bee.prototype.GetX2 = function () {
        return this.x + this.animationData.GetScreenWidht();
    };

    Bee.prototype.GetY = function () {
        return this.y;
    };

    Bee.prototype.Move = function () {
        if (this.hit) {
            this.hitCounter++;
            this.x--;
            this.y--;

            if (this.hitCounter > 300) {
                this.hit = false;
                this.hitCounter = 0;
            }
        } else {
            this.x += this.directionX;
            this.y += this.directionY;

            if (Math.random() > 0.95) {
                this.directionX = this.directionX * -1;
                return;
            } else if (Math.random() < 0.05) {
                this.directionY = this.directionY * -1;
                return;
            }
        }

        if (this.x + this.animationData.GetScreenWidht() >= System.CanvasWidth) {
            this.x = System.CanvasWidth - this.animationData.GetScreenWidht();
        } else if (this.x <= 0)
            this.x = 0;
        if (this.y + this.animationData.GetScreenSizeHeight() >= System.CanvasHeight)
            this.y = System.CanvasHeight - this.animationData.GetScreenSizeHeight();
        else if (this.y < 50)
            this.y = 50;
    };

    Bee.prototype.Draw = function () {
        this.animation.DrawLoop(this.x, this.y);
    };

    Bee.prototype.Hit = function () {
        this.hitCounter = 0;
        this.hit = true;
    };

    Bee.prototype.IsHit = function () {
        return this.hit;
    };

    Bee.prototype.Act = function () {
        this.moveCounter++;
        if (this.moveCounter < this.moveSpeed)
            return;
        this.moveCounter = 0;

        this.Move();
        this.Draw();
    };
    return Bee;
})();

var Clouds = (function () {
    function Clouds(image, x, y, canvas) {
        this.drawCounter2 = 0;
        this.x = x;
        this.y = y;
        this.picture = new SingleImage(canvas, image, image.height, image.width);
        this.drawCount = 0;
        Clouds.drawWhen = 4;
    }
    Clouds.prototype.Act = function () {
        this.drawCount++;
        if (this.drawCount < Clouds.drawWhen)
            return;

        this.drawCount = 0;

        this.drawCounter2++;

        this.Draw();
        this.Move();
    };

    Clouds.prototype.Move = function () {
        if (this.x + this.picture.GetWidth() < 0)
            this.x = System.CanvasWidth;

        this.x -= 1;
    };

    Clouds.prototype.Draw = function () {
        this.picture.Draw(this.x, this.y);
    };
    return Clouds;
})();

var Frog = (function () {
    function Frog(canvas) {
        var animationData = new AnimationData(images.bucket, canvas, 4, 4);
        this.left = new Animation(animationData, 5 /* Fast */, 0 /* horizontal */, 1, 0, 4);
        this.right = new Animation(animationData, 5 /* Fast */, 0 /* horizontal */, 0, 0, 4);
        this.still = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 1, 0, 1);
        this.lightening = new Animation(animationData, 30 /* Slow */, 0 /* horizontal */, 2, 0, 3);
        this.wet = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 3, 0, 4);

        this.width = animationData.GetScreenWidht();
        this.height = animationData.GetScreenSizeHeight();

        this.bucketState = 0 /* NORMAL */;
        this.speed = 4;
    }
    Frog.prototype.SetDirection = function (direction) {
        this.direction = direction;
    };
    Frog.prototype.GetX = function () {
        return this.x;
    };
    Frog.prototype.GetX2 = function () {
        return this.x + this.width;
    };
    Frog.prototype.GetY = function () {
        return this.y;
    };
    Frog.prototype.GetY2 = function () {
        return this.y2;
    };

    Frog.prototype.SetXY = function () {
        this.x = System.CanvasWidth / 2 - (this.width / 2);
        this.y = System.CanvasHeight - this.height;
        this.y2 = this.y + this.height;
    };

    Frog.prototype.Act = function () {
        this.Move();
        this.Draw();
    };

    Frog.prototype.Draw = function () {
        if (this.bucketState == 2 /* FROZEN */) {
            this.lightening.DrawLoop(this.x, this.y);
        } else if (this.bucketState == 1 /* WET */) {
            if (this.wet.DrawOnce(this.x, this.y))
                this.bucketState = 0 /* NORMAL */;
        } else if (this.direction == -1) {
            this.left.DrawLoop(this.x, this.y);
        } else if (this.direction == 1) {
            this.right.DrawLoop(this.x, this.y);
        } else {
            this.still.DrawLoop(this.x, this.y);
        }
    };

    Frog.prototype.Wetten = function () {
        if (this.bucketState != 2 /* FROZEN */)
            this.bucketState = 1 /* WET */;
    };

    Frog.prototype.Freeze = function () {
        var _this = this;
        this.bucketState = 2 /* FROZEN */;

        clearInterval(this.freezeTimer);
        this.freezeTimer = setTimeout(function () {
            return _this.Unfreeze();
        }, 3000);
    };

    Frog.prototype.Unfreeze = function () {
        clearTimeout(this.freezeTimer);
        this.bucketState = 0 /* NORMAL */;
    };

    Frog.prototype.Move = function () {
        if (this.bucketState == 2 /* FROZEN */)
            return;

        if (this.direction == 1) {
            this.MoveRight();
        } else if (this.direction == -1) {
            this.MoveLeft();
        }
    };

    Frog.prototype.MoveRight = function () {
        if (this.x + this.width < System.CanvasWidth) {
            this.x = this.x + this.speed;
        } else {
            this.direction = 0;
        }
    };

    Frog.prototype.MoveLeft = function () {
        if (this.x > 0) {
            this.x = this.x - this.speed;
        } else {
            this.direction = 0;
        }
    };
    return Frog;
})();

var Drop = (function () {
    function Drop(animationData) {
        this.animation = new Animation(animationData, 10 /* Medium */, 0 /* horizontal */, 0, 0, 4);
        this.animationRainBig = new Animation(animationData, 5 /* Fast */, 0 /* horizontal */, 2, 0, 4);
        this.animationLightning = new Animation(animationData, 5 /* Fast */, 0 /* horizontal */, 1, 0, 4);
        this.animationLightning.SetContext(Minigame.mid3Context);
        this.alive = false;
    }
    Drop.prototype.Spawn = function (x, y, speed, typeCookie, direction) {
        this.type = typeCookie;
        this.x = x;
        this.y = y;

        if (typeCookie == 0 /* RAIN */) {
            this.currentAnimation = this.animation;
        } else if (typeCookie == 3 /* FIRE */) {
            this.x += this.animation.GetAnimationData().GetScreenWidht() / 2;
            this.y -= 40;
            this.currentAnimation = this.animation;
        } else if (typeCookie == 1 /* BIGRAIN */) {
            this.currentAnimation = this.animationRainBig;
        } else {
            this.currentAnimation = this.animationLightning;
        }

        if (this.x + this.currentAnimation.GetAnimationData().GetScreenWidht() > System.CanvasWidth) {
            this.x = this.x - this.currentAnimation.GetAnimationData().GetScreenWidht();
        }

        this.direction = direction;
        this.alive = true;
        this.speed = speed;
    };

    Drop.prototype.Reset = function () {
        this.x = 0;
        this.alive = false;
    };

    Drop.prototype.Draw = function () {
        if (this.y > System.CanvasHeight || this.y < -this.currentAnimation.GetAnimationData().GetScreenSizeHeight()) {
            this.alive = false;
            return false;
        }

        this.x += this.direction;
        this.y += this.speed;

        if (this.GetX2() > System.CanvasWidth)
            this.direction = this.direction * -1;
        else if (this.x < 0)
            this.direction = this.direction * -1;
        ;

        this.currentAnimation.DrawLoop(this.x, this.y);

        return true;
    };

    Drop.prototype.Remove = function () {
        this.currentAnimation.Clear();
        this.alive = false;
    };

    Drop.prototype.GetTypes = function () {
        return this.type;
    };
    Drop.prototype.IsAlive = function () {
        return this.alive;
    };
    Drop.prototype.GetX = function () {
        return this.x;
    };
    Drop.prototype.GetY = function () {
        return this.y;
    };
    Drop.prototype.GetWidth = function () {
        return this.currentAnimation.GetAnimationData().GetScreenWidht();
    };
    Drop.prototype.GetHeight = function () {
        return this.currentAnimation.GetAnimationData().GetScreenSizeHeight();
    };
    Drop.prototype.GetX2 = function () {
        return this.x + this.currentAnimation.GetAnimationData().GetScreenWidht();
    };
    Drop.prototype.GetY2 = function () {
        return this.GetY() + this.GetHeight();
    };
    return Drop;
})();

var DropPool = (function () {
    function DropPool(canvas, canvas2, catcher, bucket, bee) {
        this.maxSize = 10;
        this.ran = Math.random();
        this.speed = 2;
        this.bucket = bucket;
        this.bee = bee;
        this.cloud1 = new Clouds(images.clouds1, 0, -60, canvas2);

        this.catcher = catcher;
        this.drops = new Array(this.maxSize);
        var animationData = new AnimationData(images.drop, canvas, 4, 3);

        for (var i = 0; i <= this.maxSize; i++) {
            this.drops[i] = new Drop(animationData);
        }
    }
    DropPool.prototype.Shoot = function () {
        this.drops[this.maxSize].Spawn(this.bucket.GetX(), this.bucket.GetY(), -3, 3 /* FIRE */, 0);
        this.drops.unshift(this.drops.pop());
    };

    DropPool.prototype.Reset = function () {
        for (var i = 0; i < this.drops.length; i++) {
            this.drops[i].Reset();
        }
    };

    DropPool.prototype.Spawn = function () {
        if (this.drops[this.maxSize].IsAlive())
            return false;

        var direction = Math.floor((Math.random() - 0.5) * 10);
        this.ran = Math.random();
        var x = Math.round(System.CanvasWidth * this.ran);

        if (this.ran < 0.05) {
            this.drops[this.maxSize].Spawn(x, 0, this.speed, 1 /* BIGRAIN */, direction);
            this.drops.unshift(this.drops.pop());
            return true;
        } else if (this.ran < 0.5) {
            this.drops[this.maxSize].Spawn(x, 0, this.speed, 0 /* RAIN */, direction);
            this.drops.unshift(this.drops.pop());
            return true;
        } else if (!this.bee.IsHit()) {
            this.drops[this.maxSize].Spawn(this.bee.GetX(), this.bee.GetY(), this.speed, 2 /* LIGHTNING */, direction);
            this.drops.unshift(this.drops.pop());
            return false;
        } else {
            this.drops[this.maxSize].Spawn(x, 0, this.speed, 0 /* RAIN */, direction);
            this.drops.unshift(this.drops.pop());
            return true;
        }

        return false;
    };

    DropPool.prototype.Draw = function () {
        this.cloud1.Act();

        for (var i = 0; i <= this.maxSize; i++) {
            if (!this.drops[i].IsAlive())
                break;
            if (!this.drops[i].Draw()) {
                if (this.drops[i].GetTypes() == 1 /* BIGRAIN */ || this.drops[i].GetTypes() == 0 /* RAIN */)
                    this.catcher.Hit(0);
                this.RemoveCookie(i);
            } else if (this.drops[i].GetTypes() == 3 /* FIRE */ && this.CheckCollision2(this.drops[i])) {
                this.bee.Hit();
                this.RemoveCookie(i);
            } else if (this.drops[i].GetTypes() == 2 /* LIGHTNING */ && this.CheckCollision3(this.drops[i])) {
                this.catcher.Miss();
                this.bucket.Freeze();
                this.RemoveCookie(i);
            } else if (this.CheckCollision(this.drops[i]) && this.drops[i].GetTypes() != 3 /* FIRE */ && this.drops[i].GetTypes() != 2 /* LIGHTNING */) {
                if (this.drops[i].GetTypes() == 0 /* RAIN */) {
                    this.bucket.Wetten();
                    this.catcher.Hit(1);
                } else if (this.drops[i].GetTypes() == 1 /* BIGRAIN */) {
                    this.bucket.Wetten();
                    this.catcher.Hit(5);
                }

                this.RemoveCookie(i);
            }
        }
    };
    DropPool.prototype.CheckCollision3 = function (cookie) {
        return (cookie.GetX2() >= this.bucket.GetX() + 25 && cookie.GetX() <= this.bucket.GetX2() - 25 && cookie.GetY2() >= this.bucket.GetY() + 10 && cookie.GetY() <= this.bucket.GetY2());
    };
    DropPool.prototype.CheckCollision2 = function (cookie) {
        return (cookie.GetX2() >= this.bee.GetX() && cookie.GetX() <= this.bee.GetX2() && cookie.GetY2() >= this.bee.GetY() && cookie.GetY() <= this.bee.GetY2());
    };
    DropPool.prototype.CheckCollision = function (cookie) {
        return (cookie.GetX2() >= this.bucket.GetX() && cookie.GetX() <= this.bucket.GetX2() && cookie.GetY2() >= this.bucket.GetY() && cookie.GetY() <= this.bucket.GetY2());
    };

    DropPool.prototype.RemoveCookie = function (i) {
        this.drops[i].Remove();
        this.drops.push(this.drops.splice(i, 1)[0]);
    };
    return DropPool;
})();
