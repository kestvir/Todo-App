export default class Todos {
    constructor() {
        this.todos = [];
    }

    addTodo(desc) {
        const todo = {
            id: this.todoIdCalc(),
            done: false,
            desc
        }

        this.todos.push(todo);

        // Perist data in localStorage
        this.persistData();
        console.log(this.todos);

        return todo;

    }

    deleteTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === parseInt(id))
        this.todos.splice(index, 1);

        this.persistData();
    }

    changeTodosDoneState(doneState) {
        this.todos = this.todos.map(todo => {
            todo.done = doneState;
            return todo;
        });
    }

    changeTodosDesc(id, todoDescNew) {
        this.todos = this.todos.map(todo => {
            if (todo.id === parseInt(id)) {
                todo.desc = todoDescNew;
            }
            return todo;
        });

        this.persistData();
    }

    setCheckAtrributeData(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === parseInt(id)) {
                todo.done = !todo.done;
            }
            return todo;
        });

        this.persistData();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => todo.done === false);
        this.persistData();
    }

    todoIdCalc() {
        let ID;
        if (this.todos.length > 0) {
            ID = this.todos[this.todos.length - 1].id + 1;
        } else {
            ID = 0;
        }
        return ID;
    }

    completedTodos() {
        return this.todos.filter(todo => todo.done === true);
    }

    activeTodos() {
        return this.todos.filter(todo => todo.done === false);
    }

    persistData() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('todos'));

        if (storage) this.todos = storage;
    }
}