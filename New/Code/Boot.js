var images;
var transitions = "flip";

var Boot = (function () {
    function Boot() {
        var _this = this;
        this.loaded = false;
        images = new Images(function () {
            _this.ImagesLoaded();
        });
    }
    Boot.prototype.ImagesLoaded = function () {
        var _this = this;
        this.system = new System();
        if (System.StandAloneMode() || System.GetOS() == 3 /* OTHER */) {
            this.CheckOrientation();
        } else {
            var homeScreen = new Homescreen(function () {
                return _this.CheckOrientation();
            });
            homeScreen.Show();
        }
    };

    Boot.prototype.CheckOrientation = function () {
        var _this = this;
        $("#homescreen").css('display', 'none');

        $(window).bind("orientationchange", function (event) {
            if (event.orientation === 'portrait') {
                $("#error").css('display', 'block');
            } else {
                $("#error").css('display', 'none');

                if (!_this.loaded) {
                    _this.LoadGame();
                }
            }
        }).trigger('orientationchange', true);
    };

    Boot.prototype.LoadGame = function () {
        this.loaded = true;
        this.system.Setup();
        var game = new Game();
        game.Start();
    };
    return Boot;
})();
