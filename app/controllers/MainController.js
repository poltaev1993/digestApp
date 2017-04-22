
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