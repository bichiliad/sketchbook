angular.module('downspout').controller('MainController', ['$scope', '$q', '$sce', '$window', function($scope, $q, $sce, $window) {
    var host = 'http://salem.io/sketchbook/downspout',
        infiniteScrollRange = 400;

    $scope.loggedIn = false; // Is the user currently logged in?
    $scope.promptLogIn = false; // Should we show the login view?
    $scope.filters = { // How should we filter the stream?
        mixes: true,
        downloadOnly: true
    }

    /*
     * Look for changes in any of the filters
     */
    $scope.$watch('filters', function() {
        console.log('triggering check');
        setTimeout(function() { // Wait for animations to finish
            if (window.pageYOffset + window.innerHeight >= document.body.clientHeight - infiniteScrollRange) {
                $scope.more();
            }
        }, 600);
    }, true);


    /*
     * Get the logged in user
     */
    var checkLogin = function() {
        var token = localStorage.getItem('access_token');
        var options = {
            client_id: '38cd5c395a7fe59aa456022eb3131667',
            redirect_uri: host + '/callback.html'
        };

        // Update options if we have the token
        if (token) {
            options.access_token = token;
            options.scope = "non-expiring"
        }

        // Initialize
        SC.initialize(options);

        $scope.loggedIn = !!token;
        $scope.promptLogIn = !token;

        return !!token;
    };


    /*
     * Prompt user to log in via soundcloud.
     */
    var login = function() {
        return $q(function(resolve, reject) {
            if ($scope.loggedIn) {
                resolve();
                return
            }

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
        })
    }

    $scope.logout = function() {
        localStorage.removeItem('access_token');
        SC.accessToken('');
        $scope.loggedIn = false;
        $scope.promptLogIn = true;
        window.location = "";
    }

    /*
     * Gets the user's current feed
     */
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
    };

    var initializeInfiniteScroll = function() {
        var elem = angular.element(document);
        elem.bind('scroll', function() {
            if (window.pageYOffset + window.innerHeight >= document.body.clientHeight - infiniteScrollRange) {
                $scope.more();
            }
        });
    };

    // Loads more tracks.
    $scope.more = _.throttle(function() {
        if (!$scope.feed) {
            return;
        }

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
    }, 300);


    // Make 'er work
    $scope.start = function() {
        login()
            .then(function() {
                return getUserFeed();
            })
            .then(function(data) {
                $scope.$watch(function() {
                    $scope.feed = data;
                    initializeInfiniteScroll();
                    $scope.loggedIn = true;
                    $scope.promptLogIn = false;
                });
            }).catch(console.log.bind(console));
    }
    //
    // $scope.showTrack = function(track) {
    //     return true &&
    //         ($scope.filters.mixes || (track.duration / 1000 / 60) < 12) &&
    //         (!$scope.filters.downloadOnly || (track.downloadUrl() !== ""));
    // }

    if (checkLogin()) {
        $scope.start();
    }


}]);
