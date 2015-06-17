angular.module('downspout').controller('TrackController', ['$scope', function($scope) {

    /*
     * Given an artwork URL, spits out the url for the full sized image
     */
    $scope.getLargerAlbumArt = function() {
        var url = $scope.track.artwork_url || $scope.track.user.avatar_url;
        if (!url) {
            // TODO: Need better default image.
            return "http://placehold.it/500x500"
        }
        return url.replace('large', 't500x500');
    };

    /*
     * Given a timestamp, spit out a human readable time
     * TODO: Get rid of time argument
     */
    $scope.timestamp = function(time) {
        return moment(new Date("2015/06/16 12:56:33 +0000")).fromNow();
    }

    /*
     * What's the download URL of this track, if any?
     * TODO: Get rid of track argument
     */
    $scope.downloadUrl = function(track) {

        if (!$scope.track
            || (!$scope.filters.mixes && $scope.track.duration / 1000 / 60) > 12
        ) {
            return "";
        }

        var purchaseTitle = $scope.track.purchase_title,
            purchaseUrl = $scope.track.purchase_url;

        if ($scope.track.downloadable) {
            return $scope.track.permalink_url + "/download";
        }

        if (purchaseTitle && !!purchaseTitle.toLowerCase().trim().match("free|download")) {
            return purchaseUrl;
        }

        return "";
    }

}]);
