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