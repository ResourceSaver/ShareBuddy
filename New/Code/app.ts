var appCache = window.applicationCache;

$(appCache).bind( "downloading", function () {
                        $("#loadingLabel").css('color', 'green');
                        $("#loadingLabel").html("Updating");
});

$(appCache).bind("updateready", function () {
    appCache.swapCache();
    refreshPage();
});

$(window).on("load", () => {
    $(appCache).bind("cached ", function() { UpdateDone(); });
    $(appCache).bind("noupdate", function() { UpdateDone(); });
});

function UpdateDone() {
    $.mobile.changePage("#splash", { changeHash: false, transition: 'fade' });
    var boot: Boot = new Boot();
}

function refreshPage() { location.reload(); }