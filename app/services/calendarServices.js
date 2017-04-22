/**
 * Created by ruslan.poltayev on 26/10/2016.
 */
metacalendar.service('calendarsService', function ($http, localStorageService, $log) {
    this.calendar = {};
    this.calendars = [];

    /* GET ALL CALENDATS */
    this.obtainCalendars = function(callbackFunc){
        console.log(getItem('loggedUser'));
        if(this.calendars.length == 0 || this.calendars == undefined){ // request data from server if bookings is unidentified
            $http({
                method: 'GET',
                url: domain + 'calendars',
            }).then(
                function successCallback(response) {
                    this.calendars = response.data;
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
        }
    }

    /* GET AVAILABLE CALENDARS */
    this.obtainAvailableCalendars = function (userId, callbackFunc) {
        console.log(getItem('loggedUser'));
        if(this.calendars.length == 0 || this.calendars == undefined){ // request data from server if bookings is unidentified
            $http({
                method: 'GET',
                url: domain + 'available-calendars/' + userId
            }).then(
                function successCallback(response) {
                    this.calendars = response.data;
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
        }
    }

    /* CREATE NEW CALENDAR */
    this.postCalendar = function (calendarObj, callbackFunc) { // POST for add new calendar
        $http({
            method: 'POST',
            url: domain + 'calendars/add/' + calendarObj
        }).then(
            function successCallback(response) {
                console.log('success', response);
                callbackFunc(response);
            },
            function errorCallback(response) {
                var exceptions = response.data.error.exception;
                $log.log(response);
                _.forEach(exceptions, function (e) {
                    $log.error(e.message);
                })
                alert(response.data.error.message);
                callbackFunc(response);
            }
        )
    }

    /* REMOVE SPECIFIC CALENDAR */
    this.removeCalendar = function (calendarId, callbackFunc){
        $http({
            method: 'DELETE',
            url: domain + 'calendars/remove/' + calendarId
        }).then(
            function successCallback(response) {
                console.log('success', response);
                callbackFunc(response);
            },
            function errorCallback(response) {
                var exceptions = response.data.error.exception;
                $log.log(response);
                _.forEach(exceptions, function (e) {
                    $log.error(e.message);
                })
                alert(response.data.error.message);
                callbackFunc(response);
            }
        )
    }

    this.getCalendars = function () {
        return this.calendars;
    }

    this.setCalendars = function(calendars){
        this.calendars = calendars;
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