export class TodoItem {
    constructor(dataIndex, text) {
        this.dataIndex = dataIndex;
        this.text = text;
        // this.list = list;
        this.todoItemTemplate = `
            <li class="todoItem" data-done-status="false">
            <input class="completeItemButton" type="checkbox" onclick="onCheckBoxClick(this)">
            <p class="todoItemText"></p>
            <button class="removeItemButton" type="button" onclick="onRemoveBtnClick(this)">Remove</button>
            <button class="editItemButton" type="button" onclick="onEditBtnClick(this)">Edit</button>
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

        this.todoItemArray = JSON.parse(localStorage.getItem('todos')) || [];


        
        this.renderTodoItem(this.incompletedTodoListEl, this.allTodoListEl);
    }


    renderTodoItem(incompletedList, allList) {

        console.log(this)
        this.createItem(incompletedList);
        this.createItem(allList);

        this.updateTodoCounter();

        // renders message according to active list
        if (this.completedTodoListEl.classList.contains('isHidden')) {
            this.renderEmptyTodoListContent(true);
        } else {
            this.renderEmptyTodoListContent(false);
        }

        
    }


    createItem(list) {
        list.insertAdjacentHTML('afterbegin', this.todoItemTemplate);
        const todoItemTextEl = list.querySelector('.todoItemText');
        todoItemTextEl.textContent = this.text;
        const todoItemEl = list.querySelector('.todoItem');
        todoItemEl.setAttribute('data-index', this.dataIndex);
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

    onCheckBoxClick(e) {
        const itemDataIndex = e.parentElement.getAttribute('data-index');
        const todoTextContent = e.parentElement.querySelector('.todoItemText').textContent;

        console.log(this)
        // if checkbox is checked, item sets to completedTodoList and removes from incompletedTodoList
        if (e.checked) {
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

}



