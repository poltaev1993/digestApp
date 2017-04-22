
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