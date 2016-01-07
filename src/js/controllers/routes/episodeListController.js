ngApp.controller('EpisodeListController', ['$scope', '$http', 'podcastService', '$routeParams', '$timeout', '$location', EpisodeListController]);

function EpisodeListController($scope, $http, podcastService, $routeParams, $timeout, $location) {
    var init = () => {
        console.info("EpisodeListController Controller Init");


        $scope.podcastUrl = 'http://www.giantbomb.com/podcast-xml/giant-bombcast';
        $scope.podcastData = {};
        $scope.podcastItems = [];

        console.log("Route Params -> ", $routeParams.id);

        $scope.id = $routeParams.id;

        console.log("Podcast ID ", $scope.id);

        var podcasts = JSON.parse(localStorage.getItem('podcasts'));

        // oh god
        $scope.loadPodcast(_.find(podcasts, (item) => {
            if (item.id == $scope.id) return item;
        }));

        console.log("Data", $scope.podcastData);

        //$scope.loadPodcast($scope.podcastData);
    };

    $scope.changeRoute = (path) => {
        console.log("Path -> ", path);
        $location.path(path);
    };

    $scope.loadPodcast = (item) => {

        $timeout(() => {
            $scope.podcastData = item;
            $scope.podcastItems = item.items;
        });
    };

    $scope.refresh = () => {
        podcastService.subscribe($scope.podcastData.url).then((item) => {
            $scope.loadPodcast(item);
        }).catch((item) => {
            console.warn("Failed to refresh podcast!!");
        })
    };

    $scope.changeUrl = (item) => {
        try {
            var url = item.enclosure._url;
        } catch (e) {
            console.warn("Couldn't get enclosure, falling back to url");
            var url = item.link;
        }
        $scope.$emit('ah.changeUrl', url);
    };
    console.info("EpisodeListController Controller Function Ran");
    init();
}

