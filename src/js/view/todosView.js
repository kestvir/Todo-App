import { DOMels, DOMelsStrings, materializeStrs } from './base';


export const getAddInput = () => DOMels.addInput.value.trim();

export const todosForEachDisplay = (todos) => {
    todos.forEach(todo => {
        displayTodo(todo);
    });
};

export const removeTodosListChildren = () => {
    while (DOMels.todosList.hasChildNodes()) {
        DOMels.todosList.removeChild(DOMels.todosList.firstChild);
    };
};

export const clearAddInput = () => DOMels.addInput.value = '';

export const displayTodo = (todo) => {
    const markup =
        `<li class="todos__task ${materializeStrs.collectionItem}" data-id=${todo.id}>
        <label class="todos__checkbox-label">
            <input type="checkbox" class="todos__check ${materializeStrs.filledIn}" ${todo.done ? 'checked' : ''}>
            <span>&nbsp;</span>
        </label>
        <p ${todo.done ? `style="text-decoration: line-through; color: red;"` : ''} class="todos__description">${todo.desc}
        </p>
        <a class="todos__delete ${materializeStrs.secondaryContent}"><i class="fa fa-remove"></i></a>
    </li>`;

    DOMels.todosList.insertAdjacentHTML('beforeend', markup);

    todosVisibility();
    todosToggleAllVisibility();
};


const todosVisibility = () => {
    if (DOMels.todosList.hasChildNodes()) {
        DOMels.todos.style.display = 'block';
    } else {
        DOMels.todos.style.display = 'none';
    }
};

const todosToggleAllVisibility = () => {
    if (DOMels.todosList.hasChildNodes()) {
        DOMels.toggleAllLabel.style.display = 'initial';
        DOMels.cardTitle.style.marginLeft = '22px';
    } else {
        DOMels.toggleAllLabel.style.display = 'none';
        DOMels.cardTitle.style.marginLeft = '0';
    }
};

export const deleteTodo = (id) => {
    const task = document.querySelector(`[data-id="${id}"]`);
    if (task) task.parentElement.removeChild(task);

    todosVisibility();
    todosToggleAllVisibility();
};

export const deleteEditInputTodo = (id) => {
    const input = document.querySelector(DOMelsStrings.todosEdit);
    if (input) input.parentElement.removeChild(input);
};

export const checkIfAllCompleted = (toggleAll, allTodos, completedTodos) => {
    allTodos.length === completedTodos.length ? toggleAll.checked = true : toggleAll.checked = false;
};

export const toggleTodo = (el) => {
    const todoCheckBox = el.querySelector(DOMelsStrings.todosCheck);
    const todosDesc = el.querySelector(DOMelsStrings.todosDesc);
    if (todoCheckBox.checked) {
        todoCheckBox.setAttribute('checked', '')
        todosDesc.style.textDecoration = 'line-through';
        todosDesc.style.color = 'red';
    } else {
        todoCheckBox.removeAttribute('checked');
        todosDesc.style.textDecoration = 'none';
        todosDesc.style.color = 'black';
    }
};

export const toggleAllTodos = (todos, completedTodos, changedDoneTodos) => {
    let toggledTodos;

    removeTodosListChildren();
    if (todos.length === completedTodos.length) {
        toggledTodos = changedDoneTodos(false);
    } else {
        toggledTodos = changedDoneTodos(true);
    }
    todosForEachDisplay(toggledTodos);
};

export const clearCompleted = (incompleteTodos) => {
    removeTodosListChildren();

    const activeTodos = incompleteTodos;
    todosForEachDisplay(activeTodos);

    todosVisibility();
    todosToggleAllVisibility();
};

export const searchForTodos = (searchVal) => {
    document.querySelectorAll(DOMelsStrings.todosTask).forEach(todo => {
        const item = todo.querySelector(DOMelsStrings.todosDesc).textContent;
        if (item.toLowerCase().indexOf(searchVal) !== -1) {
            todo.style.display = 'block';
        } else {
            todo.style.display = 'none';
        }
    });
};

export const todoItemsVisibility = (todo, visible) => {
    const todoLi = todo;
    if (visible) {
        Array.from(todoLi.children).forEach((child, index) => {
            if (index === 1) {
                child.style.display = 'block';
            } else {
                child.style.display = 'inline-block';
            }
        });
    } else {
        Array.from(todoLi.children).forEach(child => {
            child.style.display = 'none';
        });
    }
};

export const clearCompletedVisibility = completedTodos => {
    if (completedTodos.length > 0) {
        DOMels.clearCompleted.style.display = 'inline-block';
    } else {
        DOMels.clearCompleted.style.display = 'none';
    }
};
