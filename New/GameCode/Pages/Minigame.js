var Minigame = (function () {
    function Minigame() {
        var _this = this;
        var backgroundCanvas = document.getElementById("background");
        Minigame.backgroundContext = backgroundCanvas.getContext("2d");
        Minigame.backgroundContext.canvas.height = System.CanvasHeight;
        Minigame.backgroundContext.canvas.width = System.CanvasWidth;
        Minigame.backgroundContext.canvas.style.height = System.GetGH() + "px";
        Minigame.backgroundContext.canvas.style.width = System.GetGW() + "px";

        var frontCanvas = document.getElementById("text");
        Minigame.textContext = frontCanvas.getContext("2d");
        Minigame.textContext.canvas.width = System.CanvasWidth;
        Minigame.textContext.canvas.height = System.CanvasHeight;
        Minigame.textContext.canvas.style.height = System.GetGH() + "px";
        Minigame.textContext.canvas.style.width = System.GetGW() + "px";
        Minigame.textContext.font = "bold 14px Trebuchet MS";

        var mid1Canvas = document.getElementById("mid1");
        Minigame.mid1Context = mid1Canvas.getContext("2d");
        Minigame.mid1Context.canvas.height = System.CanvasHeight;
        Minigame.mid1Context.canvas.width = System.CanvasWidth;
        Minigame.mid1Context.canvas.style.width = System.GetGW() + "px";
        Minigame.mid1Context.canvas.style.height = System.GetGH() + "px";

        var mid2Canvas = document.getElementById("mid2");
        Minigame.mid2Context = mid2Canvas.getContext("2d");
        Minigame.mid2Context.canvas.height = System.CanvasHeight;
        Minigame.mid2Context.canvas.width = System.CanvasWidth;
        Minigame.mid2Context.canvas.style.width = System.GetGW() + "px";
        Minigame.mid2Context.canvas.style.height = System.GetGH() + "px";

        var mid3Canvas = document.getElementById("mid3");
        Minigame.mid3Context = mid3Canvas.getContext("2d");
        Minigame.mid3Context.canvas.height = System.CanvasHeight;
        Minigame.mid3Context.canvas.width = System.CanvasWidth;
        Minigame.mid3Context.canvas.style.width = System.GetGW() + "px";
        Minigame.mid3Context.canvas.style.height = System.GetGH() + "px";

        Minigame.minigameHelper = new MiniGameHelper();

        this.whackAMole = new WhackAMole();
        this.frogger = new RainingDrops();
        this.pizza = new PizzaGame();
        this.cooking = new Cooking();

        $("#closeMinigame").on("click", function () {
            return _this.StopMiniGame(true, false);
        });
    }
    Minigame.prototype.ClearCanvas = function () {
        Minigame.backgroundContext.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
        Minigame.textContext.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
        Minigame.mid1Context.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
        Minigame.mid2Context.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
        Minigame.mid3Context.clearRect(0, 0, System.CanvasWidth, System.CanvasHeight);
    };

    Minigame.prototype.StartGame = function (type) {
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
    };

    Minigame.prototype.Act = function () {
        if (this.selectedMiniGame.Act()) {
            this.StopMiniGame(false, true);
        }
    };

    Minigame.prototype.StopMiniGame = function (cancelled, pause) {
        var _this = this;
        this.selectedMiniGame.Act();

        Game.SetMain();

        if (pause)
            setTimeout(function () {
                Game.MinigameCompleted(_this.selectedMiniGame.GetScore(), cancelled, _this.selectedMiniGame.GetId());
            }, 2000);
        else
            Game.MinigameCompleted(this.selectedMiniGame.GetScore(), cancelled, this.selectedMiniGame.GetId());
    };
    return Minigame;
})();

var MiniGameHelper = (function () {
    function MiniGameHelper() {
        this.missedBox = new Box(0, 70, "#b92020");
        this.actionButton = new ActionButton();
    }
    MiniGameHelper.prototype.ShowButton = function () {
        this.actionButton.Show();
    };

    MiniGameHelper.prototype.SetButtonLocation = function (x, y, text) {
        this.actionButton.SetLocation(x, y, text);
    };

    MiniGameHelper.prototype.HideButton = function () {
        this.actionButton.Hide();
    };

    MiniGameHelper.prototype.UpdateMissedBox = function () {
        this.missedBox.Add();
    };

    MiniGameHelper.prototype.Reset = function (allowedMiss, showBox) {
        this.WriteLevel(1);
        this.WritePoints(0);

        if (showBox)
            this.missedBox.Reset(allowedMiss);
    };

    MiniGameHelper.prototype.WriteText = function (text, x, y, color, fontsize) {
        if (typeof fontsize === "undefined") { fontsize = 14; }
        Minigame.textContext.clearRect(x, y - 15, 70, 50);
        Minigame.textContext.font = "bold " + fontsize + "px Comic Sans MS";
        Minigame.textContext.fillStyle = "black";
        Minigame.textContext.fillText(text, x + 1, y + 1, 100);
        Minigame.textContext.fillStyle = color;
        Minigame.textContext.fillText(text, x, y, 100);
    };

    MiniGameHelper.prototype.WriteTempText = function (points) {
        var x = System.CanvasWidth - 100;
        var y = System.CanvasHeight - 50;

        clearTimeout(this.timeout);
        Minigame.textContext.clearRect(x, y - 50, 70, 50);

        this.WriteText("+" + points, x, y, 'green', 50);

        this.timeout = setTimeout(function () {
            Minigame.textContext.clearRect(x, y - 50, 70, 70);
        }, 3000);
    };

    MiniGameHelper.prototype.WritePoints = function (score) {
        this.WriteText("Points " + score, 270, 15, "white");
    };

    MiniGameHelper.prototype.WriteLevel = function (level) {
        this.WriteText("Level " + level, 195, 15, "white");
    };
    return MiniGameHelper;
})();

var SuperMini = (function () {
    function SuperMini() {
        this.handledSpawns = 0;
        this.xs = 145;
        this.ys = 180;
    }
    SuperMini.prototype.SpawnIfReady = function () {
        if (this.gamePaused)
            return;

        this.currentSpawnSpeedCounter++;

        if (this.currentSpawnSpeedCounter > this.currentSpawnSpeed && Math.random() > 0.8) {
            this.Spawn();
            this.currentSpawnSpeedCounter = 0;

            if (this.spawnedThisLevel == this.toSpawnPerLevel) {
                this.gamePaused = true;
                this.currentSpawnSpeed -= this.spawnSpeedIncrease;
                this.spawnedThisLevel = 0;
            }
        }
    };

    SuperMini.prototype.SpawnHandled = function () {
        this.handledSpawns++;

        if (this.handledSpawns == this.toSpawnPerLevel) {
            this.handledSpawns = 0;
            this.StartNextLevel();
        }
    };

    SuperMini.prototype.Spawn = function () {
        this.spawnedThisLevel++;
        this.spawnedTotal++;
    };

    SuperMini.prototype.Start = function (spawnSpeedStart, spawnSpeedEnd) {
        this.currentSpawnSpeed = spawnSpeedStart;
        this.toSpawnPerLevel = spawnSpeedEnd;
        this.spawnSpeedIncrease = Math.floor(((spawnSpeedStart - spawnSpeedEnd) / (this.finalLevel - 2)));
        this.score = 0;
        this.currentLevel = 0;
        this.currentSpawnSpeedCounter = 0;
        this.spawnedTotal = 0;
        this.spawnedThisLevel = 0;
        this.missedTotal = 0;
        this.handledSpawns = 0;
        this.gameOver = false;
        Minigame.backgroundContext.drawImage(this.backgroundImage, 0, 0, this.backgroundImage.width, this.backgroundImage.height, 0, 0, System.CanvasWidth, System.CanvasHeight);
        this.gamePaused = true;
        this.StartNextLevel();
    };

    SuperMini.prototype.StartNextLevel = function () {
        var _this = this;
        console.log("HE");
        this.currentLevel++;

        if (this.currentLevel == this.finalLevel) {
            this.WriteLevelBig("Final Level");
            Minigame.minigameHelper.WriteLevel(this.currentLevel);
        } else if (this.currentLevel > this.finalLevel) {
            this.gameOver = true;
            this.WriteLevelBig("You won!");
        } else {
            this.WriteLevelBig("Level " + this.currentLevel);
            Minigame.minigameHelper.WriteLevel(this.currentLevel);
        }

        setTimeout(function () {
            Minigame.textContext.clearRect(_this.xs, _this.ys - 80, 250, 100);
            _this.gamePaused = false;
        }, 1000);
    };

    SuperMini.prototype.WriteLevelBig = function (text) {
        Minigame.textContext.font = "bold " + 60 + "px Helvetica Neue";
        Minigame.textContext.fillStyle = "black";
        Minigame.textContext.fillText(text, this.xs + 3, this.ys + 3, 200);
        Minigame.textContext.fillStyle = "White";
        Minigame.textContext.fillText(text, this.xs, this.ys, 200);
    };
    return SuperMini;
})();

var Box = (function () {
    function Box(ys, xs, color) {
        this.color = color;
        this.count = 0;
        this.w = 100;
        this.h = 10;
        this.y = ys + 5;
        this.x = xs - 5;

        this.context = Minigame.textContext;
        this.context.lineWidth = 1;
        this.context.strokeStyle = "black";
        this.context.strokeRect(this.x, this.y, this.w, this.h);
    }
    Box.prototype.Reset = function (dataValue) {
        this.count = 0;
        this.context.clearRect(this.x, this.y, this.w, this.h);
        this.addSize = this.w / dataValue;
        this.drawBox();
    };

    Box.prototype.drawBox = function () {
        this.context.fillStyle = "#06d56d";

        this.context.strokeRect(this.x, this.y, this.w, this.h);
        this.context.fillRect(this.x, this.y, this.w, this.h);
    };

    Box.prototype.Add = function () {
        this.count++;
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.count * this.addSize, this.h);
    };
    return Box;
})();

var ActionButton = (function () {
    function ActionButton() {
        this.shown = false;
        this.w = 100;
        this.h = 50;

        this.context = Minigame.textContext;
        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
    }
    ActionButton.prototype.SetLocation = function (x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
    };

    ActionButton.prototype.Hide = function () {
        this.shown = false;
        this.context.clearRect(this.x, this.y, this.w, this.w);
    };

    ActionButton.prototype.Show = function () {
        if (this.shown)
            return;
        this.shown = true;
        this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.context.fillRect(this.x, this.y, this.w, this.h);
        this.context.fillStyle = "white";

        this.context.fillText(this.text, this.x + (30), this.y + 5 + (this.h / 2), 100);
    };
    return ActionButton;
})();
