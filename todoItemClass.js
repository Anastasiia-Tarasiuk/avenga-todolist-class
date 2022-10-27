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

        this.counterListEl = document.querySelector('.counterList');
        this.counterListEl.addEventListener('click', this.onListClick);

        document.addEventListener('DOMContentLoaded', this.onPageReload.bind(this));

        this.todoItemArray = todoItemArray;
        this.editableTextContent = null;
        
        // this.renderTodoItem(this.dataIndex, this.text, this.incompletedTodoListEl);
        // this.renderTodoItem(this.dataIndex, this.text, this.allTodoListEl);

        this.renderEmptyTodoListContent(true); 

        if (this.todoItemArray.length === 0) {
            this.completedTodosCounterEl.textContent = 0;
            this.incompletedTodosCounterEl.textContent = 0;
            this.allTodosCounterEl.textContent = 0;
        }


        if (this.todoItemArray.length > 0) {    
            for (let i = 0; i < this.todoItemArray.length; i++) {
                // array items renders to allTodoList
                this.renderTodoItem(this.todoItemArray[i].id, this.todoItemArray[i].item, this.allTodoListEl);
                // according to isDone status renders to completedTodoList or incompletedTodoList
                if (this.todoItemArray[i].isDone) {
                    this.renderTodoItem(this.todoItemArray[i].id, this.todoItemArray[i].item, this.completedTodoListEl);
                    
                    const checkboxEl = this.completedTodoListEl.querySelector('.completeItemButton');
                    checkboxEl.checked = true;
                    this.allTodoListEl.querySelector('.completeItemButton').checked = true;
                } else {
                    this.renderTodoItem(this.todoItemArray[i].id, this.todoItemArray[i].item, this.incompletedTodoListEl);
                    
                    const checkboxEl = this.incompletedTodoListEl.querySelector('.completeItemButton');
                    checkboxEl.checked = false;
                    this.allTodoListEl.querySelector('.completeItemButton').checked = false;
                } 
            }
           this. updateTodoCounter();
        }
    }


    renderTodoItem(dataIndex, text, list) {

        list.insertAdjacentHTML('afterbegin', this.todoItemTemplate);
        
        const todoItemTextEl = list.querySelector('.todoItemText');
        todoItemTextEl.textContent = text;
        const todoItemEl = list.querySelector('.todoItem');
        todoItemEl.setAttribute('data-index', dataIndex);

        const completeItemButtonEl = list.querySelector('.completeItemButton');
        completeItemButtonEl.addEventListener('click', this.onCheckBoxClick.bind(this));

        const removeItemButtonEl = list.querySelector('.removeItemButton');
        removeItemButtonEl.addEventListener('click', this.onRemoveBtnClick.bind(this));

        const editItemButtonEl = list.querySelector('.editItemButton');
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

    onPageReload() {
        const activePage = sessionStorage.getItem("isActive");
        switch (activePage) {
            case 'completed':
                this.makeCompletedTodoListActive();
                break;
            case 'incompleted':
                this.makeIncompletedTodoListActive();
                break;
            case 'all':
                this.makeAllTodoListActive();
                break;
            default:
                this.completedTodoListEl.classList.add('isHidden');
                this.allTodoListEl.classList.add('isHidden');
                this.incompletedTodosCounterEl.parentElement.classList.add('isActive');
        }
    }
    
    onListClick(e) {
        console.log(e.target)
        // makes one todos list active
        switch (e.target.getAttribute('data-type')) {
            case 'completed':
                this.makeCompletedTodoListActive();
                sessionStorage.setItem("isActive", 'completed');
                break;
            case 'incompleted':
                this.makeIncompletedTodoListActive();
                sessionStorage.setItem("isActive", 'incompleted');
                break;
            case 'all':            
                this.makeAllTodoListActive()
                sessionStorage.setItem("isActive", 'all');
                break;
        }
    }


    makeIncompletedTodoListActive() {
        this.incompletedTodoListEl.classList.remove('isHidden');
        this.completedTodoListEl.classList.add('isHidden');
        this.incompletedTodosCounterEl.parentElement.classList.add('isActive');
        this.completedTodosCounterEl.parentElement.classList.remove('isActive');
        this.allTodoListEl.classList.add('isHidden');
        this.allTodosCounterEl.parentElement.classList.remove('isActive');
        this.emptyTodoListEl.classList.remove('isHidden');
        this.emptyAllTodoEl.classList.add('isHidden');

        this.renderEmptyTodoListContent(true);
    }

    makeAllTodoListActive() {
        this.allTodoListEl.classList.remove('isHidden');
        this.allTodosCounterEl.parentElement.classList.add('isActive');
        this.incompletedTodoListEl.classList.add('isHidden');
        this.completedTodoListEl.classList.add('isHidden');
        this.completedTodosCounterEl.parentElement.classList.remove('isActive');
        this.incompletedTodosCounterEl.parentElement.classList.remove('isActive');
        this.emptyAllTodoEl.classList.remove('isHidden');
        this.emptyTodoListEl.classList.add('isHidden');

        this.renderAllTodosContent();
    }

    makeCompletedTodoListActive() {
        this.completedTodoListEl.classList.remove('isHidden');
        this.incompletedTodoListEl.classList.add('isHidden');
        this.completedTodosCounterEl.parentElement.classList.add('isActive');
        this.incompletedTodosCounterEl.parentElement.classList.remove('isActive');
        this.allTodoListEl.classList.add('isHidden');
        this.allTodosCounterEl.parentElement.classList.remove('isActive');
        this.emptyTodoListEl.classList.remove('isHidden');
        this.emptyAllTodoEl.classList.add('isHidden');

        this.renderEmptyTodoListContent(false);    
    }
}



