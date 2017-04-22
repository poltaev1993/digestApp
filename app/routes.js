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