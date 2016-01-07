ngApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/podcast-list', {
                templateUrl: 'routes/podcast-list.html',
                controller: 'PodcastListController'
            })
            .when('/:id/episode-list', {
                templateUrl: 'routes/episode-list.html',
                controller: 'EpisodeListController'
            })
            .when('/', {
                templateUrl: 'routes/podcast-list.html',
                controller: 'PodcastListController'
            });

        $locationProvider.html5Mode(false);
    }]);