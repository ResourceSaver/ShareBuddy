
enum ExitCode { STARTED, RUNNING, FINISHED, MINIGAME, LOGGEDIN, ENDED }
enum AnimationSpeed { Slowest = 40, Slow = 30, Medium = 10, Fast = 5, Fastest = 1 }
enum Direction { horizontal, vertical }
enum OS { ANDROID, IOS, WINDOWSMOBILE, OTHER }
enum ActionType { COOKING, LEISURE, FITNESS, HYGIENE }

enum CookieType {
    RAIN,
    BIGRAIN,
    LIGHTNING,
    FIRE
}

enum State {
    LOADING,
    FINISHED,
    RUNNING,
    PAUSED,
    GAMEOVER
}

enum ScoreType {
    A,
    B
}

enum MoveDirection {
    NONE,
    UP,
    DOWN
}

enum MoleState {
    APPEARING,
    VISIBLE,
    MISSED,
    HIT,
    DEAD
}

enum PizzaState {
    NONE,
    SLIDING,
    HIT,
    MISS
}

enum BucketState {
    NORMAL,
    WET,
    FROZEN,
    DEAD
}

enum CurrentType {
    BIG,
    SMALL
}