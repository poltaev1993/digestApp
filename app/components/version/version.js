'use strict';

angular.module('metacalendar.version', [
  'metacalendar.version.interpolate-filter',
  'metacalendar.version.version-directive'
])

.value('version', '0.1');
