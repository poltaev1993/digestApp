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