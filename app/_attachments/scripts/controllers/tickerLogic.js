define(['libraries/jquery', 'libraries/jquery.jticker'], function ($, jticker) {

    var tickerLogic = {};
    tickerLogic.animateText = function(element) {
        //setup ticker for animated text
        element.ticker({
            cursorList: " ",
            rate: 5,
            delay: 1000000
        }).trigger('play').trigger("stop");
    }

    return tickerLogic;
});