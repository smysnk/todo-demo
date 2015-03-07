/*global define*/
'use strict';

define([
    'app',
], function (app) {

    app.service('$todo', [
    function () {

        var list = [];
        var showMode = {
            selected: null
        };

        /**
         * Todo model, represents a todo item
         */
        class Todo {

            constructor (title) {

                this.title = title;
                this.enabled = false;
                this.completed = false;

            }

            edit () {

                this.enabled = !this.enabled;

            }

        }

        /**
         * Add a new Todo item
         */
        var add = function (title) {

            this.list.unshift(new Todo(title));

        };

        /**
         * Remove an existing todo item
         */
        var remove = function (todo) {

            var index = this.list.indexOf(todo);
            if (index > -1) list.splice(index, 1);

        };

        /**
         * Returns the number of tasks remaining
         */
        var countTasksRemaining = function () {

            var tasksRemaining = this.list.length;
            for (var i = 0, length = tasksRemaining; i < length; i++) {
                if (this.list[i].completed) tasksRemaining--;
            }
            return tasksRemaining;

        };

        return {
            list,
            add,
            remove,
            showMode,
            countTasksRemaining
        };
        
    }]);
});
