document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

  function addTodo() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
   
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTitle, textAuthor,bookYear, false);
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
  }
  ///function
  function generateId() {
    return +new Date();
  }
   
  function generateTodoObject(id, title, author,year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
  }

  const todos = [];
  const RENDER_EVENT = 'render-todo';

  document.addEventListener(RENDER_EVENT, function () {
    console.log(todos);
  });

  
  //incomplete bookshelf display
  function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.title;

    const textAuthor = document.createElement('h3');
    textAuthor.innerText = todoObject.author;
   
    const bookYear = document.createElement('p');
    bookYear.innerText = todoObject.year;
    
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle,textAuthor,bookYear);
   
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);
   
    if (todoObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
   
      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(todoObject.id);
      });
   
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
   
      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(todoObject.id);
      });
   
      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(todoObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
   
      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(todoObject.id);
      });
      
      container.append(checkButton, trashButton);
    }
   
    return container;
  }


  document.addEventListener(RENDER_EVENT, function () {
    console.log(todos);
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';
   
    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      uncompletedTODOList.append(todoElement);
    }
  });

  function addTaskToCompleted (todoId) {
    const todoTarget = findTodo(todoId);
   
    if (todoTarget == null) return;
   
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
  }

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';
   
    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';
   
    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted)
        uncompletedTODOList.append(todoElement);
      else
        completedTODOList.append(todoElement);
    }
  });

  function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
   
    if (todoTarget === -1) return;
   
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
   
   
  function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
   
    if (todoTarget == null) return;
   
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  
  function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }
   
    return -1;
  }


  //localstorage
  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}