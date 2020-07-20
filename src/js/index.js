import './../scss/main.scss';


import Todos from './model/Todos';
import * as todosView from './view/todosView';

import { DOMels, DOMelsStrings } from './view/base';

/*Todo Object*/

const state = {};


const loadApp = () => {
    state.model = new Todos();
    state.model.readStorage();

    if (state.model.todos.length > 0) {
        const completedTodos = state.model.completedTodos();

        todosView.todosForEachDisplay(state.model.todos);

        todosView.clearCompletedVisibility(completedTodos);

        todosView.checkIfAllCompleted(DOMels.toggleAll, state.model.todos, completedTodos);

        DOMels.todosLeft.textContent = `Todos left: ${state.model.activeTodos().length}`;
    }
};

const addTodo = (e) => {
    e.preventDefault();

    const todoDesc = todosView.getAddInput();

    if (!todoDesc.length) {
        alert('Please type in a valid task');
        return;
    } else {
        const addedTodo = state.model.addTodo(todoDesc);

        todosView.displayTodo(addedTodo);

        todosView.clearAddInput();

        const completedTodos = state.model.completedTodos();

        todosView.checkIfAllCompleted(DOMels.toggleAll, state.model.todos, completedTodos);

        DOMels.todosLeft.textContent = `Todos left: ${state.model.activeTodos().length}`;

    }
};


const deleteTodo = (e) => {
    const id = e.target.closest(DOMelsStrings.todosTask).dataset.id;

    if (e.target.matches(`${DOMelsStrings.todosDelete}, ${DOMelsStrings.todosDelete} * `)) {
        // delete from data
        state.model.deleteTodo(id);

        // delete from view
        todosView.deleteTodo(id);

        const completedTodos = state.model.completedTodos();
        todosView.clearCompletedVisibility(completedTodos);

        DOMels.todosLeft.textContent = `Todos left: ${state.model.activeTodos().length}`;
    }
};

const changeTodoState = (e) => {
    const el = e.target;

    if (el.matches(`${DOMelsStrings.todosCheckBoxLabel}, ${DOMelsStrings.todosCheckBoxLabel} * `)) {
        const todoLi = e.target.closest(DOMelsStrings.todosTask);

        const id = todoLi.dataset.id;

        // chages the done state of a specific todo item
        state.model.setCheckAtrributeData(id);

        // check if all todos completed, and change toggleAll  UI state
        const completedTodos = state.model.completedTodos();
        todosView.checkIfAllCompleted(DOMels.toggleAll, state.model.todos, completedTodos);

        // change todo appearance in UI    
        todosView.toggleTodo(todoLi);

        todosView.clearCompletedVisibility(completedTodos);

        DOMels.todosLeft.textContent = `Todos left: ${state.model.activeTodos().length}`;
    }
};

const todosFilter = (e) => {
    let todos;
    if (e.target.matches(DOMelsStrings.todosFilterAll)) {
        todosView.removeTodosListChildren();
        todos = state.model.todos;
        todosView.todosForEachDisplay(todos);

    } else if (e.target.matches(DOMelsStrings.todosFilterCompleted)) {
        todosView.removeTodosListChildren();
        todos = state.model.completedTodos();
        todosView.todosForEachDisplay(todos);

    } else if (e.target.matches(DOMelsStrings.todosFilterActive)) {
        todosView.removeTodosListChildren();
        todos = state.model.activeTodos();
        todosView.todosForEachDisplay(todos);
    }
};

const changeAllTodosState = () => {
    const completedTodos = state.model.completedTodos();

    todosView.removeTodosListChildren();

    if (state.model.todos.length === completedTodos.length) {
        state.model.changeTodosDoneState(false);
    } else {
        state.model.changeTodosDoneState(true);
    }
    state.model.persistData();
    todosView.todosForEachDisplay(state.model.todos);

    todosView.clearCompletedVisibility(state.model.completedTodos());

    DOMels.todosLeft.textContent = `Todos left: ${state.model.activeTodos().length}`;
};

const clearCompleted = () => {
    state.model.todos = state.model.activeTodos();
    state.model.persistData();

    todosView.clearCompleted(state.model.todos);

    DOMels.toggleAll.checked = false;
    DOMels.clearCompleted.style.display = 'none';
};

const searchTodos = () => {
    const searchVal = DOMels.todosSearchField.value;
    todosView.searchForTodos(searchVal);
};

const addEditTodo = (e) => {
    if (e.target.matches(DOMelsStrings.todosDesc)) {
        const todoToBeEdited = e.target.closest(DOMelsStrings.todosTask);
        // Get the id of the li, where the event happened
        const id = todoToBeEdited.dataset.id;

        // Set display none for all todo li items
        todosView.todoItemsVisibility(todoToBeEdited, false);

        // Get the description, to later make it iput val
        const inputVal = e.target.textContent.trim();

        // Creating the input el, creating edit state
        const input = document.createElement('input');
        input.className = 'todos__edit';
        input.setAttribute('type', 'text');
        input.value = inputVal;

        // Get the correct li, to put the input in.
        const todoDOM = document.querySelector(`[data-id="${id}"]`);

        todoDOM.appendChild(input);

        input.focus();
    }
};

const editTodo = (e) => {
    if (e.target.matches(DOMelsStrings.todosEdit)) {
        // Get the new description for a todo from the input
        const todoDescNew = e.target.value.trim();

        // Get the id of the li, where the event happened
        const id = e.target.closest(DOMelsStrings.todosTask).dataset.id;

        // If the edited todo desc is empty, delete the todo from the data and UI
        if (todoDescNew.length === 0) {
            state.model.deleteTodo(id);
            todosView.deleteTodo(id);

            DOMels.todosLeft.textContent = `Todos left: ${state.model.activeTodos().length}`;
        } else {
            // Change the desc of a todo inside the data
            state.model.changeTodosDesc(id, todoDescNew);

            // Remove the input, remove the edit UI state
            todosView.deleteEditInputTodo(id);

            const todoDOM = document.querySelector(`[data-id="${id}"]`);
            const todoDOMDesc = todoDOM.querySelector(DOMelsStrings.todosDesc);

            // Set display 'inline' for all todo li items
            todosView.todoItemsVisibility(todoDOM, true);

            todoDOMDesc.textContent = todoDescNew;
        }
    }
}


const editTodoKeyPress = (e) => {
    if (e.which === 13 || e.keyCode === 13) {
        e.target.blur();
    }
};


const loadEventListeners = () => {

    DOMels.form.addEventListener('submit', addTodo);

    DOMels.todosList.addEventListener('change', changeTodoState);

    DOMels.todosList.addEventListener('click', deleteTodo);

    DOMels.todosOptions.addEventListener('click', todosFilter);

    DOMels.toggleAll.addEventListener('change', changeAllTodosState);

    DOMels.clearCompleted.addEventListener('click', clearCompleted);

    DOMels.todosSearchField.addEventListener('keyup', searchTodos);

    DOMels.todosList.addEventListener('click', addEditTodo);

    DOMels.todosList.addEventListener('blur', editTodo, true);

    DOMels.todosList.addEventListener('keyup', editTodoKeyPress);

    window.addEventListener('load', loadApp);
};

loadEventListeners();

