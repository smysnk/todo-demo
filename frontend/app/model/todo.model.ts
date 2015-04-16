
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

export = Todo;