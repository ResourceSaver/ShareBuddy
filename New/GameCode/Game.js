var Game = (function () {
    function Game() {
    }
    Game.prototype.Start = function () {
        Game.loginPage = new Login();
        Game.ShowLogin();
        $.mobile.loading("hide");
        GameLoop();
    };

    Game.DataReady = function () {
        var forecast = new Forecast();
        var day = new Day();
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
    };

    Game.ChangePage = function () {
        if (!this.setname.IsSet()) {
            this.setname.Show();
        } else if (!this.offline.MoreToShow()) {
            this.offline.Show();
        } else if (!this.tutorial.HasBeenSeen()) {
            this.tutorial.ShowFirst();
        } else if (this.welcomeBack.NewDay()) {
            this.welcomeBack.Show();
        } else if (!this.rewards.HasBeenShown()) {
            this.rewards.Show();
        } else if (!this.events.HasBeenSeen()) {
            this.events.Show();
        } else {
            this.mainScreen.Show();
        }
    };

    Game.ShowWaitingForNewDay = function () {
        this.timer.stop();
        this.waitingfornewday.Show();
    };

    Game.MinigameCompleted = function (score, cancelled) {
        System.GetUserData().PerformAction(this.actionSelector.GetSelectedAction(), score, cancelled);
        this.SetMain();
        this.mainScreen.Show();
        this.mainScreen.ShowAnimation(this.actionSelector.GetSelectedAction());
    };

    Game.ShowMiniGameResult = function (score, cancelled, id) {
        Game.minigameresult.Show(score, cancelled, id, Game.actionSelector.GetSelectedAction());
    };

    Game.ShowMinigame = function (actiontype) {
        this.minigame.StartGame(actiontype);
    };

    Game.ShowLogin = function () {
        this.loginPage.Show();
    };

    Game.ShowAgree = function () {
        this.agree.Show();
    };

    Game.ShowResourcePage = function () {
        this.usage.Show();
    };

    Game.ShowRankingPage = function () {
        this.ranking.Show();
    };

    Game.ShowTutorialAgain = function () {
        this.tutorial.ShowAgain();
    };

    Game.ShowActionSelector = function (type) {
        this.actionSelector.Show(type);
    };

    Game.ShowHowToPlay = function (action) {
        this.howtoplay.Show(action);
    };

    Game.SetMain = function () {
        this.currentActor = this.mainScreen;
    };

    Game.SetMiniGames = function () {
        this.currentActor = this.minigame;
    };

    Game.Act = function () {
        if (this.currentActor != null)
            this.currentActor.Act();
    };
    return Game;
})();

function GameLoop() {
    Game.Act();
    var rf = RequestFrame();
    rf(GameLoop);
}
