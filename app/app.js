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