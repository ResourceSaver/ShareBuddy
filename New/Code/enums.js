var ExitCode;
(function (ExitCode) {
    ExitCode[ExitCode["STARTED"] = 0] = "STARTED";
    ExitCode[ExitCode["RUNNING"] = 1] = "RUNNING";
    ExitCode[ExitCode["FINISHED"] = 2] = "FINISHED";
    ExitCode[ExitCode["MINIGAME"] = 3] = "MINIGAME";
    ExitCode[ExitCode["LOGGEDIN"] = 4] = "LOGGEDIN";
    ExitCode[ExitCode["ENDED"] = 5] = "ENDED";
})(ExitCode || (ExitCode = {}));
var AnimationSpeed;
(function (AnimationSpeed) {
    AnimationSpeed[AnimationSpeed["Slowest"] = 40] = "Slowest";
    AnimationSpeed[AnimationSpeed["Slow"] = 30] = "Slow";
    AnimationSpeed[AnimationSpeed["Medium"] = 10] = "Medium";
    AnimationSpeed[AnimationSpeed["Fast"] = 5] = "Fast";
    AnimationSpeed[AnimationSpeed["Fastest"] = 1] = "Fastest";
})(AnimationSpeed || (AnimationSpeed = {}));
var Direction;
(function (Direction) {
    Direction[Direction["horizontal"] = 0] = "horizontal";
    Direction[Direction["vertical"] = 1] = "vertical";
})(Direction || (Direction = {}));
var OS;
(function (OS) {
    OS[OS["ANDROID"] = 0] = "ANDROID";
    OS[OS["IOS"] = 1] = "IOS";
    OS[OS["WINDOWSMOBILE"] = 2] = "WINDOWSMOBILE";
    OS[OS["OTHER"] = 3] = "OTHER";
})(OS || (OS = {}));
var ActionType;
(function (ActionType) {
    ActionType[ActionType["COOKING"] = 0] = "COOKING";
    ActionType[ActionType["LEISURE"] = 1] = "LEISURE";
    ActionType[ActionType["FITNESS"] = 2] = "FITNESS";
    ActionType[ActionType["HYGIENE"] = 3] = "HYGIENE";
})(ActionType || (ActionType = {}));

var CookieType;
(function (CookieType) {
    CookieType[CookieType["RAIN"] = 0] = "RAIN";
    CookieType[CookieType["BIGRAIN"] = 1] = "BIGRAIN";
    CookieType[CookieType["LIGHTNING"] = 2] = "LIGHTNING";
    CookieType[CookieType["FIRE"] = 3] = "FIRE";
})(CookieType || (CookieType = {}));

var State;
(function (State) {
    State[State["LOADING"] = 0] = "LOADING";
    State[State["FINISHED"] = 1] = "FINISHED";
    State[State["RUNNING"] = 2] = "RUNNING";
    State[State["PAUSED"] = 3] = "PAUSED";
    State[State["GAMEOVER"] = 4] = "GAMEOVER";
})(State || (State = {}));

var ScoreType;
(function (ScoreType) {
    ScoreType[ScoreType["A"] = 0] = "A";
    ScoreType[ScoreType["B"] = 1] = "B";
})(ScoreType || (ScoreType = {}));

var MoveDirection;
(function (MoveDirection) {
    MoveDirection[MoveDirection["NONE"] = 0] = "NONE";
    MoveDirection[MoveDirection["UP"] = 1] = "UP";
    MoveDirection[MoveDirection["DOWN"] = 2] = "DOWN";
})(MoveDirection || (MoveDirection = {}));

var MoleState;
(function (MoleState) {
    MoleState[MoleState["APPEARING"] = 0] = "APPEARING";
    MoleState[MoleState["VISIBLE"] = 1] = "VISIBLE";
    MoleState[MoleState["MISSED"] = 2] = "MISSED";
    MoleState[MoleState["HIT"] = 3] = "HIT";
    MoleState[MoleState["DEAD"] = 4] = "DEAD";
})(MoleState || (MoleState = {}));

var PizzaState;
(function (PizzaState) {
    PizzaState[PizzaState["NONE"] = 0] = "NONE";
    PizzaState[PizzaState["SLIDING"] = 1] = "SLIDING";
    PizzaState[PizzaState["HIT"] = 2] = "HIT";
    PizzaState[PizzaState["MISS"] = 3] = "MISS";
})(PizzaState || (PizzaState = {}));

var BucketState;
(function (BucketState) {
    BucketState[BucketState["NORMAL"] = 0] = "NORMAL";
    BucketState[BucketState["WET"] = 1] = "WET";
    BucketState[BucketState["FROZEN"] = 2] = "FROZEN";
    BucketState[BucketState["DEAD"] = 3] = "DEAD";
})(BucketState || (BucketState = {}));

var CurrentType;
(function (CurrentType) {
    CurrentType[CurrentType["BIG"] = 0] = "BIG";
    CurrentType[CurrentType["SMALL"] = 1] = "SMALL";
})(CurrentType || (CurrentType = {}));
