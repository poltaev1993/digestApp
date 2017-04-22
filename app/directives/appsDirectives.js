metacalendar.directive("metaAppsList", function () {
    return {
        restrict: 'AECM',
        templateUrl: 'directives/appList.html',
        replace: true,
        scope: {
            metaAppsObject: '='
        }
    }
})