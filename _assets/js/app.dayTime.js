/**
 * Daytime depends on Momment.js library. Please be sure to inlude it at window
 * level.
 *
 * @since 0.0.1
 */
(function() {

    window.srly = window.srly || {};

    /**
     * Global vars
     */
    var mmt;
    var sunSpeed = 10 * 60000; // As in 10 minutes (winter)
    var sunriseTimeUnix, sunsetTimeUnix;
    var sunriseTimeConcat, sunriseEndTimeConcat, sunsetTimeConcat, sunsetEndTimeConcat;



    /**
     * Check if for at a given time, with timezone proided, it's sunrise, sunset or 
     * full light day.
     *
     * @param {string} [timezone] Required
     * @param {string} [sunrise unixtime] Required
     * @param {string} [sunset unixtime] Required
     * @since 0.0.1
     *
     * @return {object} [daytime] containing { sunrise: true/false,
     * sunset: true/false, daylight: true/false, night: true/false}
     */
    window.srly.getDayTime = function(timezone, sunrise, sunset) {

        // Object to be returned
        var daytime = {
            sunrise: false,
            sunset: false,
            daylight: false,
            night: false,
            timezone: timezone
        };

        // Our time class
        mmt = moment();
        if (timezone) {
            mmt.tz(timezone);
        }

        moment().fromNow();
        var mmtTimeConcat = Number(mmt.format('HHmm'));

        if (!sunriseTimeConcat ||
            !sunriseEndTimeConcat ||
            !sunsetTimeConcat ||
            !sunsetEndTimeConcat
        ) {
            // Sunrise
            var sunMoment = moment(sunrise * 1000);
            sunMoment.tz(timezone);
            sunriseTimeConcat = !sunrise ? 600 : Number(sunMoment.format('Hmm'));

            // Sunrise end point
            sunMoment = moment(sunrise * 1000 + sunSpeed);
            sunMoment.tz(timezone);
            sunriseEndTimeConcat = !sunrise ? 610 : Number(sunMoment.format('Hmm'));

            // Sunset
            sunMoment = moment(sunset * 1000);
            sunMoment.tz(timezone);
            sunsetTimeConcat = !sunset ? 1800 : Number(sunMoment.format('Hmm'));

            // Sunset end point
            sunMoment = moment(sunset * 1000 + sunSpeed);
            sunMoment.tz(timezone);
            sunsetEndTimeConcat = !sunset ? 1810 : Number(sunMoment.format('Hmm'));

            sunMoment = null; // Clean it, we're not using it anymore
        }


        /**
         * Combine parameters in a var to return
         */

        if (sunriseTimeConcat <= mmtTimeConcat && mmtTimeConcat <= sunriseEndTimeConcat) {
            daytime.sunset = true;
            daytime.daylight = true;
        } else if (sunriseEndTimeConcat < mmtTimeConcat && mmtTimeConcat < sunsetTimeConcat) {
            daytime.daylight = true;
        } else if (sunsetTimeConcat <= mmtTimeConcat && mmtTimeConcat <= sunsetEndTimeConcat) {
            daytime.sunset = true;
            daytime.daylight = true;
        } else {
            daytime.night = true;
        }

        return daytime;
    };
})();