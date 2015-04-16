/// <reference path="../../typings/tsd.d.ts" />

declare var require:any;
import app = require('../application');
import angular = require('angular');

class ShowModeFilter {

    public static $inject = [
        '$todo'
    ];

    constructor($todo:any) {

        return function(items) {

            var filtered = [];
            angular.forEach(items, function(item) {

                if ($todo.showMode.selected.filter(item)) {
                    filtered.push(item);
                }
            });
            return filtered;

        }

    }

}

app.filter('showModeFilter', ShowModeFilter);