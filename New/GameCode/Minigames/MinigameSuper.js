var MinigameSuper = (function () {
    function MinigameSuper(sct, backgroundImage) {
        this.background = Minigame.backgroundContext;
        this.front = Minigame.textContext;
        this.mid1 = Minigame.mid1Context;
        this.mid2 = Minigame.mid2Context;
        this.backgroundImage = backgroundImage;
        this.scoreType = sct;
    }
    MinigameSuper.prototype.SetSpeed = function (spawnSpeedStart, spawnSpeedEnd, gameOverLevel) {
        this.gameOverLevel = gameOverLevel;
        this.spawnSpeedStart = spawnSpeedStart;
        this.spawnSpeedEnd = spawnSpeedEnd;
        this.spawnSpeedIncreaseAmount = Math.floor(((this.spawnSpeedStart - this.spawnSpeedEnd) / (this.gameOverLevel - 2)));
    };

    MinigameSuper.prototype.Load = function () {
        this.background.drawImage(this.backgroundImage, 0, 0, this.backgroundImage.width, this.backgroundImage.height, 0, 0, System.CanvasWidth, System.CanvasHeight);
        this.state = 0 /* LOADING */;
        this.ResetValues();
        this.WriteLevel();
        this.WritePoints();
        System.GetGesture().Subscribe(this);
        this.Start();
    };

    MinigameSuper.prototype.ResetValues = function () {
        MinigameSuper.score = 0;
        MinigameSuper.spawned = 0;
        MinigameSuper.hit = 0;
        MinigameSuper.miss = 0;
        MinigameSuper.level = 1;
        MinigameSuper.currentMiss = 0;
        this.numberToSpawn = 10;

        this.spawnSpeed = this.spawnSpeedStart;
        MinigameSuper.missedBox.Reset(this.gameOverLevel);
    };

    MinigameSuper.prototype.Finish = function () {
        MinigameSuper.spawnCounter = 0;
        this.state = 1 /* FINISHED */;
    };

    MinigameSuper.prototype.Resume = function () {
        if (this.state == 1 /* FINISHED */)
            return;

        this.front.clearRect(120, 110, 200, 200);
        this.state = 2 /* RUNNING */;
    };

    MinigameSuper.prototype.LevelUp = function () {
        if (MinigameSuper.hit + MinigameSuper.currentMiss == this.numberToSpawn) {
            MinigameSuper.level++;

            if (MinigameSuper.level == this.gameOverLevel) {
                this.Finish();
                return;
            }

            this.spawnSpeed -= this.spawnSpeedIncreaseAmount;
            MinigameSuper.hit = 0;
            MinigameSuper.currentMiss = 0;
            MinigameSuper.spawned = 0;
            this.numberToSpawn += 5;

            this.WriteLevel();
            this.Resume();
        }
    };

    MinigameSuper.prototype.IncMiss = function () {
        MinigameSuper.miss++;
        MinigameSuper.currentMiss++;
        MinigameSuper.missedBox.Add();

        if (MinigameSuper.miss >= this.gameOverLevel) {
            this.Finish();
            return;
        }

        this.LevelUp();
    };

    MinigameSuper.prototype.IncPoints = function (num) {
        var _this = this;
        MinigameSuper.hit++;

        MinigameSuper.score += num;
        this.WritePoints();

        if (this.scoreType == 1 /* B */) {
            clearTimeout(this.scoreBTimer);
            this.front.clearRect(200, 90, 300, 300);
            this.WriteText("+" + num, 215, 170, "white", 40);
            this.scoreBTimer = setTimeout(function () {
                _this.front.clearRect(200, 90, 300, 300);
            }, 800);
        }

        this.LevelUp();
    };

    MinigameSuper.prototype.Act = function () {
        MinigameSuper.spawnCounter++;

        if (MinigameSuper.spawnCounter > this.spawnSpeed && Math.random() > 0.8) {
            this.Spawn();
            MinigameSuper.spawnCounter = 0;
        }
    };

    MinigameSuper.prototype.WriteText = function (text, x, y, color, fontsize) {
        if (typeof fontsize === "undefined") { fontsize = 14; }
        this.front.clearRect(x, y - 15, 70, 50);
        this.front.font = "bold " + fontsize + "px Trebuchet MS";
        this.front.fillStyle = "black";
        this.front.fillText(text, x + 1, y + 1, 100);
        this.front.fillStyle = color;
        this.front.fillText(text, x, y, 100);
    };

    MinigameSuper.prototype.IncSpawned = function () {
        MinigameSuper.spawned++;
    };
    MinigameSuper.prototype.WritePoints = function () {
        this.WriteText("Points " + MinigameSuper.score, 270, 15, "white");
    };
    MinigameSuper.prototype.WriteLevel = function () {
        this.WriteText("Level " + MinigameSuper.level, 185, 15, "white");
    };
    MinigameSuper.prototype.Start = function () {
        var _this = this;
        setTimeout(function () {
            _this.state = 2 /* RUNNING */;
        }, 1000);
    };
    MinigameSuper.prototype.moreToSpawn = function () {
        return (MinigameSuper.spawned < this.numberToSpawn && this.state != 3 /* PAUSED */);
    };
    MinigameSuper.prototype.GetState = function () {
        return this.state;
    };
    MinigameSuper.prototype.GetScore = function () {
        return MinigameSuper.score;
    };
    MinigameSuper.prototype.GetId = function () {
        return this.id;
    };
    MinigameSuper.prototype.Click = function (x, y) {
    };
    MinigameSuper.prototype.ClickUp = function () {
    };
    MinigameSuper.prototype.Spawn = function () {
    };
    MinigameSuper.prototype.SetMissedBox = function (box) {
        MinigameSuper.missedBox = box;
    };
    MinigameSuper.spawnCounter = 0;
    return MinigameSuper;
})();
