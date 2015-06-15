angular.module('downspout', ['plangular', 'ngAnimate', 'ui.unique'])
    .config(function(plangularConfigProvider) {
        plangularConfigProvider.clientId = '2b7f29617f693e9913cb25ca16703473'
    })
    .directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    //call the function that was passed
                    scope.$apply(attrs.imageonload);
                });
            }
        };
    })
    .directive('whenScrolled', function() {
        console.log('whenScrolled');
        var link = function(scope, elm, attr) {
            console.log(elm);
            console.log('attr', attr);
            var raw = elm[0];
            console.log('elm.bind', elm.bind);
            elm.bind('scroll', function() {
                console.log('are we at the bottom?');
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };

        return {
            link: link
        }
    });
