angular.module('downspout', ['plangular', 'ngAnimate', 'ui.unique'])
    .config(function(plangularConfigProvider) {
        plangularConfigProvider.clientId = '2b7f29617f693e9913cb25ca16703473';
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
    });
