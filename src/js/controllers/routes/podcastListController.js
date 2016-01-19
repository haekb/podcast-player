ngApp.controller('PodcastListController', [
    '$scope',
    '$rootScope',
    '$http',
    'x2js',
    '$mdDialog',
    '$timeout',
    'podcastService',
    '$location',
    PodcastListController]);

function PodcastListController($scope,
                               $rootScope,
                               $http,
                               x2js,
                               $mdDialog,
                               $timeout,
                               podcastService,
                               $location) {
    var init = () => {
        console.info("PodcastListController Init");


        $scope.podcastList = JSON.parse(localStorage.getItem('podcasts')) || [];
        $scope.podcastUrl = "test dude";
        $scope.events = [];

        console.info("Podcast List -> ",$scope.podcastList);

        $scope.events.push($rootScope.$on('podcast.subscribe', (event, data) => {
            console.info("[Podcast.Subscribe]", data);
            podcastService.subscribe(data).then((resp) => {
               $scope.podcastList.push(resp);
            });
        }));

        $scope.$on('$destroy', () => {
           _.each($scope.events, (event, index) => {
               console.log("Destroying any events",index);
               event();
           });
        });

        // Cheap and easy hierarchical timing, note that this doesn't work for rows..yet!
        $timeout(() => {
            _.forEach($('.tile-animate'), (item, index) => {
               $timeout(() => {
                   $(item).addClass('ng-enter-active');
               }, 100 * index);
            });
        },200);

        /*
        Junk test data, for eventual nodejs integration with angular

        ipcRenderer.on('test', (event, arg) => {
            console.log("Event found", arg);
            $scope.URL_PREFIX = arg;
        });


        ipcRenderer.send('test', 'readydawf');
        */
    };

    $scope.changeRoute = (path) => {
        console.log("Path -> ", path);
        $location.path(path);
    };

    $scope.loadPodcast = (podcast) => {
        $timeout(() => {
        console.log("Loading Podcast", podcast.title);
        $location.path(podcast.id + '/episode-list/');
        },300);
    };

    $scope.showAddDialog = function ($event) {
        $mdDialog.show({
            targetEvent: $event,
            templateUrl: 'templates/addPodcastDialog.html',
            controller: 'AddPodcastDialogController'
        });
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

    $scope.fetchPodcast = () => {
        $http.get($scope.podcastUrl).then((resp) => {
            console.info("Podcast Response -> ", resp);


            var json = x2js.xml_str2json(resp.data);

            $scope.podcastData = json;

            // fixme: temp
            for (var i = 0; i < 10; i++) {
                $scope.podcastItems.push(json.rss.channel.item[i]);
            }

            //$scope.podcastItems = json.rss.channel.item;


            console.log("JSON Array -> ", json, $scope.podcastItems);


            console.info("Home Controller, sending off change url event");

        });
    };


    console.info("PodcastListController Function Ran");
    init();
}

