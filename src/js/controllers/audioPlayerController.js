ngApp.controller('audioPlayerController', ['$scope', '$http', '$timeout', audioPlayerController]);

function audioPlayerController($scope, $http, $timeout) {
    var init = () => {
        console.info("Audio Player Controller Init");

        $scope.currentTime = 10;

    };
    init();
}

