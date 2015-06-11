angular.module('downspout').controller('MainController', ['$scope', '$q', function($scope, $q) {
  var host = 'http://downspout.dev';



  // Get the user logged in
  var logIn = function() {
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
          } catch ( error ) {
            reject(error);
          }
        };

      }
    });
  };

  // Get that feed.
  var getUserFeed = function() {
    return $q(function(resolve, reject) {
      SC.get("/me/activities/tracks/affiliated", function(data, error) {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  // Make 'er work
  logIn()
    .then(function() {
      return getUserFeed();
    })
    .then(function(data) {
      console.log(data);
    }).catch(console.log.bind(console));
}]);
