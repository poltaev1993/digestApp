// Declare app level module which depends on views, and components
var metacalendar = angular.module('metacalendar', [
  'ngRoute',
  'ngAnimate',
  'pascalprecht.translate',
  'ngCookies',
  'ui.select',

  'metacalendar.mainPageModule',
  'metacalendar.mainModule',
  'metacalendar.indexModule',
  'metacalendar.calendarModule',
  'metacalendar.authModule',
  'metacalendar.registrationModule',
  'metacalendar.profileModule',
  'metacalendar.metafichadaModule',
  'metacalendar.version',

  'LocalStorageModule',
],

function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}).

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/index'});
}]);

metacalendar.config(['$translateProvider', '$httpProvider', function($translateProvider, $httpProvider) {
  $translateProvider
      .useStaticFilesLoader({
        prefix: './translations/',
        suffix: '.json'
      })
      .preferredLanguage('es')
      .useLocalStorage()
      .useMissingTranslationHandlerLog();
  $translateProvider.forceAsyncReload(true);

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

metacalendar.run(['$rootScope', '$translate', function($rootScope, $translate) {
  $rootScope.lang = $translate.proposedLanguage();

  $rootScope.default_float = 'left';
  $rootScope.opposite_float = 'right';

  $rootScope.default_direction = 'ltr';
  $rootScope.opposite_direction = 'rtl';
}])

'use strict';

var domain = 'http://rest.dev/app_dev.php/';
/**
 * Created by ruslan.poltayev on 26/10/2016.
 */
metacalendar.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'controllers/main_page/main.html',
            controller: 'MainPageCtrl'
        })

        .when('/synchronize', {
            templateUrl: 'controllers/metafichada/metafichada.html',
            controller: 'MetafichadaCtrl'
        })

        .when('/auth', {
            templateUrl: 'controllers/auth/auth.html',
            controller: 'AuthCtrl'
        })

        .when('/registration', {
            templateUrl: 'controllers/registration/registration.html',
            controller: 'RegistrationCtrl'
        })

        .when('/profile', {
            templateUrl: 'controllers/profile/profile.html',
            controller: 'ProfileCtrl'
        })

        .when('/calendar-list', {
            templateUrl: 'controllers/index/index.html',
            controller: 'IndexCtrl'
        })

        .when('/calendar/:calendarId', {
            templateUrl: 'controllers/calendar/calendarPage.html',
            controller: 'CalendarCtrl'
        });
}])
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

/**
 * Created by ruslan.poltayev on 03/11/2016.
 */
'use strict';

var mainModule = angular.module('metacalendar.mainModule', ['ngRoute', 'ngMessages', 'pascalprecht.translate', 'ngAnimate'])

.controller('MainController', ['$scope', '$http', '$log', 'usersService', 'calendarsService', 'localStorageService', '$location', '$translate', '$rootScope',
    function($scope, $http, $log, usersService, calendarsService, localStorageService, $location, $translate, $rootScope) {

    var vm = $scope;
    vm.selectedLang = $rootScope.lang;
    vm.languages = ['es', 'en', 'ru'];

    vm.isLogged = false;
    vm.user = usersService.user;
    vm.rootVars = {
        isContentReady: false,
        location: $location.url()
    };

    if(vm.user) vm.isLogged = true;

    vm.init = function(){
        vm.isContentReady = false;
    }
    /* Watching for changing variables */
    vm.$watch('user', function () { /* watching for vm.calendars value */
        usersService.user = vm.user; /* calendar service change on on watch */
    });
    
    vm.logout = function () {
        setItem("loggedUser", null);
        calendarsService.setCalendars([]);
        vm.isLogged = false;
        $location.path('/auth');
    }

    vm.changeLanguage = function(langKey) {
        $translate.use(langKey);
    };

    $rootScope.$on('$translateChangeSuccess', function(event, data) {
        var language = data.language;

        $rootScope.lang = language;

        $rootScope.default_direction = language === 'es' ? 'rtl' : 'ltr';
        $rootScope.opposite_direction = language === 'es' ? 'ltr' : 'rtl';

        $rootScope.default_float = language === 'es' ? 'right' : 'left';
        $rootScope.opposite_float = language === 'es' ? 'left' : 'right';
    });

    /* Set item to the localStorageService */
    function setItem(key, val) {
        return localStorageService.set(key, val);
    }
    /* Get item to the localStorageService */
    function getItem(key) {
        return localStorageService.get(key);
    }


}]);
/**
 * Created by ruslan.poltayev on 03/11/2016.
 */
'use strict';

angular.module('metacalendar.authModule', ['ngRoute', 'ngAnimate'])

.controller('AuthCtrl', ['$scope', '$http', '$log', 'usersService', '$location',
    function($scope, $http, $log, usersService, $location) {
    var vm = $scope;

    vm.authenticate = function () {
        var obj = {
            username: vm.username,
            password: vm.password
        };
        var json = JSON.stringify(obj);

        usersService.login(json, function(response) { // authentication
            vm.$parent.user = response.data.user;
            if (vm.$parent.user != null){
                vm.$parent.isLogged = true;
            }
            if(response.data.error != null){
                alert(response.data.message);
            } else {
                $location.path('/');
            }

        });
    }
}]);
'use strict';

angular.module('metacalendar.calendarModule', ['ngRoute', 'ui.calendar', 'ui.bootstrap', 'ngAnimate', 'ui.select', 'ngSanitize'])

.controller('CalendarCtrl', ['$scope', 'calendarsService', 'usersService', 'bookingsService', '$routeParams', 'uiCalendarConfig',
'$location', '$filter',
    function($scope, calendarsService, usersService, bookingsService, $routeParams, uiCalendarConfig, $location, $filter) {
        var vm = $scope; // scope simplify variable
        vm.pageProperties = {
            IsDayWithEvent: false,
            IsSaveUserButtonVisible: false,
            usersSaved: false,
            oldSelected: []

        };
        vm.calendars = [];

        vm.users = [];
        vm.disabled = undefined;
        vm.selectedUsers = [];

        /* Logged user */
        vm.parentUser = {
            id: -1
        }
        if (vm.$parent.user != null){
            vm.parentUser.id = vm.$parent.user.id;
        }
        vm.busyTime = false;

        vm.bookingWindowStyles = {};

        /* Timepicker */
        vm.bookingStartTime = null; // booking time
        vm.bookingEndTime = null;
        vm.hstep = 1; // changing hour step
        vm.mstep = 15; // changing minutes step
        vm.ismeridian = false; // am | pm
        vm.clickedBooking;
        /* Start Datepicker */
        vm.today = function() {
             return new Date();
        };
        vm.sDate = vm.today();
        vm.eDate = vm.today();
        vm.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };
        vm.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        vm.toggleMin = function() {
            vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
            vm.dateOptions.minDate = vm.inlineOptions.minDate;
        };
        vm.toggleMin();

        vm.start_date_popup = {
            opened: false
        };
        vm.end_date_popup = {
            opened: false
        };
        vm.showDatePopup = function(popup) {
            popup.opened = true;
        };

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];
        vm.altInputFormats = ['M!/d!/yyyy'];
        /* End Datepicker */

        /* Popup variables */
        vm.popupAppearence = false; // a popup appearence
        vm.IsBookNameFilled = false;
        vm.IsBookDescrFilled = false;
        vm.tempBookingDatas = {};

        vm.init = function(){
            vm.calendar = {
                id: -1,
                calendar_name: 'Proccessing...',
                calendar_type: 'Proccessing...'
            }

            if(vm.calendars != undefined || vm.calendars.length != 0){
                vm.calendar = getObjectById(vm.calendars, +$routeParams.calendarId);
                vm.selectedCalendar = vm.calendar;
            }

        }

        /* Init calendars, bookings and users objects */
        vm.calendars = calendarsService.calendars;
        vm.bookings = bookingsService.bookings;
        vm.users = usersService.users;

        /* Watching for changing variables */
        vm.$watch(['calendars', 'bookings', 'users'], function () { /* watching for vm.calendars value */
            calendarsService.calendars = vm.calendars; /* calendar service change on on watch */
            bookingsService.bookings = vm.bookings; /* bookings service change on on watch */
            usersService.users = vm.users; /* users service change on on watch */
        });


        /* Calendars initialization */
        calendarsService.obtainAvailableCalendars(vm.parentUser.id, function(response){
            vm.calendars = response.data;
            // search object by id
            var obj = getObjectById(vm.calendars, +$routeParams.calendarId);
            vm.calendar = obj;

            vm.selectedCalendar = vm.calendar;
        }); // get list of calendars



        /* get Users */
        usersService.getUsers(function (response) {
            vm.users = response.data;
        });

        vm.bookings = [];
        vm.eventSources = [vm.bookings];
        /* Bookings initialization */
        bookingsService.getBookings($routeParams.calendarId, function (response) {
            vm.events = response.data;
            _.forEach(vm.events, function(item) {
                vm.bookings.push(
                    {
                        id: item.id,
                        user_id: item.user_id,
                        calendar_id: item.calendar_id,
                        title: item.title,
                        description: item.description,
                        start: item.start,
                        users: item.users,
                        end: item.end,
                        bookingName: item.bookingName,
                        bookingDesc: item.bookingDesc,
                        stick: item.stick,
                        active: item.active,
                        createdAt: item.createdAt,
                    }
                );
            });

            console.log(vm.bookings);
        }); // get list of calendars

        /* config object */
        vm.uiConfig = {
            calendar:{
                height: 400,
                editable: true,
                eventDurationEditable: true,
                businessHours:{
                    start: '9:00', // a start time (10am in this example)
                    end: '18:00', // an end time (6pm in this example)
                    dow: [ 1, 2, 3, 4, 5]
                },
                header:{
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.showPopupEventOnClick = function($event, event){
                    var temp_user = $filter('filter')(vm.users, {id: $event.user_id})[0]; // getting username by filtering
                    vm.created_by_username = temp_user.name;

                    vm.busyTime = true;
                    vm.pageProperties.IsDayWithEvent = true; // show save users button
                    vm.pageProperties.usersSaved = false;

                    console.log('$event', $event);
                    var x = event.clientX; // a mouse event pos x
                    var y = event.clientY; // a mouse event pos y
                    vm.bookingWindowStyles = {
                        'top': y,
                        'left': x
                    }
                    vm.popupAppearence = true; // show popup window
                    vm.clickedBooking = $event;
                    vm.event_id = $event.id;
                    vm.bookingIndex = $event._id
                    vm.bookName = $event.title;
                    vm.bookDescr = $event.description;
                    vm.sDate = new Date($event.start);
                    console.log(vm.sDate);
                    vm.eDate = new Date($event.end);
                    // vm.bookingStartTime = new Date($event.start);
                    vm.bookingStartTime = new Date($event.start);
                    vm.bookingEndTime = new Date($event.end);
                    vm.selectedUsers = $event.users;
                    console.log('vm.selectedUsers', vm.selectedUsers);


                    vm.IsBookNameFilled = true;
                    vm.IsBookDescrFilled = true;

                    console.log($event);
                },
                eventDrop: $scope.updateOnDrop = function($event) {
                    var temp_index = _.findIndex(vm.bookings, { 'id': $event.id}); // find object index in bookings array
                    var bookingTempObj = vm.bookings[temp_index];
                    bookingTempObj.start = moment($event.start).format(); // refresh start
                    bookingTempObj.end = moment($event.end).format(); // refresh end
                    console.log(bookingTempObj);

                    var json = JSON.stringify(bookingTempObj); // convert to json

                    bookingsService.storeChanges(json, function (response) {
                        bookingTempObj.title = response.data.title;
                        bookingTempObj.description = response.data.description;
                        bookingTempObj.start = response.data.start;
                        bookingTempObj.end = response.data.end;
                        console.log(response);
                    });
                },
                eventResize: $scope.alertOnResize = function () {
                    console.log('lol2');
                },
                dayClick: $scope.bookingProccess = function($event, event){
                    vm.busyTime = false;
                    vm.pageProperties.IsDayWithEvent = false; // Hide saving users button
                    vm.pageProperties.usersSaved = false;

                    var time = $event;
                    var x = event.clientX; // a mouse event pos x
                    var y = event.clientY; // a mouse event pos y
                    vm.bookingWindowStyles = {
                        'top': y,
                        'left': x
                    }
                    vm.popupAppearence = true;

                    vm.bookName = null;
                    vm.bookDescr = null;
                    /* Start and end date */

                    console.log(time);
                    vm.sDate = new Date(time);
                    vm.eDate = new Date(time);

                    /* Start and end time*/
                    vm.bookingStartTime = new Date(time); // booking time
                    vm.bookingEndTime = new Date(time);

                    vm.selectedUsers = [];

                    vm.IsBookNameFilled = false;
                    vm.IsBookDescrFilled = false;
                }
            }
        };

        // Storing selected users
        vm.storeSelectedUsers = function(selectedUsers){
            vm.selectedUsers = selectedUsers;
            if(vm.pageProperties.IsDayWithEvent){
                vm.pageProperties.IsSaveUserButtonVisible = true;
            }
        }

        /* Book action */
        vm.book = function(){
            vm.IsBookNameFilled = false;
            vm.IsBookDescrFilled = false;

            var bookingTempObj = {  // PREPARE SENDING OBJECT
                user_id: vm.parentUser.id,
                calendar_id: vm.calendar.id,
                title: vm.bookName,
                description: vm.bookDescr,
                start: moment(vm.bookingStartTime).format(),
                end: moment(vm.bookingEndTime).format(),
                bookingName: vm.bookName,
                bookingDesc: vm.bookDescr,
                stick: true,
                active: 1,
                createdAt: new Date()
            };

            var userTempJSON = [];

            _.forEach(vm.selectedUsers, function(user) {
                userTempJSON.push({id: user.id, username: user.username});
            });

            var userJSON = JSON.stringify(userTempJSON); // convert to json
            var json = JSON.stringify(bookingTempObj); // convert to json
            console.log(userTempJSON, userJSON);
            bookingsService.storeBooking(json, userJSON, function (response) { // Insert to database
                var temp_user = $filter('filter')(vm.users, {id: response.data.user_id})[0];
                response.data.created_by_username = temp_user.name;
                vm.bookings.push(response.data); // ADD TO THE BOOKINGS ARRAY
            });

            vm.popupAppearence = false; // HIDE Modal window

        }

        /* Store changed information */
        vm.storeUpdates = function () {
            vm.popupAppearence = false; // HIDE Modal window

            if (vm.clickedBooking.start === vm.bookingStartTime &&
                vm.clickedBooking.end === vm.bookingEndTime &&
                vm.clickedBooking.title.localeCompare(vm.bookName) != -1 &&
                vm.clickedBooking.description.localeCompare(vm.bookDescr) != -1 || !vm.pageProperties.IsDayWithEvent) return;

            console.log('moment ', moment(vm.bookingStartTime).format(), moment(vm.bookingEndTime).format());
            var bookingTempObj = {
                id: vm.event_id,
                user_id: vm.parentUser.id,
                calendar_id: vm.calendar.id,
                title: vm.bookName,
                description: vm.bookDescr,
                start: moment(vm.bookingStartTime).format(),
                end: moment(vm.bookingEndTime).format(),
                bookingName: vm.bookName,
                bookingDesc: vm.bookDescr,
                stick: true,
                active: 1,
                createdAt: new Date()
            };

            console.log('start, end:', bookingTempObj.start, bookingTempObj.end)

            var json = JSON.stringify(bookingTempObj); // convert to json

            bookingsService.storeChanges(json, function (response) {
                var tempIndex = _.findIndex(vm.bookings, { 'id': response.data.id});
                vm.bookings[tempIndex].title = response.data.title;
                vm.bookings[tempIndex].description = response.data.description;
                vm.bookings[tempIndex].start = response.data.start;
                vm.bookings[tempIndex].end = response.data.end;
                console.log(response);
            });

            vm.selectedUsers = [];
            vm.IsBookNameFilled = false;
            vm.IsBookDescrFilled = false;
        }

        // Save selected users
        vm.updateUsers = function(selectedUsers) {
            var userTempJSON = [];
            _.forEach(vm.selectedUsers, function(user) {
                userTempJSON.push({id: user.id, username: user.username});
            });

            var userTempJSON = JSON.stringify(userTempJSON); // convert to json
            bookingsService.updateBookingUsers(vm.event_id, userTempJSON, function(response) {
                vm.pageProperties.usersSaved = true;
                vm.pageProperties.IsSaveUserButtonVisible = false; // Hide saving users button
            });
        }

        // Go to calendar page
        vm.getCalendar = function () {
            $location.path('/calendar/' + vm.selectedCalendar.id);
        }

        // Removing booking
        vm.removeBook = function (){
            vm.popupAppearence = false; // HIDE Modal window

            bookingsService.removeBook(vm.event_id, function (response) {
                console.log('Removed booking: ', response.data);
                var tempIndex = _.findIndex(vm.bookings, { 'id': response.data.id});
                vm.bookings.splice(tempIndex, 1);
            })
            vm.IsBookNameFilled = false;
            vm.IsBookDescrFilled = false;
        }

        /* Start Date manipulations */
        vm.clear = function() {
            return null;
        };

        vm.setDate = function(year, month, day) {
            vm.sDate = new Date(year, month, day);
        };

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
        /* End Date manipulations */

        vm.enable = function() {
            vm.disabled = false;
        };

        vm.disable = function() {
            vm.disabled = true;
        };

        // binary search
        function getObjectById(arr, target){
            return _.find(arr, { 'id': target });
        }



        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

}]);


'use strict';

angular.module('metacalendar.indexModule', ['ngRoute', 'ngAnimate'])

.controller('IndexCtrl', ['$scope', 'calendarsService', function($scope, calendarsService) {
    var vm = $scope;
    vm.parentUser = {
        id: -1
    }
    if (vm.$parent.user != null){
        vm.parentUser.id = vm.$parent.user.id;
        vm.parentUser.username = vm.$parent.user.username;
    }

    vm.miniLoader = false;
    /* Temporary calendar object */
    vm.tempCalendar = {
        calendar_name: '',
        calendar_color: 'rgba(62, 49, 77, 0.8)',
        calendar_type:"public",
        is_private:false,
        user_id: vm.parentUser.id,
        username: vm.parentUser.username,
        apps_id: 2,
        active: 1,
        createdAt: new Date()
    };

    /* Init calendar object */
    vm.calendars = calendarsService.calendars;
    vm.$watch('calendars', function () {
        calendarsService.calendars = vm.calendars;
    });

    if(vm.calendars.length != 0 || vm.calendar != undefined) vm.miniLoader = true;

    /* Obtain calendars which are available for you */
    calendarsService.obtainAvailableCalendars(vm.parentUser.id, function(response){ // Getting available calendars
        vm.calendars = response.data;
        console.log(vm.calendars);
        vm.miniLoader = true;
    });


    // Open add calendar popup window
    vm.addCalendar = function () {
        var json = JSON.stringify(vm.tempCalendar);
        calendarsService.postCalendar(json, function (response) {
            vm.calendars.push(response.data);
            vm.popupAppearence = false;
            refreshTempCalendar();
        });
    }

    vm.removeCalendar = function (calendar) {
        calendarsService.removeCalendar(calendar.id, function(response){
            console.log('removed', response.data);
            var tempIndex = _.findIndex(vm.calendars, { 'id': response.data.id});
            vm.calendars.splice(tempIndex, 1);
        });
    }

    /* Close modal window */
    vm.close = function(){
        vm.popupAppearence = false;
        refreshTempCalendar();
    }

    /* Refresh */
    function refreshTempCalendar(){
        vm.tempCalendar = {
            calendar_name: '',
            calendar_color: 'rgba(62, 49, 77, 0.8)',
            calendar_type:"public",
            is_private:false,
            user_id: vm.$parent.user.id,
            username: vm.parentUser.username,
            apps_id: 2,
            active: 1,
            createdAt: new Date()
        };
    }
}]);

angular.module('metacalendar.mainPageModule', ['ngRoute', 'ngAnimate'])

.controller('MainPageCtrl', ['$scope', 'appsServices', function($scope, appsServices) {
    var vm = $scope;
    vm.parentUser = {
        id: -1
    };
    vm.$parent.rootVars.isContentReady = false;
    vm.miniLoader = false;
    vm.init = function(){
        vm.$parent.rootVars.isContentReady = false;
        vm.miniLoader = false;
    }

    if (vm.$parent.user != null){
        vm.parentUser = vm.$parent.user;
    }
    vm.init = function () {
        vm.editStatus = false;
    }

    vm.apps = [];

    vm.$watch('apps', function () {
        appsServices.metaApps = vm.apps;
    });

    vm.$watch('apps', function () {

    });

    appsServices.getMetaApps(function(response){
        vm.apps = response.data;
        console.log('vm.$parent.rootVars', vm.$parent.rootVars);
        vm.$parent.rootVars.isContentReady = true;
        vm.miniLoader = true;
        // console.log(vm.$parent.isContentReady);
    });
}]);
/**
 * Created by polta on 3/31/2017.
 */
'use strict';

angular.module('metacalendar.metafichadaModule', ['ngRoute'])

    .controller('MetafichadaCtrl', ['$scope', 'usersService', function($scope, usersService) {
        var vm = $scope;

        vm.synchronizeUsersDatas = function(){
            usersService.obtainDatasExternalAppByApiUrl(vm.apiUrl, function (response) {
                console.log('synchronization', response);
                alert('lol');
            });
            // lkjskld
        }
    }
]);

angular.module('metacalendar.profileModule', ['ngRoute', 'ngAnimate'])

.controller('ProfileCtrl', ['$scope', 'usersService', 'localStorageService', function($scope, usersService, localStorageService) {
    var vm = $scope;
    vm.parentUser = {
        id: -1
    };

    if (vm.$parent.user != null){
        vm.parentUser = vm.$parent.user;
    }

    vm.init = function () {
        vm.editStatus = false;
    }

    vm.$watch('user', function () {
    });
    console.log('sss', vm.parentUser);
    vm.updateUserInfo = function () {
        var obj = {
            id: vm.parentUser.id,
            name: vm.parentUser.name,
            surname: vm.parentUser.surname,
            position: vm.parentUser.position
        };
        var json = JSON.stringify(obj);
        usersService.updateUser(json, function (response) {

            setItem('loggedUser', response.data);
            vm.parentUser = response.data;
            vm.editStatus = false;
            console.log('update', vm.parentUser);
        });
    }

    vm.showEdit = function () {
        vm.editStatus = true;
    }

    vm.back = function () {
        vm.editStatus = false;
    }



    /* Set item to the localStorageService */
    function setItem(key, val) {
        return localStorageService.set(key, val);
    }
    /* Get item to the localStorageService */
    function getItem(key) {
        return localStorageService.get(key);
    }
}]);

/**
 * Created by ruslan.poltayev on 03/11/2016.
 */
'use strict';

angular.module('metacalendar.registrationModule', ['ngRoute', 'ngMessages', 'ngAnimate'])

.controller('RegistrationCtrl', ['$scope', '$http', '$log', 'usersService', '$location',
    function($scope, $http, $log, usersService, $location) {
    
    var vm = $scope;

    vm.registr = function () {
        var obj = {
            email: vm.email,
            username: vm.username,
            password: vm.password1
        };
        var json = JSON.stringify(obj);
        usersService.register(json, function (response) {
            vm.info = response;
            console.log('response', response)
            if(response.data.error != null){
                alert(response.data.error);
            } else {
                $location.path('/auth');
            }

        })
    }
    


}]);