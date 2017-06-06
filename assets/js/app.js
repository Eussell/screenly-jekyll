(function () {
    /**
     * Check the full width of an element based on it's childs width
     *
     * @since 0.0.1
     */
    function getInnerWidth (el) {
        if (!el) {
            return 0;
        }

        var width = 0;
        var children = el.children;
        if (children.length>0) {
            for (var i = 0; i < children.length; i++) {
                width += children[i].offsetWidth;
            }
        }
        else {
            width = el.offsetWidth;
        }

        return width;
    }




    /**
     * Reduce the size of an element by reducing it's font size
     *
     * @since 0.0.1
     */
    var scalableFonts = document.querySelectorAll(".scale-font");
    if (scalableFonts.length>0) {
        for(var i=0; i<scalableFonts.length; i++) {
            var el = scalableFonts[i];
            var parent = el.parentElement;
            var parentWidth = parent.offsetWidth;
            var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style);
            while (parentWidth < getInnerWidth(el)) {
                fontSize-=0.5;
                el.style.fontSize = fontSize + 'px';
            }
        }
    }
})();

/**
 * This file should hold global script. Use app.utils for utilities.
 *

 * @since    0.0.1
 */
(function() {
    /**
     * DOM elements
     *
     * @since 0.0.1
     */
    var html = document.querySelector("html");
    var clockDom = document.getElementById('footer-clock');


    /**
     * Global vars
     *
     * @since 0.0.1
     */
    var timezone = html.getAttribute('data-timezone');
    var sunSpeed = 10*60000; // As in 10 minutes (winter)
    var sunriseTimeUnix, sunsetTimeUnix;
    var sunriseTimeConcat, sunriseEndTimeConcat, sunsetTimeConcat, sunsetEndTimeConcat;


    /**
     * We pick up all the server data in HTML tag attributes
     *
     * @since 0.0.1
     */
    var mmt = moment();
        mmt.tz(timezone);


    /**
     * After all functions and vars are declared we run init.
     *
     * @since 0.0.1
     */
    function init () {
        sunriseTimeUnix = Number(html.getAttribute('data-sunrise'));
        sunsetTimeUnix  = Number(html.getAttribute('data-sunset'));

        // Sunrise
        var sunMoment = moment(sunriseTimeUnix*1000);
        sunMoment.tz(timezone);
        sunriseTimeConcat = sunMoment.format('Hmm');

        // Sunrise end point
        sunMoment = moment(sunriseTimeUnix*1000+sunSpeed);
        sunMoment.tz(timezone);
        sunriseEndTimeConcat = sunMoment.format('Hmm');

        // Sunset
        sunMoment = moment(sunsetTimeUnix*1000);
        sunMoment.tz(timezone);
        sunsetTimeConcat = sunMoment.format('Hmm');

        // Sunset end point
        sunMoment = moment(sunsetTimeUnix*1000+sunSpeed);
        sunMoment.tz(timezone);
        sunsetEndTimeConcat = sunMoment.format('Hmm');

        sunMoment = null; // Clean it, we're not using it anymore


        /**
         * Run time process for first time
         *
         * @since 0.0.1
         */
        checkTime();


        /**
         * Start the loop that will be updating everytime
         *
         * @since 0.0.1
         */
        setInterval(checkTime, 1000);
    }



    /**
     * Checktime
     * Changes DOM clock time and determines if background needs to be changed in
     * order to represent the day light, sunset/sunrize or night
     *
     * @since 0.0.1
     */
    function checkTime () {
        var mmtTimeConcat = Number(mmt.format('HHmm'));

        /**
         * Draw DOM clock
         */
        clockDom.innerHTML = mmt.format('HH:mm') + '<sup>' + mmt.format('A') + '</sup>';

        /**
         * Change background image based on time
         */
        if (mmtTimeConcat >= sunriseTimeConcat && mmtTimeConcat <= sunriseEndTimeConcat ) {
            // SUNRISE
            html.className = 'bg-sunset';
            return true;
        }
        else if (mmtTimeConcat > sunriseEndTimeConcat && mmtTimeConcat < sunsetTimeConcat ) {
            // FULL DAY
            html.className = 'bg-day';
            return true;
        }
        else if (mmtTimeConcat >= sunsetTimeConcat && mmtTimeConcat <= sunsetEndTimeConcat ) {
            // SUNSET
            html.className = 'bg-sunset';
            return true;
        }
        else {
            // NONE OF THE ABOVE? IT'S NIGHT
            html.className = 'bg-night';
        }
    }



    /**
     * All done let's init
     *
     * @since 0.0.1
     */
    init ();
})();

//# sourceMappingURL=app.js.map
