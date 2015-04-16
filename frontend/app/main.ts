/// <reference path="typings/tsd.d.ts" />

declare var require:any;

require('angular-ui-router');
require('./templates.js');
require('./controller/TodoCtrl');
require('./service/TodoService');
require('./component/show_mode_select/directive');

angular.bootstrap(document, ['app']);
