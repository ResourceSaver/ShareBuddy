class Game {
    private static mainScreen: MainScreen;
    private static loginPage ;
    private static tutorial: Tutorial;
    private static rewards: Rewards;
    private static offline: Offline;
    private static highscores: Highscores;
    private static ranking: Ranking;
    private static usage: Usage;
    private static actionSelector: ActionSelector;
    private static howtoplay: HowToPlay;
    private static setname: SetPet;
    private static timer: Timer;
    private static minigameresult: MiniGameResult;
    private static events: Events;
    private static agree: Agree;
    private static waitingfornewday: WaitingForNewDay;
    private static minigame: Minigame;
    private static welcomeBack: WelcomeBack;
    private static currentActor: Actor;

    public Start() {

        Game.loginPage = new Login();
        Game.ShowLogin();
        $.mobile.loading("hide");
        GameLoop();
    }

    public static DataReady() {
        var forecast = new Forecast();
        var day: Day = new Day();
        forecast.Setup();

        Game.waitingfornewday = new WaitingForNewDay();

        if (!System.GetUserData().IsDayReady()) {
            this.waitingfornewday.Show();
            return;
        }
        Game.welcomeBack = new WelcomeBack();
        Game.minigame = new Minigame();
        Game.tutorial = new Tutorial();
        Game.rewards = new Rewards();
        Game.mainScreen = new MainScreen();
        Game.offline = new Offline();
        Game.highscores = new Highscores();
        Game.ranking = new Ranking();
        Game.usage = new Usage();
        Game.actionSelector = new ActionSelector(System.GetUserData().GetActions());
        Game.howtoplay = new HowToPlay();
        Game.setname = new SetPet();
        Game.timer = new Timer();
        Game.minigameresult = new MiniGameResult();
        Game.events = new Events();
        Game.agree = new Agree();
        Game.timer.start();
        this.ChangePage();
    }

    public static ChangePage() {
        if (!this.setname.IsSet()) { this.setname.Show(); }
        else if (!this.offline.MoreToShow()) { this.offline.Show(); }
        else if (!this.tutorial.HasBeenSeen()) { this.tutorial.ShowFirst(); }
        else if (this.welcomeBack.NewDay()) { this.welcomeBack.Show(); }
        else if (!this.rewards.HasBeenShown()) { this.rewards.Show(); }
        else if (!this.events.HasBeenSeen()) { this.events.Show(); }
        else { this.mainScreen.Show(); }
    }

    public static ShowHighScores() { this.highscores.show(); }
    
    public static ShowWaitingForNewDay() {
        this.timer.stop();
        this.waitingfornewday.Show();
    }

    public static MinigameCompleted(score: number, cancelled: boolean) {
        System.GetUserData().PerformAction(this.actionSelector.GetSelectedAction(), score, cancelled);
        this.SetMain();
        this.mainScreen.Show();
        this.mainScreen.ShowAnimation(this.actionSelector.GetSelectedAction());
    }

    public static ShowMiniGameResult(score: number, cancelled: boolean, id: number) { Game.minigameresult.Show(score, cancelled, id, Game.actionSelector.GetSelectedAction()); }

    public static ShowMinigame(actiontype) { this.minigame.StartGame(actiontype) }

    public static ShowLogin() { this.loginPage.Show(); }

    public static ShowAgree() { this.agree.Show(); }

    public static ShowResourcePage() { this.usage.Show(); }

    public static ShowRankingPage() { this.ranking.Show(); }

    public static ShowTutorialAgain() { this.tutorial.ShowAgain(); }

    public static ShowActionSelector(type: string) { this.actionSelector.Show(type); }

    public static ShowHowToPlay(action: Action) { this.howtoplay.Show(action); }

    public static SetMain() { this.currentActor = this.mainScreen }

    public static SetMiniGames() { this.currentActor = this.minigame; }

    public static Act() {
        if (this.currentActor != null)
            this.currentActor.Act();
    }
} 

interface Actor { Act(); }

declare function RequestFrame();

function GameLoop() {
    Game.Act();
    var rf = RequestFrame();
    rf(GameLoop);
}




