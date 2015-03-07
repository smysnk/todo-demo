/*global define*/
'use strict';

define([
    'app',
    'lodash'
], function (app, _) {

    return app.controller('Todo', [
        '$scope',
        '$todo',
        function Controller ($scope, $todo) {

            this.labelNewTodo = "";
            this.list = $todo.list;
            this.showMode = $todo.showMode;
            this.countTasksRemaining = $todo.countTasksRemaining;
            this.remove = $todo.remove;

            /**
             * Adds a new todo, clears text in entry box
             */
            this.add = function () {

                $todo.add(this.labelNewTodo);
                this.labelNewTodo = "";

            };

            /**
             * Deligate filter logic to current Show Mode object
             */
            this.showModeFilter = function (input) {

                return $todo.showMode.selected.filter(input);

            }

        }
    ]);
});
