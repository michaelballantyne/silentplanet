define(['libraries/jquery'], function ($) {

    var display = {};
    
    display.delay = 20;
    display.pending = [[]];
    display.current = null;
    display.pendingTick = null;
        
    display.element = function () {
        return $('#displayBox');
    };

    display.clear = function() {
        display.pending = [[]];
        display.element().html('');
    }
    
    display.append = function(text) {
        display.pending.push(text.split(''));
        display.schedule();
    };
    
    display.schedule = function () {
        if (display.pendingTick) {
            clearTimeout(display.pendingTick);
        }
        
        display.pendingTick = setTimeout(display.tick, display.delay);
    };
    
    display.tick = function () {
        if (display.pending.length == 0) {
            return;
        }
        
        if (display.pending[0].length != 0) {
            display.current.append(display.pending[0].shift());
        } else {
            display.pending.shift();
            display.current = $('<p>');
            display.element().append(display.current);
        }
        
        display.schedule()
    }    
    
    return display;
});