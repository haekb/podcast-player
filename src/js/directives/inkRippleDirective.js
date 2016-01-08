ngApp.directive('inkRipple', ['$timeout', '$mdInkRipple', function ($timeout, $mdInkRipple) {
    var link = (scope, element, attrs) => {
        var options = attrs.inkRipple || {};

        return $mdInkRipple.attach(scope, element, angular.extend({
            'dimBackground': true,
            'fitRipple': false
        },options));
    };

    return {
        restrict: 'A',
        link: link
    };
}]);