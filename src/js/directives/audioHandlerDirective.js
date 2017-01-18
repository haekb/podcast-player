ngApp.directive('audioHandler', ['$rootScope', '$timeout', 'timeTrackerFactory', function ($rootScope, $timeout, timeTracker) {
    var link = (scope, element, attrs) => {
        // Debug stuff
        var consolePrefix = "[Audio Handler]";
        scope.audioElement = element.find('audio')[0];
        var storageKey = "TIME-DEFAULT";
        var previousAudioUrl = "";

        console.info(consolePrefix, " started");

        // Init Vars
        scope.audioUrl = "";
        scope.currentTimeModel = 0;
        scope.audioMaxTime = 120;
        scope.pseudoSeeker = 0;

        // TODO: Rename to make more clear...
        // Playback state if you were to click the button
        scope.playbackState = 'play';
        scope.disableControls = true;


        // Internal Functionality
        scope.skipAhead = (amount) => {
            scope.audioElement.currentTime += amount;
        };

        scope.skipPrevious = (amount) => {
            scope.audioElement.currentTime -= amount;
        };

        scope.togglePlayback = () => {
            if (scope.playbackState == 'play') {
                scope.playbackState = 'pause';
                scope.audioElement.play();
            } else {
                scope.playbackState = 'play';
                scope.audioElement.pause();
            }
        };

        scope.stopPlayback = () => {
            scope.playbackState = 'play';
            scope.audioElement.pause();
        };

        scope.$watch('pseudoSeeker', (newValue, oldValue) => {

        });
//
        // Event Handlers
        $rootScope.$on('ah.changeUrl', (event, value) => {
            console.info(consolePrefix, " Event Triggered [ChangeUrl:(", event, ",", value, ")");
            scope.disableControls = true;

            // TODO: Find a more organized way to store the time data
            storageKey = 'TIME-' + value.split('/')[value.split('/').length - 1];


            console.log("Key ", storageKey);

            scope.audioUrl = value;
            scope.playbackState = 'play';
        });

        // Hotkey handler
        $rootScope.$on('hotkeyEvent', (event, value) => {
            if(!scope.disableControls) {
                return;
            }

            switch(value) {
                case 'mediaplaypause':
                    scope.togglePlayback();
                break;
                case 'medianexttrack':
                    scope.skipAhead(10);
                break;
                case 'mediaprevioustrack':
                    scope.skipPrevious(10);
                break;
                case 'mediastop':
                    scope.stopPlayback();
                break;
            }
        });

        // DOM Events
        $(scope.audioElement).on('play pause timeupdate seeking ', () => {
            $timeout(() => {
                scope.currentTimeModel = Math.floor(scope.audioElement.currentTime);
                scope.audioMaxTime = Math.floor(scope.audioElement.duration);
                timeTracker.track(storageKey, scope.currentTimeModel);
            });
        });

        $(scope.audioElement).on('canplay', () => {
            $timeout(() => {
                if(previousAudioUrl === scope.audioUrl) {
                    return;
                }

                console.log("Audio is good to go!");
                previousAudioUrl = scope.audioUrl;

                scope.audioElement.currentTime = timeTracker.restore(storageKey) || 0;
                console.info("PODCAST STORAGE -> ", timeTracker.restore(storageKey));

                scope.disableControls = false;
            });
        });


    };

    return {
        scope: {
            currentTimeModel: '='
        },
        restrict: 'E',
        templateUrl: './directives/audioHandler.html',
        link: link
    };
}]);