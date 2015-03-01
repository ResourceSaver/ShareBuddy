class Cache {
    private appCache = window.applicationCache;

    // Create a cache properties object to help us keep track of the progress of the caching.
    private cacheProperties = {
        filesDownloaded: 0,
        totalFiles: 0
    };


// I get the total number of files in the cache manifest. I do this by manually parsing the manifest file.
public getTotalFiles() {
    // First, reset the total file count and download count.
    this.cacheProperties.filesDownloaded = 0;
    this.cacheProperties.totalFiles = 0;

    // Now, grab the cache manifest file.
    $.ajax({
        type: "get",
        url: "./Other/sharebuddy.appcache",
        dataType: "text",
        cache: false,
        success: function (content) {
            // Strip out the non-cache sections.
            // NOTE: The line break here is only to prevent
            // wrapping in the BLOG.
            content = content.replace(
                new RegExp(
                    "(NETWORK|FALLBACK):" +
                    "((?!(NETWORK|FALLBACK|CACHE):)[\\w\\W]*)",
                    "gi"
                    ),
                ""
                );

            // Strip out all comments.
            content = content.replace(
                new RegExp("#[^\\r\\n]*(\\r\\n?|\\n)", "g"),
                ""
                );

            // Strip out the cache manifest header and
            // trailing slashes.
            content = content.replace(
                new RegExp("CACHE MANIFEST\\s*|\\s*$", "g"),
                ""
                );

            // Strip out extra line breaks and replace with
            // a hash sign that we can break on.
            content = content.replace(
                new RegExp("[\\r\\n]+", "g"),
                "#"
                );

            // Get the total number of files.
            var totalFiles = content.split("#").length;

            // Store the total number of files. Here, we are
            // adding one for *THIS* file, which is cached
            // implicitly as it points to the manifest.
            this.cacheProperties.totalFiles = (totalFiles + 1);
        }
    });
}


    // I display the download progress.
    public displayProgress() {
        // Increment the running total.
        this.cacheProperties.filesDownloaded++;

        // Check to see if we have a total number of files.
        if (this.cacheProperties.totalFiles) {

            // We have the total number of files, so output the
            // running total as a function of the known total.
            console.log(
                this.cacheProperties.filesDownloaded +
                " of " +
                this.cacheProperties.totalFiles +
                " files downloaded."
                );

        } else {
            // We don't yet know the total number of files, so
            // just output the running total.
            console.log(this.cacheProperties.filesDownloaded + " files downloaded." );
        }
    }


    public constructor() {
        // Bind the manual update link.
        //manualUpdate.click(
        //    function (event) {
        //        // Prevent the default event.
        //        event.preventDefault();

        //        // Manually ask the cache to update.
        //        appCache.update();
        //    }
        //    );


        // List for checking events. This gets fired when the browser  is checking for an udpated manifest file or is attempting
        // to download it for the first time.
        $(this.appCache).bind(
            "checking",
            function (event) {
                alert("Checking for manifest");
            }
            );

        // This gets fired if there is no update to the manifest file
        // that has just been checked.
        $(this.appCache).bind(
            "noupdate",
            function (event) {
                alert("No cache updates");
            }
            );

        // This gets fired when the browser is downloading the files
        // defined in the cache manifest.
        $(this.appCache).bind(
            "downloading",
            () => {
                alert("Downloading cache");

                // Get the total number of files in our manifest.
                this.getTotalFiles();
            });

        // This gets fired for every file that is downloaded by the
        // cache update.
        $(this.appCache).bind(
            "progress",
            (event) => { alert("files downloaded"); this.displayProgress(); }); 
            

        // This gets fired when all cached files have been
        // downloaded and are available to the application cache.
        $(this.appCache).bind(
            "cached",
            function (event) {
                alert("All files downloaded");
            }
            );

        // This gets fired when new cache files have been downloaded
        // and are ready to replace the *existing* cache. The old
        // cache will need to be swapped out.
        $(this.appCache).bind(
            "updateready",
            function (event) {
                alert("New cache available");

                // Swap out the old cache.
                appCache.swapCache();
                refreshPage();
            }
            );

        // This gets fired when the cache manifest cannot be found.
        $(this.appCache).bind(
            "obsolete",
            function (event) {
                alert("Manifest cannot be found");
            }
            );

        // This gets fired when an error occurs
        $(this.appCache).bind(
            "error",
            function (event) {
                alert("An error occurred");
            }
            );

        this.appCache.update();
    }
} 