var AnimationData = (function () {
    function AnimationData(image, canvas, numberOfSpritesX, numberOfSpritesY) {
        this.image = image;
        this.context = canvas;

        this.spriteHeight = Math.round(image.height / numberOfSpritesY);
        this.spriteWidth = Math.round(image.width / numberOfSpritesX);

        this.screenSizeHeight = this.spriteHeight;
        this.screenSizeWidth = this.spriteWidth;
    }
    AnimationData.prototype.GetScreenWidht = function () {
        return this.screenSizeWidth;
    };

    AnimationData.prototype.GetScreenSizeHeight = function () {
        return this.screenSizeHeight;
    };

    AnimationData.prototype.GetSpriteHeight = function () {
        return this.spriteHeight;
    };

    AnimationData.prototype.GetSpriteWidth = function () {
        return this.spriteWidth;
    };

    AnimationData.prototype.SetScreenSize = function (height, width) {
        this.screenSizeWidth = Math.round(width);
        this.screenSizeHeight = Math.round(height);
    };

    AnimationData.prototype.GetContext = function () {
        return this.context;
    };

    AnimationData.prototype.GetImage = function () {
        return this.image;
    };
    return AnimationData;
})();

var Animation = (function () {
    function Animation(animationData, animationSpeedE, direction, row, column, lastSpriteNumber) {
        this.animationData = animationData;
        this.context = animationData.GetContext();

        this.oldX = 0;
        this.oldY = 0;

        this.firstSpriteX = column;
        this.firstSpriteY = row;

        this.currentSpriteX = this.firstSpriteX;
        this.currentSpriteY = this.firstSpriteY;

        this.lastSpriteNumber = lastSpriteNumber;

        this.animationCounter = 0;
        this.animationSpeed = animationSpeedE;
        this.direction = direction;

        this.centerX = (System.CanvasWidth / 2) - (animationData.GetScreenWidht() / 2);
        this.centerY = (System.CanvasHeight / 2) - (animationData.GetScreenSizeHeight() / 5);
    }
    Animation.prototype.Draw = function (x, y) {
        x = Math.round(x);
        y = Math.round(y);
        this.Clear();

        var imgCoorX = this.currentSpriteX * this.animationData.GetSpriteWidth();
        var imgCoorY = this.currentSpriteY * this.animationData.GetSpriteHeight();
        this.context.drawImage(this.animationData.GetImage(), imgCoorX, imgCoorY, this.animationData.GetSpriteWidth(), this.animationData.GetSpriteHeight(), x, y, this.animationData.GetScreenWidht(), this.animationData.GetScreenSizeHeight());

        this.oldX = x;
        this.oldY = y;
    };

    Animation.prototype.DrawLoop = function (x, y) {
        this.Draw(x, y);
        this.AdvanceAnimation();
    };

    Animation.prototype.DrawOnce = function (x, y) {
        this.Draw(x, y);

        var finished = this.AdvanceAnimation();

        if (finished) {
            this.Restart();
        }

        return finished;
    };

    Animation.prototype.AdvanceAnimation = function () {
        this.animationCounter++;

        if (this.animationCounter >= this.animationSpeed) {
            this.animationCounter = 0;
            return this.AdvanceSprite();
        }

        return false;
    };

    Animation.prototype.AdvanceSprite = function () {
        if (this.direction == 0 /* horizontal */)
            this.currentSpriteX++;
        else if (this.direction == 1 /* vertical */)
            this.currentSpriteY++;

        if (this.currentSpriteX >= this.firstSpriteX + this.lastSpriteNumber) {
            this.currentSpriteX = this.firstSpriteX;
            return true;
        }
        if (this.currentSpriteY >= this.firstSpriteY + this.lastSpriteNumber) {
            this.currentSpriteY = this.firstSpriteY;
            return true;
        }

        return false;
    };

    Animation.prototype.Restart = function () {
        this.animationCounter = 0;
        this.currentSpriteX = this.firstSpriteX;
        this.currentSpriteY = this.firstSpriteY;
    };

    Animation.prototype.SetContext = function (context) {
        this.context = context;
    };

    Animation.prototype.DrawOnceAligned = function () {
        return this.DrawOnce(this.centerX, this.centerY);
    };

    Animation.prototype.DrawLoopAligned = function () {
        this.DrawLoop(this.centerX, this.centerY);
    };

    Animation.prototype.Clear = function () {
        this.context.clearRect(this.oldX, this.oldY, this.animationData.GetScreenWidht(), this.animationData.GetScreenSizeHeight());
    };

    Animation.prototype.GetAnimationData = function () {
        return this.animationData;
    };
    return Animation;
})();

var NonAnimation = (function () {
    function NonAnimation(canvas, spaceHeight, spaceWidth) {
        this.spaceHeight = spaceHeight;
        this.spaceWidth = spaceWidth;
        this.context = canvas;
        this.list = new Array();
    }
    NonAnimation.prototype.AddImage = function (image, x, y) {
        y = y + this.spaceHeight - image.height;
        x = x + (this.spaceWidth / 2) - (image.width / 2);

        this.list.push([image, x, y]);
    };

    NonAnimation.prototype.Draw = function () {
        for (var i = 0; i < this.list.length; i++) {
            var ob = this.list[i];

            var image = ob[0];
            var x = ob[1];
            var y = ob[2];

            this.context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
        }
    };
    return NonAnimation;
})();

var SingleImage = (function () {
    function SingleImage(canvas, image, height, width) {
        this.context = canvas;
        this.image = image;
        this.height = height;
        this.width = width;
        this.oldX = 0;
        this.oldY = 0;
    }
    SingleImage.prototype.GetWidth = function () {
        return this.width;
    };

    SingleImage.prototype.Draw = function (x, y) {
        this.context.clearRect(this.oldX, this.oldY, this.width, this.height);
        this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, x, y, this.width, this.height);
        this.oldX = x;
        this.oldY = y;
    };
    return SingleImage;
})();
