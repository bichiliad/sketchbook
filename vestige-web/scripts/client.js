
(function (window, document, $) {

    // Determines if the browser is mobile or not.
    // http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    window.mobilecheck = (function() {
        var check = false;
        (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    })();

    /* Constants */
    var ACTIVE_CLASS    = 'active',
        SECOND_CLASS    = 'second-class', 
        THROTTLE_RATE   = 800,
        HIDE_RATE       = 1000,
        SPLINTER_HEIGHT = 2,
        HEADER_HEIGHT   = 16,
        ACTIVE_HEIGHT   = 28,
        MOUSE_MOVES     = 15, 
        MOUSE_MOVE_TIME = 1000,
        HIDEME_HEIGHT   = 0;

    /* Globals */
    var $player,
        active = 0,
        hidden = false; 

    /* 
     * Stops the video playing, covers it, hides the player.
     * This is to keep from having to animate an iframe.
     */
    var killVideo = function() {
        var $video = $('section.video'),
            $playerFrame = $video.find('iframe'),
            $videoCover = $video.find('.video-cover');
        
        $player.api('pause');
        $videoCover.show();
        $playerFrame.hide();
    };

    /* 
     * Makes the @idx-th element active, and adjusts the 
     * surrounding elements appropriately.
     */
    var updateActive = function(idx, hideHeaders) {
        // Selectors
        var $sections = $('.content section'),
            $active = $sections.eq(idx),
            $prevSecondClass = $active.prev(),
            $nextSecondClass = $active.next();

        // Sanity check, adjust state
        idx = idx % $sections.length;
        active = idx;

        // Update classes
        $sections.removeClass(ACTIVE_CLASS + ' ' + SECOND_CLASS);   // Remove old active/second class
        $sections.removeClass('hideme');                            // Remove old hidden classes
        $active.addClass(ACTIVE_CLASS);                             // Add new active class
        $nextSecondClass.addClass(SECOND_CLASS);                    // Add new second classes
        $prevSecondClass.addClass(SECOND_CLASS);

        // Update hidden sections
        // TODO: find another non-obvious efficient way to get all after/before the immediate 7.
        $nextSecondClass.next().next().next().next().next().nextAll().addClass('hideme');
        $prevSecondClass.prev().prev().prev().prev().prev().prevAll().addClass('hideme');

        // Get headers, hidden, splinters
        var $headers = $sections.filter('.header:not(.' + ACTIVE_CLASS + ', .' + SECOND_CLASS + ')'),
            $hideme = $sections.filter('.hideme:not(.header)'),
            $splinters = $sections.filter(':not(.header, .hideme, .' + ACTIVE_CLASS + ', .' + SECOND_CLASS + ')'),
            activeHeader = $active.hasClass('header'),
            prevHeader = $prevSecondClass.hasClass('header'),
            nextHeader = $nextSecondClass.hasClass('header'),
            siblingTotal = Math.max($active.next().length + $active.prev().length, 1),
            splinterCount = $splinters.length,
            headerCount = $headers.length;

        var activeHeight, secondClassHeight, headerHeight;

        if (!hideHeaders) {

            // Calculate the new heights. 
            secondClassHeight = (100 - (ACTIVE_HEIGHT - 35) - HEADER_HEIGHT*headerCount - SPLINTER_HEIGHT*splinterCount)/2;
            activeHeight = (ACTIVE_HEIGHT - 35)+ (siblingTotal == 1 ? secondClassHeight : 0);
            headerHeight = HEADER_HEIGHT;

        } else {
            var remainder = (headerCount * (HEADER_HEIGHT - SPLINTER_HEIGHT));
            headerHeight = SPLINTER_HEIGHT;
            secondClassHeight = (100 - ACTIVE_HEIGHT - HEADER_HEIGHT*headerCount - SPLINTER_HEIGHT*splinterCount)/2 + (remainder / 3);
            activeHeight = ACTIVE_HEIGHT + (siblingTotal == 1 ? secondClassHeight : 0) + (remainder / 3);
        }

        // Update heights
        $splinters.height(SPLINTER_HEIGHT + '%');           // Splinters
        $splinters.data('next-height', SPLINTER_HEIGHT + '%');

        $headers.height(headerHeight + '%');                // Headers
        $headers.data('next-height', headerHeight + '%');

        $active.height(activeHeight + '%');                 // Active
        $active.data('next-height', activeHeight + '%');

        $nextSecondClass.height(secondClassHeight + '%');   // Second classes
        $nextSecondClass.data('next-height', secondClassHeight + '%');
        $prevSecondClass.height(secondClassHeight + '%');
        $prevSecondClass.data('next-height', secondClassHeight + '%');

        $hideme.height(HIDEME_HEIGHT + '%');                // Hideme
        $hideme.data('next-height', HIDEME_HEIGHT + '%');

        hidden = !!hideHeaders;

        updateTops();
    };

    var updateTops = function() {
        var total = 0;
        $('section').each(function(i, elem) {
            $(elem).css('top', total + '%');
            var percent = $(elem).data('next-height');
            percent = percent.slice(0, percent.length - 1);
            total += parseFloat(percent);
        });
    };


    /* 
     * Let people navigate with arrow keys.
     * Useful for testing.
     */
    var initializeArrowHandlers = function() {
        var $sections = $('.content section');
        // _.throttle prevents key events happening faster than css animations
        var keyhandler = _.throttle(function(e) {
            
            // Pause the video if we're leaving it.
            if ($sections.eq(active).hasClass('.video')) { killVideo(); }

            var newIdx; 
            switch(e.which) {
                case 37: // left
                case 38: // up
                    newIdx = (active - 1 + $sections.length) % $sections.length;
                    fixScroll(newIdx);
                    updateActive(newIdx, true);
                break;

                case 39: // right
                case 40: // down
                    newIdx = (active+1) % $sections.length;
                    fixScroll(newIdx);
                    updateActive(newIdx, true);
                break;

                // Ignore other keys
                default: return; 
            }
            e.preventDefault(); // prevent the default action
        }, THROTTLE_RATE);

        $(document).keydown(keyhandler);
    };


    /* 
     * Fixes page scroll whenever we jump to another section without scrolling.
     */
     var fixScroll = function(idx) {
        var sectionCount = $('section').length,
            scrollHeight = $(document).height() - window.innerHeight,
            sectionPercent = idx/sectionCount,
            scrollTo = Math.round(scrollHeight * sectionPercent);

        $(window).scrollTop(scrollTo);
     };

    /* 
     * Let people set an active element by clicking 
     */
    var initializeClickHandlers = function() {
        $('.content section').click(function() {
            var idx = $(this).data('index');
            fixScroll(idx);
            updateActive(idx);
        });
    };

    /* 
     * Handle scrolling
     */
    var initializeScrollHandler = function() {
        // We can't help fast scrolling, but we can help fast updating. 
        var updateScroll = _.throttle(updateActive, THROTTLE_RATE);

        $(window).scroll(function() {
            var $sections = $('section');

            // Figure out how far the user has scrolled
            var scrollPercent = ($(window).scrollTop() / ($(document).height() - window.innerHeight));

            // Figure out which section should be active
            var newActive = Math.round(scrollPercent * ($sections.length - 1));

            // Update the screen
            updateScroll(newActive, true);
        });
    };

    /* 
     * Handle play/pause video events 
     */
    var initializeVideoHandlers = function() {
        var $video = $('section.video'),
            $playerFrame = $video.find('iframe'),
            $videoCover = $video.find('.video-cover');

        // Make the video appear and play when you click the cover.
        $videoCover.click(function() {
            // Don't do anything if it's not active
            if(!$video.hasClass('active')) {
                return;
            }

            $playerFrame.show();
            $videoCover.fadeOut(1000, function() {
                $player.api('play');
            });
        });
    };

    var triggerPageAction = (function() {
        var timeoutId = -1;
        return function () {
            clearTimeout(timeoutId);
            if (hidden) {
                updateActive(active); 
            }
            timeoutId = setTimeout(function() {
                updateActive(active, true);
            }, HIDE_RATE);
        };
    })();

    /* 
     * Hide titles whenever the mouse hasn't moved in a bit
     */
    var initializeMouseMoveHandler = function() {
        var calls = 0;
        
        var resetCalls = (function() {
            var timeoutId = -1;
            return function() {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    calls = 0;
                }, MOUSE_MOVE_TIME);
            };
        })();


        $('.header').mousemove(function() {
            if( $(this).hasClass('active') || $(this).hasClass('second-class')) {
                return;
            }

            console.log('mousemove');
            resetCalls();
            calls++;
            if (calls >= MOUSE_MOVES) {
                triggerPageAction(); 
            }
        });
    };

    /* 
     * Initialize on page load 
     */
    $(document).ready(function() {

        // Defer showing body 
        setTimeout(function() {
            $('body').fadeIn(500);    
        }, 50);
        

        // Add 'static' class to page on mobile. 
        if ( window.mobilecheck ) {
            $('body').addClass('static');
            return;
        }

        // Hide all but the initial 14 non-header slides.
        $('section.human').addClass('hideme').slice(0,10).removeClass('hideme');

        // Get all sections
        var $sections = $('.content section');
        $sections.each(function(idx, elem) {
            $(elem).data('index', idx);
        });

        // Initialize vimeo player
        $player = $f( $('.video iframe')[0] );
        window.$player = $player;

        // Starting state (always start at first slide)
        $(window).scrollTop(0);
        updateActive(active);

        // Start asynch loading of gifs
        $('img').filter(function(i, elem) { 
            return !!($(elem).attr('data-src')); 
        }).map(function(i, elem) {
            setTimeout(function() {
                var gif = new Image(); 
                gif.onload = function() {
                    $(elem).replaceWith(gif);
                }; 
                gif.src = $(elem).attr('data-src');     
            }, 1000);
        });

        // Bind handlers
        initializeArrowHandlers();
        initializeClickHandlers();
        initializeVideoHandlers();
        initializeScrollHandler();
        initializeMouseMoveHandler();
       
        // Prevent some of the flash of unloaded content.
        console.log('good to go');
    });

})(window, document, jQuery);