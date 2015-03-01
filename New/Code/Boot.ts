var images: Images;
var transitions = "flip";

class Boot{
    private system: System;
    private loaded: boolean = false;

    public constructor() { images = new Images(() => { this.ImagesLoaded(); } ); }

    public ImagesLoaded() {
        this.system = new System();
        if (System.StandAloneMode() || System.GetOS() == OS.OTHER) { this.CheckOrientation(); }
        else {
            var homeScreen: Homescreen = new Homescreen(() => this.CheckOrientation());
            homeScreen.Show();
        }
    }
    
    private CheckOrientation() {
        $("#homescreen").css('display', 'none');

        $(window).bind("orientationchange", (event) => {
            if (event.orientation === 'portrait') {
                $("#error").css('display', 'block');
            }
            else  { 
                $("#error").css('display', 'none');

                if (!this.loaded) {
                    this.LoadGame();
                }
            }
        }).trigger('orientationchange', true);
    }

    private LoadGame() {
        this.loaded = true;
        this.system.Setup();
        var game = new Game();
        game.Start();
    }
}



        //private CheckOrientation() {

    //    $("#homescreen").css('display', 'none');

    //    $(window).bind("orientationchange", () => {
    //        if (screen.height > screen.width) {
    //            $("#error").css('display', 'block');
    //        }
    //        else if (screen.height < screen.width) { // Landscape
    //            $("#error").css('display', 'none');

    //            if (!this.loaded) {
    //                this.loaded = true;
    //                this.LoadGame();
    //            }
    //        }
    //    }).trigger('orientationchange', true);
    //}

    //private CheckOrientation() {

    //    $(window).bind("orientationchange", () => {
    //        if ($(window).height() > $(window).width()) {
    //            $("#error").css('display', 'block');
    //        }
    //        else { // Landscape
    //            $("#error").css('display', 'none');

    //            if (!this.loaded) {
    //                this.loaded = true;
    //                this.LoadGame();
    //            }
    //        }
    //    });

    //    $(window).trigger('orientationchange');

    //    // landscape/portrait, timeout
    //}


//private CheckOrientation() {
//    $(window).bind("orientationchange", () => {
//        if (screen.height > screen.width) {
//            alert("H");

//            $("#error").css('display', 'block');
//        }
//        else if (screen.height < screen.width) { // Landscape
//            $("#error").css('display', 'none');
//            alert("EJ2");

//            if (!this.loaded) {
//                this.loaded = true;
//                this.LoadGame();
//            }
//        }
//    });

//    $(window).trigger('orientationchange');

//    // landscape/portrait, timeout
//}