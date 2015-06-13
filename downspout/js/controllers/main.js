angular.module('downspout').controller('MainController', ['$scope', '$q', '$sce', function($scope, $q, $sce) {
    var host = 'http://downspout.dev';

    // Get the user logged in
    var login = function() {
        return $q(function(resolve, reject) {
            var token = localStorage.getItem('access_token');
            var options = {
                client_id: '2b7f29617f693e9913cb25ca16703473',
                redirect_uri: host + '/callback.html'
            };

            if (token) {
                // Update options
                options.access_token = token;
                options.scope = "non-expiring"

                // Initialize
                SC.initialize(options);
                resolve();

            } else {
                // Initialize
                SC.initialize(options);

                // Log in, get the user's token
                // http://stackoverflow.com/questions/18702870/how-to-handle-soundcloud-oauth2-error
                var dialog = SC.connect(function() {
                    localStorage.setItem('access_token', SC.accessToken());
                    resolve();
                });

                var originalCallback = dialog.options.callback;
                dialog.options.callback = function() {
                    try {
                        originalCallback.apply(this, arguments);
                    } catch (error) {
                        reject(error);
                    }
                };

            }
        });
    };

    // Get that feed.
    var getUserFeed = function(url) {
        var url = url || "/me/activities/tracks/affiliated?limit=50";
        return $q(function(resolve, reject) {
            SC.get(url, function(data, error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    };

    // Check for feed updates
    var updateFeed = function(futureUrl) {
        SC.get(futureUrl, function(data, error) {
            if (error) {
                console.error(error);
            } else {
                $scope.$apply(function() {
                    $scope.feed.collection = data.collection.concat($scope.feed.collection);
                });
            }
        });
    }

    // Make 'er work
    login()
        .then(function() {
            return getUserFeed();
        })
        .then(function(data) {
            $scope.feed = data;

            angular.forEach($scope.feed.collection, function(track) {
                SC.oEmbed(track.origin.permalink_url, {
                    maxheight: 150,
                }, function(oEmbed) {
                    console.log("oembed for " + track.origin.title, oEmbed);
                    $scope.$apply(function() {
                        console.log('application goin on ');
                        track.oEmbed = oEmbed;
                        track.oEmbed.html = $sce.trustAsHtml(track.oEmbed.html)
                    });
                });
            });
            console.log(data);
            // setInterval(function() {
            //     updateFeed(data.future_href);
            // }, 1000)

            // SC.get('https://api.soundcloud.com/tracks/210168386', function(data, error) {
            //     if (error) {
            //         console.error(error);
            //     } else {
            //         console.log('track', data);
            //     }
            // });
        }).catch(console.log.bind(console));
}]);
