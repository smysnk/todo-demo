
declare var require:any;
var app = require('../application');

class Todo {

    private title: string;
    private enabled: boolean;
    private completed: boolean;

    /**
     * Todo model, represents a todo item
     */

    constructor(title) {

        this.title = title;
        this.enabled = false;
        this.completed = false;

    }

    edit() {

        this.enabled = !this.enabled;

    }

}

class TodoService {

    private list = [];
    public showMode = {
        selected: null
    };

    /**
     * Add a new Todo item
     */
    add(title) {

        this.list.unshift(new Todo(title));

    }

    /**
     * Remove an existing todo item
     */
    remove (todo) {

        var index = this.list.indexOf(todo);
        if (index > -1) this.list.splice(index, 1);

    }

    /**
     * Returns the number of tasks remaining
     */
    countTasksRemaining() {

        var tasksRemaining = this.list.length;
        for (var i = 0, length = tasksRemaining; i < length; i++) {
            if (this.list[i].completed) tasksRemaining--;
        }
        return tasksRemaining;

    }

}

app.service('$todo', TodoService);

export = TodoService;