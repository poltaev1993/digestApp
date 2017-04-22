/**
 * Created by ruslan.poltayev on 10/11/2016.
 */
metacalendar.service('appsServices', function ($http, $log) {
    var th = this;
    th.apps = [];
    this.getMetaApps = function(callbackFunc){
        $http({
            method: 'GET',
            url: domain + 'metaapps',
        }).then(
            function successCallback(response) {
                th.apps = response.data;
                callbackFunc(response);
            },
            function errorCallback(response) {
                $log.log(response);
                var exceptions = response.data.error.exception;
                _.forEach(exceptions, function (e) {
                    $log.error(e.message);
                })
                alert(response.data.error.message);
            }
        );
    }
});