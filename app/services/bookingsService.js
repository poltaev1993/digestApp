/**
 * Created by ruslan.poltayev on 27/10/2016.
 */
metacalendar.service('bookingsService', function ($http, $log, localStorageService) {
    this.booking = {};
    this.bookings = [];

    /* Get all bookings */
    this.getBookings = function(calendarId, callbackFunc){
        var localStorageCalendarId = getItem('calendarId'); // getting calendarId variable from localStorage by getItem method.
        if(this.bookings.length == 0 || this.bookings == undefined || localStorageCalendarId != calendarId){ // request data from server if bookings is unidentified
            /* Getting bookings datas by Ajax request */
            $http({
                method: 'GET',
                url: domain + 'calendars/' + calendarId + '/bookings',
            }).then(
                function successCallback(response) {
                    this.bookings = response.data;
                    console.log('successCallback: this.bookings', this.bookings);
                    setItem('calendarId', calendarId);
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
        } else {
            callbackFunc({data: this.bookings});
        }
    }

    /* Insert booking into the metaaps database */
    this.storeBooking = function(bookingObj, userJSON, callbackFunc){
        console.log(domain + 'bookings/add/' + bookingObj + '/' + userJSON);
        $http({
            method: 'POST',
            url: domain + 'bookings/add/' + bookingObj + '/' + userJSON,
        }).then(
            function successCallback(response) {
                this.bookings = response.data;
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

    /* Insert booking into the metaaps database */
    this.storeChanges = function(bookingObj, callbackFunc){
        $http({
            method: 'POST',
            url: domain + 'bookings/edit/' + bookingObj,
        }).then(
            function successCallback(response) {
                this.bookings = response.data;
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

    /* Insert booking into the metaaps database */
    this.removeBook = function(bookingId, callbackFunc){
        $http({
            method: 'Delete',
            url: domain + 'bookings/remove/' + bookingId,
        }).then(
            function successCallback(response) {
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

    // Tied users manipulations
    this.updateBookingUsers = function(booking_id, userObj, callbackFunc){
        $http({
            method: 'POST',
            url: domain + 'bookings/book-user-add/' + booking_id + "/" + userObj
        }).then(
            function successCallback(response) {
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

    /* Set item to the localStorageService */
    function setItem(key, val) {
        return localStorageService.set(key, val);
    }
    /* Get item to the localStorageService */
    function getItem(key) {
        return localStorageService.get(key);
    }
});