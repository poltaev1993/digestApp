var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    watch = require('gulp-watch');

gulp.task('all', function() {
    return gulp.src(
        [
            './app/app.js',
            './app/routes.js',
            './app/services/*.js',
            './app/directives/*.js',
            './app/controllers/*.js',
            './app/controllers/**/*.js'
        ])
        .pipe(gp_concat('all.js'))
        .pipe(gulp.dest('./app/public/build'));
});

gulp.task('angular_tools', function() {
    return gulp.src(
        [
            './app/bower_components/angular-sanitize/angular-sanitize.min.js',
            './app/bower_components/angular-animate/angular-animate.min.js',
                /* translation */
            './app/bower_components/angular-translate/angular-translate.min.js',
            './app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',

            './app/bower_components/angular-cookies/angular-cookies.js',
            './app/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
            './app/bower_components/angular-translate-storage-local/angular-translate-storage-local.js',

            './app/bower_components/angular-route/angular-route.js',
            './app/bower_components/angular-messages/angular-messages.min.js',
            './app/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
            './app/public/lib/angular-ui-bootstrap/dist/ui-bootstrap.js',
            './app/public/lib/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            './app/bower_components/angular-ui-select/dist/select.min.js'
        ])
        .pipe(gp_concat('angular-tools.js'))
        .pipe(gulp.dest('./app/public/build'));
});

gulp.task('angular-calendar', function() {
    return gulp.src(
        [
            './app/bower_components/moment/min/moment.min.js',
            './app/bower_components/angular-ui-calendar/src/calendar.js',
            './app/bower_components/fullcalendar/dist/fullcalendar.min.js',
            './app/bower_components/fullcalendar/dist/gcal.js'
        ])
        .pipe(gp_concat('angular-calendar.js'))
        .pipe(gulp.dest('./app/public/build'));
});

gulp.task('jquery-tools', function() {
    return gulp.src(
        [
            './app/public/lib/lodash/lodash.min.js',
            './app/public/lib/select2/js/select2.min.js'
        ])
        .pipe(gp_concat('jquery-tools.js'))
        .pipe(gulp.dest('./app/public/build'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(
        [
            './app/app.js',
            './app/routes.js',
            './app/services/*.js',
            './app/directives/*.js',
            './app/controllers/*.js',
            './app/controllers/**/*.js',

            './app/bower_components/angular-sanitize/angular-sanitize.min.js',
            './app/bower_components/angular-animate/angular-animate.min.js',
            './app/bower_components/angular-route/angular-route.js',
            './app/bower_components/angular/angular-messages.min.js',
            './app/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
            './app/public/lib/angular-ui-bootstrap/dist/ui-bootstrap.js',
            './app/public/lib/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            './app/bower_components/angular-ui-select/dist/select.min.js',


            './app/bower_components/moment/min/moment.min.js',
            './app/bower_components/angular-ui-calendar/src/calendar.js',
            './app/bower_components/fullcalendar/dist/fullcalendar.min.js',
            './app/bower_components/fullcalendar/dist/gcal.js',

            './app/public/lib/lodash/lodash.min.js',
            './app/public/lib/select2/js/select2.min.js'
        ],
        ['all', 'angular_tools', 'angular-calendar', 'jquery-tools']);
});

gulp.task('default', ['all', 'angular_tools', 'angular-calendar', 'jquery-tools']);