// Keep things from happening more often than they should.
var throttle = function(fn, throttle) {
    var timeout = -1;

    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(fn, throttle);
    }
}

// Resize the font to fit the screen.
var resizeFont = function() {
    var $content = $('.resize-me'),
        $measure = $content.find('.measure');

    var target = $('.container').first().width(),
        current = $measure.width(),
        fontSize = parseInt($content.css('font-size'));

    // Don't do anything for mobile.
    if (target < 667) {
        $content.css('font-size', 'inherit');
        return;
    }

    if (current > target * .85) {
        while (current > target * .85) {
            fontSize--;
            $content.css('font-size', fontSize + 'px');
            current = $measure.width();
        }
    } else if (current < target * .75) {
        while (current < target * .75) {
            fontSize++;
            $content.css('font-size', fontSize + 'px');
            current = $measure.width();
        }
    }
};


// Get things started
$(document).ready(function() {
    // So we don't get that pop of red at the beginning
    //$('body').css('background-color', '#E3454D');

    // Fade in the title.
    setTimeout(function() {
        resizeFont();
        $('.fade-in').addClass('done');
    }, 300);

    // Let people know they can scroll.
    setTimeout(function() {
        $('#hello').addClass('done');
    }, 2000);

    $(window)
        .resize(throttle(function() {
            resizeFont();
        }, 80))
        .scroll(function() {
            $('#hello').addClass('done');
            $(this).off('scroll');
        });

});
