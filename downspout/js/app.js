var token = localStorage.getItem('access_token');
var host = "http://downspout.dev";

var options = {
  client_id: "2b7f29617f693e9913cb25ca16703473",
  redirect_uri: host + "/callback.html"
};

// Get the user logged in
if (token) {
  // Update options
  options.access_token = token;
  options.scope = "non-expiring"

  // Initialize
  SC.initialize(options);
  getUserFeed();

} else {
  // Initialize
  SC.initialize(options);
  // Log in, get the user's token
  SC.connect(function() {
    localStorage.setItem('access_token', SC.accessToken());
    getUserFeed();
  });
}

// Get that feed.
function getUserFeed() {
  SC.get("/me/activities/tracks/affiliated", function(data, error) {
    if (error) {
      console.log("Error: " + error.message);
    } else {
      console.log("Success!", data);
    }
  });
}
