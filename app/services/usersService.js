/**
 * Created by ruslan.poltayev on 26/10/2016.
 */
metacalendar.service('usersService', function ($http, $log, localStorageService) {
    this.user = {};
    this.users = [];

    this.user = getItem('loggedUser');
    if(this.user ) this.isLogged = false;

    this.getUsers = function(callbackFunc){
        if(this.users.length == 0 || this.users == undefined){ // request data from server if bookings is unidentified
            $http({
                method: 'GET',
                url: domain + 'users',
            }).then(
                function successCallback(response) {
                    this.users = response.data;
                    callbackFunc(response);
                },
                function errorCallback(response) {
                    var exceptions = response.data.error.exception;
                    $log.log(response);
                    _.forEach(exceptions, function (e) {
                        $log.error(e.message);
                    })
                    alert(response.data.error.message);
                }
            );
        } else {
            callbackFunc({data: this.users});
        }
    }

    this.login = function (userJson, callbackFunc){
        $http({
            method: 'POST',
            url: domain + 'users/auth/' + userJson
        }).then(
            function successCallback(response) {
                setItem("loggedUser", response.data.user);
                this.user = getItem("loggedUser");
                console.log(this.user);
                callbackFunc(response);
            },
            function errorCallback(response){
                var exceptions = response.data.error.exception;
                $log.log(response);
                _.forEach(exceptions, function (e) {
                    $log.error(e.message);
                });
                alert(response.data.error.message);
                callbackFunc(response);
            }
        );
    }

    this.register = function (newUserJson, callbackFunc){
        $http({
            method: 'POST',
            url: domain + 'users/login/' + newUserJson
        }).then(
            function successCallback(response) {
                console.log(response);
                callbackFunc(response);
            },
            function errorCallback(response){
                $log.log(response);
                console.log(response.data);
                var exceptions = response.data.error.exception;
                _.forEach(exceptions, function (e) {
                    $log.error(e.message);
                });
                callbackFunc(response);
                alert(response.data.error.message);
            }
        );
    }

    this.updateUser = function (userObj, callbackFunc) {
        $http({
            method: 'POST',
            url: domain + 'users/update/' + userObj
        }).then(
            function successCallback(response) {
                console.log(response);
                callbackFunc(response);
            },
            function errorCallback(response){
                $log.log(response);
                console.log(response.data);
                var exceptions = response.data.error.exception;
                _.forEach(exceptions, function (e) {
                    $log.error(e.message);
                });
                callbackFunc(response);
                alert(response.data.error.message);
            }
        );
    }

    /* Obtain user's datas from external application by using url*/
    this.obtainDatasExternalAppByApiUrl = function(apiUrl, callbackFunc){
        $http({
            method: 'GET',
            url: apiUrl,
        }).then(
            function successCallback(response) {
                console.log(response);
                callbackFunc(response);
            },
            function errorCallback(response){
                $log.log(response);
                console.log(response.data);
                var exceptions = response.data.error.exception;
                _.forEach(exceptions, function (e) {
                    $log.error(e.message);
                });
                callbackFunc(response);
                alert(response.data.error.message);
            }
        );
    }

    /* Synchronization user's datas with external datas */
    this.synchronizeDatasWithExternalApp = function(userObj, callbackFunc){
        $http({
            method: 'POST',
            url: domain + 'users/update/' + userObj
        }).then(
            function successCallback(response) {
                console.log(response);
                callbackFunc(response);
            },
            function errorCallback(response){
                $log.log(response);
                console.log(response.data);
                var exceptions = response.data.error.exception;
                _.forEach(exceptions, function (e) {
                    $log.error(e.message);
                });
                callbackFunc(response);
                alert(response.data.error.message);
            }
        );
    }

    /* Set item to the localStorageService */
    function setItem(key, val) {
        return localStorageService.set(key, val);
    }
    /* Get item to the localStorageService */
    function getItem(key) {
        return localStorageService.get(key);
    }
});