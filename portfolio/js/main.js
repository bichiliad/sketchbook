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
        $measure;

    var target = $('.container').first().width(),
        current,
        fontSize = parseInt($content.css('font-size'));

    // Initialize
    if (target < 667) {
        $measure = $('.measure-mobile');
    } else {
        $measure = $('.measure');
    }
    current = $measure.width();

    if (current > target * .95) {
        while (current > target * .95) {
            fontSize--;
            $content.css('font-size', fontSize + 'px');
            current = $measure.width();
        }
    } else if (current < target * .90) {
        while (current < target * .90) {
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
