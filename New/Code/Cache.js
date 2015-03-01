var Cache = (function () {
    function Cache() {
        var _this = this;
        this.appCache = window.applicationCache;
        this.cacheProperties = {
            filesDownloaded: 0,
            totalFiles: 0
        };
        $(this.appCache).bind("checking", function (event) {
            alert("Checking for manifest");
        });

        $(this.appCache).bind("noupdate", function (event) {
            alert("No cache updates");
        });

        $(this.appCache).bind("downloading", function () {
            alert("Downloading cache");

            _this.getTotalFiles();
        });

        $(this.appCache).bind("progress", function (event) {
            alert("files downloaded");
            _this.displayProgress();
        });

        $(this.appCache).bind("cached", function (event) {
            alert("All files downloaded");
        });

        $(this.appCache).bind("updateready", function (event) {
            alert("New cache available");

            appCache.swapCache();
            refreshPage();
        });

        $(this.appCache).bind("obsolete", function (event) {
            alert("Manifest cannot be found");
        });

        $(this.appCache).bind("error", function (event) {
            alert("An error occurred");
        });

        this.appCache.update();
    }
    Cache.prototype.getTotalFiles = function () {
        this.cacheProperties.filesDownloaded = 0;
        this.cacheProperties.totalFiles = 0;

        $.ajax({
            type: "get",
            url: "./Other/sharebuddy.appcache",
            dataType: "text",
            cache: false,
            success: function (content) {
                content = content.replace(new RegExp("(NETWORK|FALLBACK):" + "((?!(NETWORK|FALLBACK|CACHE):)[\\w\\W]*)", "gi"), "");

                content = content.replace(new RegExp("#[^\\r\\n]*(\\r\\n?|\\n)", "g"), "");

                content = content.replace(new RegExp("CACHE MANIFEST\\s*|\\s*$", "g"), "");

                content = content.replace(new RegExp("[\\r\\n]+", "g"), "#");

                var totalFiles = content.split("#").length;

                this.cacheProperties.totalFiles = (totalFiles + 1);
            }
        });
    };

    Cache.prototype.displayProgress = function () {
        this.cacheProperties.filesDownloaded++;

        if (this.cacheProperties.totalFiles) {
            console.log(this.cacheProperties.filesDownloaded + " of " + this.cacheProperties.totalFiles + " files downloaded.");
        } else {
            console.log(this.cacheProperties.filesDownloaded + " files downloaded.");
        }
    };
    return Cache;
})();
