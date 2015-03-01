class Timer {
    private loginDate: Date;
    private currentHour: number;
    private currentMinutte: number;
    public static newDayHour: number;
    private timer;

    constructor() {
        this.SetLoginDate(new Date());
        this.currentHour = -1;
        this.currentMinutte = -1;
        Timer.newDayHour = System.GetUserData().GetUpdateHour();
        this.Tick();
    }

    public start() { this.timer = setInterval(() => this.Tick(), 1000) }

    public stop() { clearInterval(this.timer); }

    private Tick() {
        var now = new Date();
        now.setTime(now.getTime() - System.GetUserData().GetTimeDelta());

        if (now.getHours() != this.currentHour) {
            this.currentHour = now.getHours();
            this.CheckNewDay(now, this.loginDate);
            MiniCast.HourChanged(this.currentHour);
        }
        else if (now.getDay() != this.loginDate.getDay()) {
            this.CheckNewDay(now, this.loginDate);
        }

        if (now.getMinutes() != this.currentMinutte) {
            this.currentMinutte = now.getMinutes();
            MiniCast.MinutteChanged(this.currentHour, this.currentMinutte);
        }
    }

    private CheckNewDay(now: Date, liDate: Date) {

        var mili: Date;

        if (now.getHours() >= Timer.newDayHour) {
            mili = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Timer.newDayHour, 0, 0, 0);
        }
        else {
            mili = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, Timer.newDayHour, 0, 0, 0);
        }

        if (liDate < mili) {
            this.SetLoginDate(now);
            $.mobile.changePage("#dayisoverpage", { changeHash: false, transition: transitions });
            setTimeout(() => Game.ShowWaitingForNewDay(), 5000);
        }
    }

    private SetLoginDate(date:Date) {
        this.loginDate = date;
        this.loginDate.setTime(this.loginDate.getTime() - System.GetUserData().GetTimeDelta());
    }






    //private TestNewDay() {

    //    var lD = 2;
    //    var lH = 2;
    //    var lM = 2;

    //    var nD = 2;
    //    var nH = 2;
    //    var nM = 2;

    //    lD = 8;
    //    lH = 22;
    //    lM = 0;

    //    nD = 8;
    //    nH = 23;
    //    nM = 30;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, false, 1);

    //    lD = 8;
    //    lH = 22;
    //    lM = 20;

    //    nD = 9;
    //    nH = 0;
    //    nM = 30;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, false, 2);

    //    lD = 8;
    //    lH = 22;
    //    lM = 20;

    //    nD = 9;
    //    nH = 1;
    //    nM = 0;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, true, 3);

    //    lD = 8;
    //    lH = 0;
    //    lM = 20;

    //    nD = 8;
    //    nH = 1;
    //    nM = 0;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, true, 4);


    //    lD = 8;
    //    lH = 1;
    //    lM = 0;

    //    nD = 8;
    //    nH = 1;
    //    nM = 2;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, false, 5);

    //    // MORE DAYS

    //    lD = 8;
    //    lH = 22;
    //    lM = 20;

    //    nD = 9;
    //    nH = 22;
    //    nM = 30;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, true, 6);

    //    lD = 7;
    //    lH = 22;
    //    lM = 0;

    //    nD = 9;
    //    nH = 0;
    //    nM = 30;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, true, 7);



    //    lD = 8;
    //    lH = 22;
    //    lM = 20;

    //    nD = 9;
    //    nH = 1;
    //    nM = 0;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, true, 8);

    //    lD = 7;
    //    lH = 0;
    //    lM = 20;

    //    nD = 9;
    //    nH = 0;
    //    nM = 20;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, true, 9);

    //    lD = 7;
    //    lH = 0;
    //    lM = 20;

    //    nD = 8;
    //    nH = 1;
    //    nM = 30;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, true, 10);

    //    lD = 7;
    //    lH = 10;
    //    lM = 20;

    //    nD = 10;
    //    nH = 11;
    //    nM = 20;

    //    this.TestHelper(nD, nH, nM, lD, lH, lM, true, 11);

    //}

    //private TestHelper(nD, nH, nM, lD, lH, lM, expectedResult, id) {
    //    var now: Date = new Date(2015, 2, nD, nH, nM);

    //    var login: Date = new Date(2015, 2, lD, lH, lM);

    //    var res = this.CheckNewDay(now, login);

    //    if (res != expectedResult)
    //        console.log("Fail: " + id);
    //    else
    //        console.log("Success: " + id);

    //} 
}