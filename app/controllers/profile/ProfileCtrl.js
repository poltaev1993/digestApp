
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