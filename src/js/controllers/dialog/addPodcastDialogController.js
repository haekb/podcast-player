ngApp.controller('AddPodcastDialogController', ['$scope', '$http', 'x2js', '$mdDialog', '$timeout', '$location', addPodcastDialogController]);

function addPodcastDialogController($scope, $http, x2js, $mdDialog, $timeout, $location) {
    var init = () => {
        console.info("addPodcastDialogController Init");

        $scope.podcastUrl = '';

    };

    $scope.add = () => {
        console.log($scope);
        $scope.$emit('podcast.subscribe', $scope.podcastUrl);
    };

    $scope.close = () => {
        $mdDialog.hide();
    };

    console.info("addPodcastDialogController Function Ran");
    init();
}

