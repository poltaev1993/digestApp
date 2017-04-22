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