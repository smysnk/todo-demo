/// <reference path="../typings/tsd.d.ts" />

declare var require:any;

require('angular-ui-router');
require('./templates.js');
require('./front/todo.controller');
require('./service/todo.service');
require('./component/show_mode_select.directive');

angular.bootstrap(document, ['app']);
