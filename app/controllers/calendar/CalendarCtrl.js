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

