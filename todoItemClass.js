export class TodoItem {
    constructor(dataIndex, text, todoItemArray) {
        this.dataIndex = dataIndex;
        this.text = text;
        this.todoItemTemplate = `
            <li class="todoItem" data-done-status="false">
            <input class="completeItemButton" type="checkbox">
            <p class="todoItemText"></p>
            <button class="removeItemButton" type="button">Remove</button>
            <button class="editItemButton" type="button">Edit</button>
            </li>`
        // todos lists
        this.completedTodoListEl = document.querySelector('.completedTodoList');
        this.incompletedTodoListEl = document.querySelector('.incompletedTodoList');
        this.allTodoListEl = document.querySelector('.allTodoList');
        // counter values elements
        this.completedTodosCounterEl = document.querySelector('.completedTodosCounter');
        this.incompletedTodosCounterEl = document.querySelector('.incompletedTodosCounter');
        this.allTodosCounterEl = document.querySelector('.allTodosCounter');
        // list message elements
        this.emptyTodoListEl = document.querySelector('.emptyTodoListContent');
        this.emptyAllTodoEl = document.querySelector('.emptyAllTodosContent');

        this.todoItemArray = todoItemArray;
        this.editableTextContent = null;
        
        this.renderTodoItem(this.dataIndex, this.text, this.incompletedTodoListEl);
        this.renderTodoItem(this.dataIndex, this.text, this.allTodoListEl);

    }


    renderTodoItem(dataIndex, text, list) {

        list.insertAdjacentHTML('afterbegin', this.todoItemTemplate);
        
        const todoItemTextEl = list.querySelector('.todoItemText');
        todoItemTextEl.textContent = text;
        const todoItemEl = list.querySelector('.todoItem');
        todoItemEl.setAttribute('data-index', dataIndex);

        const completeItemButtonEl = document.querySelector('.completeItemButton');
        completeItemButtonEl.addEventListener('click', this.onCheckBoxClick.bind(this));

        const removeItemButtonEl = document.querySelector('.removeItemButton');
        removeItemButtonEl.addEventListener('click', this.onRemoveBtnClick.bind(this));

        const editItemButtonEl = document.querySelector('.editItemButton');
        editItemButtonEl.addEventListener('click', this.onEditBtnClick.bind(this));

        this.updateTodoCounter();

        // renders message according to active list
        if (this.completedTodoListEl.classList.contains('isHidden')) {
            this.renderEmptyTodoListContent(true);
        } else {
            this.renderEmptyTodoListContent(false);
        }       
    }

    updateTodoCounter() {
        this.completedTodosCounterEl.textContent = this.completedTodoListEl.children.length;
        this.incompletedTodosCounterEl.textContent = this.incompletedTodoListEl.children.length;
        this.allTodosCounterEl.textContent = this.todoItemArray.length;
    }

    renderEmptyTodoListContent(value = false) {
    // renders message according to active list
        if (value){
            if (this.incompletedTodoListEl.children.length === 0) {
                this.emptyTodoListEl.textContent = 'Here is no incompleted todos';
            } else if (this.incompletedTodoListEl.children.length > 0) {
                this.emptyTodoListEl.textContent = '';
            }
        } else {
            if (this.completedTodoListEl.children.length === 0) {
                this.emptyTodoListEl.textContent = 'Here is no completed todos';
            } else if (this.completedTodoListEl.children.length > 0) {
                this.emptyTodoListEl.textContent = '';
            }
        } 
    }

    onEditBtnClick(e) {
        [...e.target.parentElement.children].map(item => {
            if (item.className === 'todoItemText') {
                this.editableTextContent = item.textContent;
                item.contentEditable = true;
                item.classList.add('isEditable');
                item.addEventListener('keydown', this.onTodoKeydown);
            }
        })
    }
    

    onTodoKeydown(e) {
        console.log(e)
    if (e.code === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        
        const arrayFromLocalStorage = JSON.parse(localStorage.getItem('todos'));
        localStorage.clear();
        
        // looks for item with edited value and sets new value
        arrayFromLocalStorage.map(el => {
            if (el.item === this.editableTextContent) {
                el.item = e.currentTarget.textContent;
            }
        })

        localStorage.setItem('todos', JSON.stringify(arrayFromLocalStorage));

        e.currentTarget.contentEditable = false;
        e.currentTarget.classList.remove('isEditable');
    }
}



    onCheckBoxClick(e) {
        const itemDataIndex = e.target.parentElement.getAttribute('data-index');
        const todoTextContent = e.target.parentElement.querySelector('.todoItemText').textContent;

        // if checkbox is checked, item sets to completedTodoList and removes from incompletedTodoList
        if (e.target.checked) {
            console.log(e.target.checked)
            this.changeCheckboxValue(itemDataIndex, this.incompletedTodoListEl, 'true');

            
            [...this.allTodoListEl.children].map(item => {
                if (item.getAttribute('data-index') === itemDataIndex) {
                    item.querySelector('.completeItemButton').checked = true;
                }
            })
        
            this.removeFormDom(itemDataIndex, this.incompletedTodoListEl);
            this.renderTodoItem(itemDataIndex, todoTextContent, this.completedTodoListEl);

            const checkboxEl = this.completedTodoListEl.querySelector('.completeItemButton');
            checkboxEl.checked = true;
            this.renderEmptyTodoListContent(true);
            
        } else {
            console.log(e.target.checked)
            this.changeCheckboxValue(itemDataIndex, this.completedTodoListEl, 'false');

            [...this.allTodoListEl.children].map(item => {
                if (item.getAttribute('data-index') === itemDataIndex) {
                    item.querySelector('.completeItemButton').checked = false;
                }
            })

            this.removeFormDom(itemDataIndex, this.completedTodoListEl);
            this.renderTodoItem(itemDataIndex, todoTextContent, this.incompletedTodoListEl);

            const checkboxEl = this.incompletedTodoListEl.querySelector('.completeItemButton');
            checkboxEl.checked = false;
            this.renderEmptyTodoListContent(false);    
        }
    }

    onRemoveBtnClick(e) {
        const itemDataIndex = e.target.parentElement.getAttribute('data-index');

        this.removeItem(itemDataIndex);

        [...document.querySelectorAll('.todoItem')].map(el => {
            // removes item from DOM if dataIndex of item is the same as choosen item has
            if (el.getAttribute('data-index') === itemDataIndex) {
                this.removeFormDom(itemDataIndex, document);
            }
        });

        this.updateTodoCounter();

        // checks which todos list is active
        if (this.completedTodoListEl.classList.contains('isHidden')) {
            this.renderEmptyTodoListContent(true);
        } else if (this.incompletedTodoListEl.classList.contains('isHidden')) {
            this.renderEmptyTodoListContent(false);
        }
        
        if (!this.allTodoListEl.classList.contains('isHidden')) {
            this.renderAllTodosContent();
        }
    }
    

    changeCheckboxValue(index, element, dataDoneStatus) {
        [...element.querySelectorAll('.todoItem')].map(el => {

            // sets done stutus to items in array
            if (el.getAttribute('data-index') === index) {
                el.setAttribute('data-done-status', dataDoneStatus);
            }
        })
        
        this.changeArrayItemStatus(index);
        localStorage.clear();
        localStorage.setItem('todos', JSON.stringify(this.todoItemArray));
        this.updateTodoCounter();
    }

    removeItem(id) {
        this.todoItemArray = this.todoItemArray.filter(item => {
            return item.id !== id;
        });

        localStorage.clear();
        localStorage.setItem('todos', JSON.stringify(this.todoItemArray));
    }

    removeFormDom(id, element) {
        const item = element.querySelector(`[data-index="${id}"]`);
        item.remove();
    }

    changeArrayItemStatus(index) {
        this.todoItemArray.map(el => {
            if (el.id === index) {
                el.isDone = !el.isDone;
            }
        })
    }

    renderAllTodosContent() {
    // renders message for all todos list if it is active
    if (this.todoItemArray.length === 0) {
        this.emptyAllTodoEl.textContent = 'Todos list is empty';
    }
    if (this.todoItemArray.length > 0) {
        this.emptyAllTodoEl.textContent = '';
    }
}

}



