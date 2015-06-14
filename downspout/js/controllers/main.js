angular.module('downspout').controller('MainController', ['$scope', '$q', '$sce', function($scope, $q, $sce) {
    var host = 'http://salem.io/sketchbook/downspout';

    // Get the user logged in
    var login = function() {
        return $q(function(resolve, reject) {
            var token = localStorage.getItem('access_token');
            var options = {
                client_id: '38cd5c395a7fe59aa456022eb3131667',
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

    $scope.getLargerAlbumArt = function(url) {
        return url.replace('large', 't500x500');
    }

    $scope.more = function() {
        SC.get($scope.feed.next_href, function(data, error) {
            if (error) {
                console.error(error);
            } else {
                $scope.$apply(function() {
                    $scope.feed.collection = $scope.feed.collection.concat(data.collection);
                    $scope.feed.future_href = data.future_href;
                    $scope.feed.next_href = data.next_href;
                });
            }
        })
    }

    // Make 'er work
    login()
        .then(function() {
            return getUserFeed();
        })
        .then(function(data) {
            $scope.feed = data;
            console.log(data);
        }).catch(console.log.bind(console));
}]);
