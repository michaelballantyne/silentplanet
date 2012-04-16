define(['libraries/jquery', 'libraries/jquery.jticker'], function ($) {

    var display = {};
    
    display.text = "";
        
    display.element = function () {
        return $('#tickerBox');
    };
    
    display.animateText = function(element) {
        //setup ticker for animated text
        element.ticker({
            cursorList: " ",
            rate: 6,
            delay: 1000000
        }).trigger('play').trigger("stop");
    };
    
    display.clear = function() {
        display.text = "";
        return display
    }
    
    display.append = function(text) {
        display.text += "<p>" + text + "</p>";
        
        return display;
    };
    
    display.animate = function() {
        $('#tickerBox').html(display.text);
        display.animateText($('#displayBox'));
    }
    
    return display;
});