var SetPet = (function () {
    function SetPet() {
        var _this = this;
        this.bussy = false;
        $('#closePet').on('click', function () {
            return _this.Click();
        });
        $("#petname").on("keyup", function (e) {
            return _this.keyPress(e);
        });
        $("#male").on("click", function () {
            return _this.EnableNextButton();
        });
        $("#radio-choice-t-6b").on("click", function () {
            return _this.EnableNextButton();
        });

        if (System.GetUserData().GetBuddyName() != null && System.GetUserData().GetBuddyName() != "") {
            System.GetUserData().SetBuddyName(System.GetUserData().GetBuddyName().charAt(0).toUpperCase() + System.GetUserData().GetBuddyName().slice(1));
            $(".buddyName").html("<strong>" + System.GetUserData().GetBuddyName() + "</strong>");
        }
    }
    SetPet.prototype.EnableNextButton = function () {
        if (($("#petname").val()).length > 0 && ($("#male").is(":checked") || $("#radio-choice-t-6b").is(":checked"))) {
            $("#closePet").removeClass("ui-disabled");
        } else {
            $("#closePet").addClass("ui-disabled");
        }
    };

    SetPet.prototype.IsSet = function () {
        return System.GetUserData().GetBuddyName() != "";
    };

    SetPet.prototype.Show = function () {
        $.mobile.changePage("#setname", { changeHash: false, transition: transitions });
    };

    SetPet.prototype.keyPress = function (event) {
        var name = $("#petname").val();

        if (name.length > 10) {
            $("#petname").val(name.substr(0, 10));
            $("#max10").show();
            event.preventDefault();
            return;
        }
        this.EnableNextButton();

        if (event.keyCode == 13) {
            if ($("#petname").val() == "") {
                $("#petname").blur();
            } else {
                this.Click();
            }
        }
    };

    SetPet.prototype.Click = function () {
        var _this = this;
        if (this.bussy) {
            return;
        }

        this.bussy = true;
        var label = document.getElementById("petname");
        var male = $("#male").is(":checked");
        System.GetConnection().SetPetName(label.value, male, function (r) {
            return _this.setnameCallback(r);
        });
        System.GetUserData().SetBuddyName(label.value.charAt(0).toUpperCase() + label.value.slice(1));
        System.GetUserData().SetMale(male);
        $(".buddyName").html("<strong>" + System.GetUserData().GetBuddyName() + "</strong>");
        $.mobile.loading("show");
    };

    SetPet.prototype.setnameCallback = function (code) {
        $.mobile.loading("hide");

        if (code == 0) {
            $("#petnameerror").text("An error occurred. Please try again");
        } else if (code == 1) {
            $("#petnameerror").text("Name already taken.");
        } else if (code == 2) {
            System.GetUserData().SetMale($("#male").is(":checked"));
            Game.ShowAgree();
        }

        this.bussy = false;
    };
    return SetPet;
})();

var Agree = (function () {
    function Agree() {
        var _this = this;
        $('#agrClose').on('click', function () {
            return _this.Click();
        });
    }
    Agree.prototype.Click = function () {
        Game.ChangePage();
    };

    Agree.prototype.Show = function () {
        $.mobile.changePage("#agreement", { changeHash: false, transition: transitions });
    };
    return Agree;
})();

var Homescreen = (function () {
    function Homescreen(callback) {
        var _this = this;
        this.callback = callback;

        this.ath = addToHomescreen({
            autostart: false,
            lifespan: 0,
            modal: true,
            startDelay: 0,
            maxDisplayCount: 0,
            displayPace: 0
        });

        $("#showHomeScreenButton").bind('click', function () {
            _this.ath.show();
        });
        $("#closeATH").on('click', function () {
            callback();
        });
    }
    Homescreen.prototype.Show = function () {
        $.mobile.changePage("#homescreen", { changeHash: false, transition: transitions });
    };
    return Homescreen;
})();

var WelcomeBack = (function () {
    function WelcomeBack() {
        $("#closeWelcomeBack").bind('click', function () {
            Game.ChangePage();
        });
    }
    WelcomeBack.prototype.NewDay = function () {
        return System.GetLocalStorage().IsItANewDay();
    };

    WelcomeBack.prototype.Show = function () {
        $.mobile.changePage("#welcomeback", { changeHash: false, transition: transitions });
    };
    return WelcomeBack;
})();

var Tutorial = (function () {
    function Tutorial() {
        var _this = this;
        this.numberOfSlides = 0;
        this.closed = false;
        $('#tutButton').on('click', function () {
            return Game.ShowTutorialAgain();
        });
        $("#closeTut").on("click", function () {
            return _this.Next();
        });
        $("#back").on("click", function () {
            return _this.Back();
        });
        $("#tutcont").css({ "height": "100%" });
        $("#tutcont").css({ "width": "100%" });

        this.divs = $("#tutcont")[0];
        this.numberOfSlides = this.divs.children.length - 1;
    }
    Tutorial.prototype.ShowFirst = function () {
        this.first = true;
        this.slideCount = 1;
        $("#back").addClass("ui-disabled");
        this.Show();
    };

    Tutorial.prototype.ShowAgain = function () {
        this.slideCount = 0;
        this.first = false;
        $("#back").removeClass("ui-disabled");
        this.Show();
    };

    Tutorial.prototype.Show = function () {
        this.closed = false;
        $(this.divs.children[this.slideCount]).show();
        $.mobile.changePage("#tutorial", { changeHash: false, transition: transitions });
    };

    Tutorial.prototype.HasBeenSeen = function () {
        return System.GetLocalStorage().Get('isTutRead') == 'true';
    };

    Tutorial.prototype.Back = function () {
        if (this.slideCount == 2 && this.first) {
            $("#back").addClass("ui-disabled");
            $("#back").removeClass("ui-btn-active");
            $("#closeTut").removeClass("ui-btn-active");
        }

        if (this.slideCount > 0) {
            this.slideCount--;

            $(this.divs.children[this.slideCount + 1]).hide();
            $(this.divs.children[this.slideCount]).show();
        } else {
            Game.ChangePage();
        }
    };

    Tutorial.prototype.Next = function () {
        this.slideCount++;

        if (this.slideCount > 0 && this.first)
            $("#back").removeClass("ui-disabled");

        if (this.slideCount > this.numberOfSlides && !this.closed) {
            this.closed = true;
            System.GetLocalStorage().write('isTutRead', 'true');
            $(this.divs.children[this.slideCount - 1]).hide();
            Game.ChangePage();
        } else {
            $(this.divs.children[this.slideCount - 1]).hide();
            $(this.divs.children[this.slideCount]).show();
        }
    };
    return Tutorial;
})();

var MiniGameResult = (function () {
    function MiniGameResult() {
        var _this = this;
        $("#minigameresultbutton").bind('click', function (score, cancelled) {
            return Game.MinigameCompleted(_this.score, _this.cancelled);
        });
    }
    MiniGameResult.prototype.Show = function (score, cancelled, id, action) {
        this.cancelled = cancelled;
        this.score = score;

        var oldScore = this.CheckHighScore(id, score);
        $("#highscore").html("Your highscore: " + oldScore);

        $.mobile.changePage("#minigameresult", { changeHash: false, transition: transitions });

        $("#minigamescore").text(score.toString());
        $("#activityValue").text(action.GetValue().toString());
        $("#minigameresulttotal").html("<strong> Total " + (score + action.GetValue() + "</strong>"));
    };

    MiniGameResult.prototype.CheckHighScore = function (id, score) {
        var oldScore = +System.GetLocalStorage().Get("MG" + id.toString());

        if (oldScore == null)
            oldScore = 0;

        if (oldScore < score) {
            System.GetLocalStorage().write("MG" + id.toString(), score.toString());
        }

        return oldScore;
    };
    return MiniGameResult;
})();

var WaitingForNewDay = (function () {
    function WaitingForNewDay() {
    }
    WaitingForNewDay.prototype.Show = function () {
        var _this = this;
        $.mobile.changePage("#waitingfornewday", { changeHash: false, transition: transitions });
        System.GetConnection().IsDayReady(function (r) {
            return _this.IsDayReadyCB(r);
        });
    };

    WaitingForNewDay.prototype.IsDayReadyCB = function (r) {
        var _this = this;
        if (r == true) {
            refreshPage();
        } else {
            setTimeout(function (r) {
                return System.GetConnection().IsDayReady(function (r) {
                    return _this.IsDayReadyCB(r);
                });
            }, 30000);
        }
    };
    return WaitingForNewDay;
})();

var ConnectionError = (function () {
    function ConnectionError() {
    }
    ConnectionError.Show = function () {
        var _this = this;
        $.mobile.changePage("#errorCon", { changeHash: false, transition: transitions });
        setTimeout(function () {
            return _this.Close();
        }, 4000);
    };

    ConnectionError.Close = function () {
        System.GetLocalStorage().Remove("loggedin");
        refreshPage();
    };
    return ConnectionError;
})();

var Events = (function () {
    function Events() {
        this.hasBeenSeen = false;
        $("#eventsbutton").bind('click', function () {
            return Game.ChangePage();
        });
    }
    Events.prototype.Show = function () {
        this.hasBeenSeen = true;
        var event = System.GetUserData().GetEvent();

        if (event != null) {
            var eventText = event['text'];
            eventText = eventText.replace('[p]', System.GetUserData().GetBuddyName());
            eventText = eventText.replace('[v]', Math.abs(event['value']).toString());

            if (System.GetUserData().IsMale())
                eventText = eventText.replace('[g]', 'his');
            else
                eventText = eventText.replace('[g]', 'her');

            $("#eventmessage").html(eventText);
        }
        $.mobile.changePage("#events", { changeHash: false, transition: transitions });
    };

    Events.prototype.HasBeenSeen = function () {
        return (System.GetUserData().GetEvent() == null || this.hasBeenSeen);
    };
    return Events;
})();

var HowToPlay = (function () {
    function HowToPlay() {
        var _this = this;
        $("#howtoplaybutton").on("click", function () {
            return _this.Click();
        });
    }
    HowToPlay.prototype.Show = function (action) {
        var actionType = action.GetType();
        var advice = Advice.GetAdvice(actionType);
        this.actionType = actionType;

        $("#advicetext").html('"' + advice + '"');
        $("#htpWhack").hide();
        $("#htpLeisure").hide();
        $("#htpCooking").hide();
        $("#htpRain").hide();

        switch (actionType) {
            case "Fitness":
                $("#htpWhack").show();
                break;
            case "Leisure":
                $("#htpLeisure").show();
                break;
            case "Cooking":
                $("#htpCooking").show();
                break;
            case "Hygiene":
                $("#htpRain").show();
                break;
        }

        $.mobile.changePage("#howotplay", { changeHash: false, transition: transitions });
    };

    HowToPlay.prototype.Click = function () {
        Game.ShowMinigame(this.actionType);
    };
    return HowToPlay;
})();

var Offline = (function () {
    function Offline() {
        var _this = this;
        $("#forecastO").hide();
        $("#rankingO").hide();
        $("#forecastButtonO").on("click", function () {
            $("#messageO").hide();
            $("#forecastO").show();
            $("#rankingO").hide();
        });
        $("#rankingButtonO").on("click", function () {
            $("#messageO").hide();
            $("#forecastO").hide();
            $("#rankingO").show();
            System.GetConnection().GetRanking(function (val) {
                return _this.RankingReady(val);
            });
        });
        $("#frontButtonO").on("click", function () {
            $("#messageO").show();
            $("#forecastO").hide();
            $("#rankingO").hide();
        });
    }
    Offline.prototype.Show = function () {
        $(".today").html(Day.GetToday());

        $(".newDayStartsAt").text("0" + System.GetUserData().GetUpdateHour() + ":00");
        $.mobile.changePage("#offline", { changeHash: false, transition: transitions });
    };

    Offline.prototype.MoreToShow = function () {
        return System.GetUserData().IsMore();
    };

    Offline.prototype.RankingReady = function (val) {
        $("#rankTableO tr").remove();
        $("#rankTableO").table("refresh");

        var html = "<tr class=\"ui - bar - d\" ><th data - priority = \"3\" > Place </th > <th data - priority = \"2\" > Name </th > <th data - priority = \"1\" > Score </th > < / tr>";

        for (var i = 0; i < val.length; i++) {
            var o = val[i];

            if (o["name"] == null || o["name"] == "")
                continue;

            html = html + "<tr>";
            if (o["king"] == true) {
                $("#shifternameO").html(o["name"]);
                html = html + "<td>" + (i + 1) + "<img src='Images/medal.png'/></td>";
            } else {
                html = html + "<td>" + (i + 1) + "</td>";
            }

            html = html + "<td>" + o["name"] + "</td>";
            html = html + "<td>" + o["score"] + "</td>";
            html = html + "</tr>";
        }

        $("#rankTableO > tbody").append(html);
        $("#rankTableO").table("refresh");
    };
    return Offline;
})();

var Ranking = (function () {
    function Ranking() {
        $('#rankingButton').on('click', function () {
            return Game.ShowRankingPage();
        });
        $("#closeRankButton").bind("click", function () {
            return Game.ChangePage();
        });
    }
    Ranking.prototype.RankingReady = function (val) {
        $("#rankTable tr").remove();
        $("#rankTable").table("refresh");

        var html = "<tr class=\"ui - bar - d\" ><th data - priority = \"3\" > Place </th > <th data - priority = \"2\" > Name </th > <th data - priority = \"1\" > Score </th > < / tr>";

        for (var i = 0; i < val.length; i++) {
            var o = val[i];

            if (o["name"] == null || o["name"] == "")
                continue;

            var name = o["name"];

            html = html + "<tr>";
            if (o["king"] == true) {
                $("#shiftername").html(o["name"]);
                html = html + "<td>" + (i + 1) + "<img src='Images/medal.png'/></td>";
            } else {
                html = html + "<td>" + (i + 1) + "</td>";
            }

            if (name.toLowerCase() == System.GetUserData().GetBuddyName().toLowerCase()) {
                html = html + "<td><strong>" + o["name"] + "</strong></td>";
            } else
                html = html + "<td>" + o["name"] + "</td>";

            html = html + "<td>" + o["score"] + "</td>";
            html = html + "</tr>";
        }

        $("#rankTable > tbody").append(html);
        $("#rankTable").table("refresh");
        $.mobile.loading("hide");
    };

    Ranking.prototype.Show = function () {
        var _this = this;
        if (System.GetLocalStorage().ShowRankingOverlay()) {
            var rankingOverlay = new RankingOverLay();
            rankingOverlay.Show();
        } else {
            $.mobile.changePage("#ranking", { changeHash: false, transition: transitions });
            $.mobile.loading("show");
            System.GetConnection().GetRanking(function (val) {
                return _this.RankingReady(val);
            });
        }
    };
    return Ranking;
})();

var RankingOverLay = (function () {
    function RankingOverLay() {
        var _this = this;
        $("#rankingOverlayButton").bind('click', function () {
            return _this.Close();
        });
    }
    RankingOverLay.prototype.Close = function () {
        Game.ShowRankingPage();
    };

    RankingOverLay.prototype.Show = function () {
        $.mobile.changePage("#rankingOverlay", { changeHash: false, transition: transitions });
    };
    return RankingOverLay;
})();

var Usage = (function () {
    function Usage() {
        this.loaded = false;
        $('#usageButton').on('click', function () {
            return Game.ShowResourcePage();
        });
        $("#usageCloseButton").bind("click", function () {
            return Game.ChangePage();
        });
        $("#forecasttext").html("Consume your electricity in the green hours to save electricity points for " + System.GetUserData().GetBuddyName() + ".");
    }
    Usage.prototype.Show = function () {
        var _this = this;
        $.mobile.loading("show");
        System.GetConnection().GetUsageHistory(function (val) {
            return _this.UsageReady(val);
        });
    };

    Usage.prototype.UsageReady = function (result) {
        if (!this.loaded) {
            this.loaded = true;
            $("#text24").html("The top list shows the hours where you consumed most electricity for yesterday (indicated by yellow). The bottom list shows the hours where it would have been best to do so (indicated by green). Your shifting score: " + result["shifting"] + "(positive values are good)");

            if ((result["UsageExists"] != null && result["UsageExists"])) {
                var elUsage = result["co2"];
                var elBaseline = result["co2baseline"];
                var waterBaseline = result["waterbaseline"];
                var waterUsage = result["waterUsage"];
                var elPct = Math.round(((elBaseline - elUsage) / elBaseline) * 100);
                var waterPct = Math.round(((waterBaseline - waterUsage) / waterBaseline) * 100);

                if (waterPct < 0 || waterBaseline == 0)
                    waterPct = 0;
                if (elPct < 0 || elBaseline == 0)
                    elPct = 0;

                $("#waterRedText").html("You reduced your water usage by " + waterPct + "% compared to your usual " + Day.GetYesterday());
                $("#elRedText").html("You reduced your electricity usage by " + elPct + "% compared to your usual " + Day.GetYesterday());

                $("#waterCont").append(this.GetUsageDiv(waterUsage, waterBaseline));
                $("#elCont").append(this.GetUsageDiv(elUsage, elBaseline));
            }
        }
        $.mobile.changePage("#usage", { changeHash: false, transition: transitions });
        $.mobile.loading("hide");
    };

    Usage.prototype.GetUsageDiv = function (usage, baseline) {
        var container = document.createElement('div');
        container.className = "usageContainer";

        var centered = document.createElement('div');
        centered.className = "usageCentered";

        var centeredText = document.createElement('div');
        centeredText.style.width = "60%";
        centeredText.style.display = "inline-block";

        var percent = 0;

        if (baseline != 0)
            percent = Math.round(((baseline - usage) / baseline) * 100);
        if (percent > 100)
            percent = 100;
        else if (percent < 0)
            percent = 0;

        var green = document.createElement('div');
        green.style.width = (percent) + "%";
        green.innerHTML = "<span style='font-size:12px;'>" + System.GetUserData().GetBuddyName() + "</span>";
        green.className = "usageGreen";

        var red = document.createElement('div');
        red.style.width = (100 - percent) + "%";
        red.innerHTML = "<span style='font-size:12px;'>You</span>";
        red.className = "usageRed";

        if (percent == 100) {
            green.style.borderTopLeftRadius = "25px";
            green.style.borderBottomLeftRadius = "25px";
        } else if (percent == 0) {
            red.style.borderTopRightRadius = "25px";
            red.style.borderBottomRightRadius = "25px";
        }

        centered.appendChild(red);
        centered.appendChild(green);
        container.appendChild(centered);

        return container;
    };
    return Usage;
})();

var Rewards = (function () {
    function Rewards() {
        var _this = this;
        this.numberOfSlides = 0;
        this.slideCount = 0;
        this.shown = false;
        $("#nowaterpresent").hide();
        $(".yesterday").html(Day.GetYesterday());
        $("#noElectricityPresent").hide();
        $("#rewardNext").bind("click", function () {
            return _this.Next();
        });
    }
    Rewards.prototype.Show = function () {
        this.reward = System.GetUserData().GetReward();
        this.shown = true;

        if (this.reward == null) {
            Game.ChangePage();
            return;
        }

        this.divs = $("#rewardCont")[0];

        if (System.GetUserData().GetUsage()["co2"] == -1) {
            this.divs.removeChild(this.divs.children[1]);
            this.divs.removeChild(this.divs.children[1]);
        }

        this.numberOfSlides = this.divs.children.length - 1;

        for (var i = 1; i <= this.divs.children.length; i++) {
            $(this.divs.children[i]).hide();
        }

        this.SetWater();
        this.SetElectricity();

        $.mobile.changePage("#rewards", { changeHash: false, transition: transitions });
    };

    Rewards.prototype.HasBeenShown = function () {
        return this.shown;
    };

    Rewards.prototype.Next = function () {
        this.slideCount++;
        if (this.slideCount > this.numberOfSlides) {
            Game.ChangePage();
        } else {
            $(this.divs.children[this.slideCount - 1]).hide();
            $(this.divs.children[this.slideCount]).show();
        }
    };

    Rewards.prototype.SetWater = function () {
        $("#waterpoints").html(Math.round(this.reward["waterScore"]).toString());

        if (System.GetUserData().GetUsage()["waterUsage"] == -1) {
            $("#waterpresent").hide();
            $("#nowaterpresent").show();
        } else {
            var delta = Math.round(this.reward["waterReduction"]);
            var reductionOrIncrease = "";
            var percentReductionString = "";

            if (delta >= 0) {
                reductionOrIncrease = " reduced ";

                if (delta > 30)
                    percentReductionString = " more than 30%";
                else
                    percentReductionString = delta.toString() + "%";
            } else {
                reductionOrIncrease = " increased ";
                percentReductionString = (-1 * delta).toString() + "%";
            }

            $("#waterchange").html(reductionOrIncrease);
            $("#waterreduction").html(percentReductionString);
        }
    };

    Rewards.prototype.SetElectricity = function () {
        var score = Math.round(this.reward["electricityScore"]);
        $("#electricitypoints").html(score.toString());

        if (System.GetUserData().GetUsage()["co2"] == -1) {
            $("#noElectricityPresent").show();
            $("#electricityPresent").hide();
        } else {
            var electricity = System.GetUserData().GetUsage()["electricity"];
            var electricityBaseline = System.GetUserData().GetUsage()["electricitybaseline"];
            var delta = 0;

            if (electricityBaseline != 0)
                delta = Math.round(((electricityBaseline - electricity) / electricityBaseline) * 100);

            var reducedOrIncreasedString = "";
            var percentReductionString = "";

            if (delta >= 0) {
                reducedOrIncreasedString = " reduced ";

                if (delta > 30) {
                    percentReductionString = " more than 30%";
                } else {
                    percentReductionString = delta.toString() + "%";
                }
            } else {
                reducedOrIncreasedString = " increased ";
                percentReductionString = (-1 * delta).toString() + "%";
            }

            $("#electricitychange").html(reducedOrIncreasedString);
            $("#electricityreduction").html(percentReductionString);

            $("#shiftingamount").html(System.GetUserData().GetUsage()["shifting"]);
            $("#elsham").html("<strong>Reduction</strong>(" + delta + "%) + <strong>Shifting</strong>(" + System.GetUserData().GetUsage()["shifting"] + ") = ");
        }
    };
    return Rewards;
})();
