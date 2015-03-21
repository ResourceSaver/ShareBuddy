var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WhackAMole = (function (_super) {
    __extends(WhackAMole, _super);
    function WhackAMole() {
        _super.call(this);
        this.numberOfMoles = 3;
        this.backgroundImage = images.molebg;
        this.moleSpaceY = Math.round(System.CanvasHeight / this.numberOfMoles);
        this.moleSpaceX = Math.round(System.CanvasWidth / this.numberOfMoles);
        this.piles = new NonAnimation(Minigame.mid3Context, this.moleSpaceY, this.moleSpaceX);
        this.id = 4;

        this.finalLevel = 10;
        this.molesAllowedToMiss = 5;

        this.moles = new Array(3);
        this.CreateMoles();
    }
    WhackAMole.prototype.Start = function () {
        _super.prototype.Start.call(this, 45, 1);
        System.GetGesture().Subscribe(this);
        this.piles.Draw();
        this.moleAliveDuration = 400;

        this.toSpawnPerLevel = 20;

        for (var i = 0; i < this.numberOfMoles; i++) {
            for (var j = 0; j < this.numberOfMoles; j++) {
                this.moles[i][j].Reset();
            }
        }

        Minigame.minigameHelper.Reset(this.molesAllowedToMiss, true);
    };

    WhackAMole.prototype.CreateMoles = function () {
        var animationData = new AnimationData(images.mole, Minigame.mid1Context, 6, 4);
        var x = 0;
        var y = 0;

        for (var i = 0; i < this.numberOfMoles; i++) {
            var arr = new Array(this.numberOfMoles);

            for (var j = 0; j < this.numberOfMoles; j++) {
                arr[j] = new Mole(x + (this.moleSpaceX / 2), y + (this.moleSpaceY / 2), animationData);
                this.piles.AddImage(images.pile, x, y);
                x += this.moleSpaceX;
            }
            y += this.moleSpaceY;
            x = 0;
            this.moles[i] = arr;
        }
    };

    WhackAMole.prototype.Spawn = function () {
        var x = Math.round(Math.random() * (this.numberOfMoles - 1));
        var y = Math.round(Math.random() * (this.numberOfMoles - 1));

        if (this.moles[x][y].Spawn(this.moleAliveDuration)) {
            _super.prototype.Spawn.call(this);
        }
    };

    WhackAMole.prototype.Click = function (holdX, holdY) {
        var x = Math.floor(holdX / (System.GetGW() / this.numberOfMoles));
        var y = Math.floor(holdY / (System.GetGH() / this.numberOfMoles));

        if (x < 0 || x >= this.numberOfMoles || y < 0 || y >= this.numberOfMoles)
            return;

        if (this.moles[y][x].Hit()) {
            if (this.moles[y][x].IsMole()) {
                this.score++;
                _super.prototype.SpawnHandled.call(this);
                Minigame.minigameHelper.WritePoints(this.score);
            } else {
                this.missedTotal++;
                _super.prototype.SpawnHandled.call(this);
                Minigame.minigameHelper.UpdateMissedBox();
            }
        }
    };

    WhackAMole.prototype.Act = function () {
        if (this.missedTotal == this.molesAllowedToMiss)
            return true;

        this.SpawnIfReady();

        for (var i = 0; i < this.numberOfMoles; i++) {
            for (var j = 0; j < this.numberOfMoles; j++) {
                if (this.moles[i][j].Draw()) {
                    if (this.moles[i][j].IsMole()) {
                        this.missedTotal++;
                        Minigame.minigameHelper.UpdateMissedBox();
                    }

                    _super.prototype.SpawnHandled.call(this);
                }
            }
        }

        return this.gameOver;
    };

    WhackAMole.prototype.GetId = function () {
        return this.id;
    };

    WhackAMole.prototype.GetScore = function () {
        return this.score;
    };

    WhackAMole.prototype.ClickUp = function () {
    };
    return WhackAMole;
})(SuperMini);

var Mole = (function () {
    function Mole(x, y, data) {
        this.state = 4 /* DEAD */;
        this.x = x - (data.GetScreenWidht() / 2);
        this.y = y - (data.GetScreenSizeHeight() / 2);
        this.data = data;
        this.manimation = new Animation(this.data, 10 /* Medium */, 0 /* horizontal */, 0, 0, 2);
        this.manimationMissed = new Animation(this.data, 5 /* Fast */, 0 /* horizontal */, 2, 0, 3);
        this.manimationHit = new Animation(this.data, 5 /* Fast */, 0 /* horizontal */, 1, 0, 3);
        this.manimationAppear = new Animation(this.data, 5 /* Fast */, 0 /* horizontal */, 3, 0, 3);
        this.nanimation = new Animation(this.data, 10 /* Medium */, 0 /* horizontal */, 0, 3, 2);
        this.nanimationMissed = new Animation(this.data, 5 /* Fast */, 0 /* horizontal */, 2, 3, 3);
        this.nanimationHit = new Animation(this.data, 5 /* Fast */, 0 /* horizontal */, 1, 3, 3);
        this.nanimationAppear = new Animation(this.data, 5 /* Fast */, 0 /* horizontal */, 3, 3, 3);
    }
    Mole.prototype.Spawn = function (duration) {
        if (this.state != 4 /* DEAD */) {
            return false;
        }

        this.duration = duration;
        this.isMole = (Math.random() < 0.9);

        if (this.isMole) {
            this.animation = this.manimation;
            this.animationAppear = this.manimationAppear;
            this.animationHit = this.manimationHit;
            this.animationMissed = this.manimationMissed;
        } else {
            this.animation = this.nanimation;
            this.animationAppear = this.nanimationAppear;
            this.animationHit = this.nanimationHit;
            this.animationMissed = this.nanimationMissed;
        }

        this.state = 0 /* APPEARING */;
        return true;
    };

    Mole.prototype.IsMole = function () {
        return this.isMole;
    };

    Mole.prototype.Missed = function () {
        if (this.state != 3 /* HIT */) {
            clearInterval(this.timer);
            this.state = 2 /* MISSED */;
        }
    };

    Mole.prototype.Reset = function () {
        this.state = 4 /* DEAD */;
        clearInterval(this.timer);
    };

    Mole.prototype.Draw = function () {
        var _this = this;
        switch (this.state) {
            case 0 /* APPEARING */:
                if (!this.animationAppear.DrawOnce(this.x, this.y)) {
                    break;
                }
                this.timer = setTimeout(function () {
                    return _this.Missed();
                }, this.duration);
                this.state = 1 /* VISIBLE */;
                break;
            case 1 /* VISIBLE */:
                this.animation.DrawLoop(this.x, this.y);
                break;
            case 2 /* MISSED */:
                if (!this.animationMissed.DrawOnce(this.x, this.y)) {
                    break;
                }
                this.animationMissed.Clear();
                this.state = 4 /* DEAD */;
                return true;
            case 3 /* HIT */:
                if (!this.animationHit.DrawOnce(this.x, this.y)) {
                    break;
                }
                this.state = 4 /* DEAD */;
                this.animationHit.Clear();
        }
        return false;
    };

    Mole.prototype.Hit = function () {
        if (this.state != 4 /* DEAD */ && this.state != 3 /* HIT */ && this.state != 2 /* MISSED */) {
            clearInterval(this.timer);
            this.state = 3 /* HIT */;
            return true;
        }

        return false;
    };
    return Mole;
})();
