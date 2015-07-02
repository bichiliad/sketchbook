var timeout = -1;
var resizeFont = function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        var $content = $('#content'),
            target = $(window).width(),
            current = $('.measure').width(),
            fontSize = parseInt($content.css('font-size'));

        if (current > target * .85) {
            while (current > target * .85) {
                fontSize--;
                $content.css('font-size', fontSize + 'px');
                current = $('.measure').width();
            }
        } else if (current < target * .75) {
            while (current < target * .75) {
                fontSize++;
                $content.css('font-size', fontSize + 'px');
                current = $('.measure').width();
                console.log('unmeasure', current);
            }
        }
    }, 100);

}


$(window).ready(function() {

    resizeFont();
    setTimeout(function() {
        $('.fade-in').animate({
            'opacity': 1
        }, 200);
    }, 300);

    $(window).resize(resizeFont);

});
