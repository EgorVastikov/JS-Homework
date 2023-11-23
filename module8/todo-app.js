(function() {
    function saveTodosToLocalStorage(listName, todos) {
        localStorage.setItem(listName, JSON.stringify(todos));
    }

    function getTodosFromLocalStorage(listName) {
        let storedTodos = localStorage.getItem(listName);
        let todos;
        if (storedTodos) {
            try {
                todos = JSON.parse(storedTodos);
            } catch (e) {
                console.error('Ошибка при разборе todos из localStorage:', e);
                todos = [];
            }
        } else {
            todos = [];
        }
        return todos;
    }

    function addTodoItem(todo, todos, todoList, listName) {
        let todoItem = createTodoItem(todo.name, todo.done);
    
        todoItem.doneButton.addEventListener('click', function() {
            todoItem.item.classList.toggle('list-group-item-success');
            todo.done = !todo.done;
            saveTodosToLocalStorage(listName, todos);
        });
    
        todoItem.deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                todoItem.item.remove();
                todos = todos.filter(function(t) { return t.id !== todo.id; });
                saveTodosToLocalStorage(listName, todos);
            }
        });
    
        todoList.append(todoItem.item);
    }

    // создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title;
        return appTitle
    }

    // создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');  // сам элемент формы
        let input = document.createElement('input');  // поле для ввода
        let buttonWrapper = document.createElement('div'); // для правильной стилизации кнопки
        let button = document.createElement('button');  // кнопка

        // расставляем различные атрибуты для элементов
        form.classList.add('input-group', 'mb-3'); // input-group содержит группы элементов формы, mb-3 оставляет отступ после формы
        input.classList.add('form-control');  // form-control для правильного отображения bootstrap формы
        input.placeholder = 'Введите название нового дела';  // пояснение для ввода
        buttonWrapper.classList.add('input-group-append');  // input-group-append нужен для позиционирования объекта формы справа от поля ввода
        button.classList.add('btn', 'btn-primary');  // btn применит стили к кнопке, btn-primary нарисует кнопку синим цветом
        button.textContent = 'Добавить дело';  // добавление к кнопке текст
        button.disabled = true;  //  кнопка неактивна

        // Функция для обновления состояния кнопки
        function toggleButtonState() {
            button.disabled = input.value.trim() === '';
        }

        // обработчик события 'input'
        input.addEventListener('input', toggleButtonState);

        // объединяем элементы в одну структуру
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button, // вернули не только form, тк нужно получить доступ к input и button
        };
    }

    // создаём и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name, done = false) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button'); // отметить, что дело сделано
        let deleteButton = document.createElement('button'); // удалить дело

        // устанавливаем стили для элемента списка, а также для размещения кнопок
        // в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');  // форматирование текста
        item.textContent = name;

        if(done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');  // btn-group применяет стили кнопок, btn-group-sm уменьшает высоту группы
        doneButton.classList.add('btn', 'btn-success');  // btn-success делает кнопку зелёной
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');  // btn-danger делает кнопку красной
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный элемент, чтобы они объединилсь в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createTodoApp(container, listName, title = 'Список дел') {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        getTodosFromLocalStorage(listName); 

        // массив дел из localStorage
        let todos = getTodosFromLocalStorage(listName);
        if (!Array.isArray(todos)) {
            console.error('todos is not an array:', todos);
            todos = [];
        }

        function getMaxId() {
            if (!Array.isArray(todos)) {
                return 0;
            }
            return todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;
        }

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        console.log(todos);
        if (Array.isArray(todos)) {
            todos.forEach(function(todo) {
                addTodoItem(todo, todos, todoList, listName);
            });
        } else {
            console.error('todos is not an array:', todos);
        }
        
        // браузер создаёт событие submit на форме по нажатию Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            // эта строчка необходима, чтобы предотвратить стандартной действие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // игнорируем создание элемента, если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value);

            let todoObject = {
                id: getMaxId() + 1,  // уникальный id
                name: todoItemForm.input.value,
                done: false  // cтатус дела
            };

            todos.push(todoObject);
            addTodoItem(todoObject, todos, todoList);
            saveTodosToLocalStorage(listName, todos);

            todoItemForm.input.value = '';
        });
    };  

    window.createTodoApp = createTodoApp;        
})();


