ngApp.factory('timeTrackerFactory', function() {

    var track = (key, value) => {
        localStorage.setItem(key, value);
    };

    var restore = (key) => {
        return localStorage.getItem(key);
    };

    return {
        restore: restore,
        track: track
    };
});