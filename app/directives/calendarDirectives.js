// list of calendars
metacalendar.directive('calendarList', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/calendarList.html',
        transclude: true,
        replace: true,
        scope: {
            calendarObject: '='
        }
    }
});

metacalendar.directive('focusMe', function($timeout){
    return {
        scope: {trigger: '@focusMe'},
        link: function(scope, element){
            scope.$watch('trigger', function(value) {
                console.log(value);
                if (value === 'true') {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    }
});