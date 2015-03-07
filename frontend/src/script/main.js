/*global require*/
'use strict';


require.config({
	paths: {
        angular: '//ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular.min',
        //angular: '../bower_components/angular/angular',

        angular_template: '../js/templates',
        angular_ui_router: '../js/angular-ui-router',

        bootstrap: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min',
        //bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',

        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
        //underscore: '../bower_components/underscore/underscore',

        lodash: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.underscore.min',

        jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
        //jquery: '../bower_components/jquery/jquery',

	},
	shim: {
        lodash: { exports: '_' },
        jquery: { exports: 'jQuery' },
        angular: { deps: ['jquery'], exports: 'angular' },
        bootstrap: { deps: ['jquery'] }
	}
});

require([
    'angular', 
    'app',
    'bootstrap',
    'controller/todo',
    'service/todo',
    'component/show_mode_select/directive'
], function (angular, app) {

    angular.bootstrap(document, ['app']);
 
});
