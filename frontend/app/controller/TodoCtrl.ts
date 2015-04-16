'use strict';

declare var require:any;
var app = require('../app');

class TodoCtrl {

    private $todo:any;
    private $scope:any;
    private labelNewTodo:any;
    private list:any;
    private showMode:any;
    private countTasksRemaining:any;
    private remove:any;

    public static $inject = [
        '$scope',
        '$todo'
    ];

    constructor($scope:any, $todo:any) {

        this.$scope = $scope;
        this.$todo = $todo;

        this.labelNewTodo = "";
        this.list = $todo.list;
        this.showMode = $todo.showMode;
        this.countTasksRemaining = $todo.countTasksRemaining;
        this.remove = $todo.remove;

        console.log('boom');

    }


    /**
     * Adds a new todo, clears text in entry box
     */
    add() {

        this.$todo.add(this.labelNewTodo);
        this.labelNewTodo = "";

    }

    /**
     * Deligate filter logic to current Show Mode object
     */
    showModeFilter(input) {

        return this.$todo.showMode.selected.filter(input);

    }


};

app.controller('TodoCtrl', TodoCtrl);

export = TodoCtrl;
