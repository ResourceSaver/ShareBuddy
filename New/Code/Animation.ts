class AnimationData {
    private context: CanvasRenderingContext2D;
    private image: HTMLImageElement;
    private spriteHeight: number;
    private spriteWidth: number;
    private screenSizeWidth: number;
    private screenSizeHeight: number;

    constructor(image: HTMLImageElement, canvas: CanvasRenderingContext2D, numberOfSpritesX, numberOfSpritesY) {
        this.image = image;
        this.context = canvas;

        this.spriteHeight = Math.round(image.height / numberOfSpritesY);
        this.spriteWidth = Math.round(image.width / numberOfSpritesX);

        this.screenSizeHeight = this.spriteHeight;
        this.screenSizeWidth = this.spriteWidth;
    }

    public GetScreenWidht(): number { return this.screenSizeWidth; }

    public GetScreenSizeHeight(): number { return this.screenSizeHeight; }

    public GetSpriteHeight() { return this.spriteHeight; }

    public GetSpriteWidth() { return this.spriteWidth; }

    public SetScreenSize(height: number, width: number) {
        this.screenSizeWidth = Math.round(width);
        this.screenSizeHeight = Math.round(height);
    }


    public GetContext() { return this.context; }

    public GetImage() { return this.image; }
} 

class Animation {
    private animationData: AnimationData;
    private context: CanvasRenderingContext2D;
    private animationSpeed: number;
    private direction: Direction;
    private currentSpriteX: number;
    private currentSpriteY: number;
    private oldX: number;
    private oldY: number;
    private animationCounter: number;
    private lastSpriteNumber: number;
    private firstSpriteX: number;
    private firstSpriteY: number;
    private centerX: number;
    private centerY: number;

    constructor(animationData:AnimationData, animationSpeedE: AnimationSpeed, direction: Direction, row: number, column: number, lastSpriteNumber: number) {
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

    private Draw(x: number, y: number) {
        x = Math.round(x);
        y = Math.round(y);
        this.Clear();

        var imgCoorX = this.currentSpriteX * this.animationData.GetSpriteWidth();
        var imgCoorY = this.currentSpriteY * this.animationData.GetSpriteHeight();
        this.context.drawImage(this.animationData.GetImage(), imgCoorX, imgCoorY, this.animationData.GetSpriteWidth(), this.animationData.GetSpriteHeight(), x, y, this.animationData.GetScreenWidht(), this.animationData.GetScreenSizeHeight());

        this.oldX = x;
        this.oldY = y;
    }
        
    public DrawLoop(x: number, y: number) {
        this.Draw(x, y);
        this.AdvanceAnimation();
    }

    public DrawOnce(x: number, y: number) {
        this.Draw(x, y);

        var finished: boolean = this.AdvanceAnimation();

        if (finished) { this.Restart(); }

        return finished;
    }
        
    private AdvanceAnimation() {
        this.animationCounter++;

        if (this.animationCounter >= this.animationSpeed) {
            this.animationCounter = 0;
            return this.AdvanceSprite();
        }

        return false;
    }

    private AdvanceSprite() {
        if (this.direction == Direction.horizontal)
            this.currentSpriteX++;
        else if (this.direction == Direction.vertical)
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
    }

    public Restart() {
        this.animationCounter = 0;
        this.currentSpriteX = this.firstSpriteX;
        this.currentSpriteY = this.firstSpriteY;
    }
    
    public SetContext(context) { this.context = context; }

    public DrawOnceAligned() { return this.DrawOnce(this.centerX, this.centerY); }

    public DrawLoopAligned() { this.DrawLoop(this.centerX, this.centerY); }

    public Clear() { this.context.clearRect(this.oldX, this.oldY, this.animationData.GetScreenWidht(), this.animationData.GetScreenSizeHeight()); }
    
    public GetAnimationData() { return this.animationData; }
} 

class NonAnimation {
    private context: CanvasRenderingContext2D;
    private list: Object[];
    private spaceHeight: number;
    private spaceWidth: number;

    public constructor(canvas: CanvasRenderingContext2D, spaceHeight: number, spaceWidth: number) {
        this.spaceHeight = spaceHeight;
        this.spaceWidth = spaceWidth;
        this.context = canvas;
        this.list = new Array();
    }

    public AddImage(image: HTMLImageElement, x: number, y: number) {
        y = y + this.spaceHeight - image.height;
        x = x + (this.spaceWidth / 2) - (image.width / 2);

        this.list.push([image, x, y]);
    }

    public Draw() {
        for (var i = 0; i < this.list.length; i++) {
            var ob = this.list[i];

            var image: HTMLImageElement = ob[0];
            var x: number = ob[1];
            var y: number = ob[2];

            this.context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
        }
    }
}

class SingleImage {
    private context: CanvasRenderingContext2D;
    private image: HTMLImageElement;
    private height: number;
    private width: number;
    private oldX: number;
    private oldY: number;

    public constructor(canvas: CanvasRenderingContext2D, image: HTMLImageElement, height: number, width: number) {
        this.context = canvas;
        this.image = image;
        this.height = height;
        this.width = width;
        this.oldX = 0;
        this.oldY = 0;
    }

    public GetWidth() { return this.width; }

    public Draw(x: number, y: number) {
        this.context.clearRect(this.oldX, this.oldY, this.width, this.height);
        this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, x, y, this.width, this.height);
        this.oldX = x;
        this.oldY = y;
    }
}