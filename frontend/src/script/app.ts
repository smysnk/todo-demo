declare var require:any;
var angular = require('angular');

var app = angular.module('app', [
    'ui.router',
    'templates'
])
.config([
    '$urlRouterProvider',
    '$stateProvider',
    '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider) {

        $locationProvider.html5Mode({ enabled: true }).hashPrefix('!');

        // For any unmatched url, redirect to 404 Not Found page.
        $urlRouterProvider.otherwise('/404');

        // Now set up the states
        $stateProvider
            .state('todo', {
                url: '/',
                templateUrl: 'view/todo.html',
                controller: 'TodoCtrl',
                controllerAs: 'todos'
            })
            .state('404', {
                url: "/404",
                templateUrl: "view/404.html"
            });

    }
]);

export = app;