
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