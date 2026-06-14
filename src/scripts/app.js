const taskList = [];
const folderList = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadFolders();
    setupEventListeners();
});

// Load tasks from storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

// Load folders from storage
function loadFolders() {
    const folders = JSON.parse(localStorage.getItem('folders')) || [];
    folders.forEach(folder => {
        addFolderToDOM(folder);
    });
}

// Setup event listeners for task and folder actions
function setupEventListeners() {
    document.getElementById('add-task-btn').addEventListener('click', addTask);
    document.getElementById('add-folder-btn').addEventListener('click', addFolder);
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById('task-input');
    const task = {
        id: Date.now(),
        name: taskInput.value,
        completed: false
    };
    taskList.push(task);
    addTaskToDOM(task);
    saveTasks();
    taskInput.value = '';
}

// Add task to the DOM
function addTaskToDOM(task) {
    const taskListElement = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.textContent = task.name;
    taskItem.className = task.completed ? 'completed' : '';
    taskItem.addEventListener('click', () => toggleTaskCompletion(task.id));
    taskListElement.appendChild(taskItem);
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
    const task = taskList.find(t => t.id === taskId);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Render tasks in the DOM
function renderTasks() {
    const taskListElement = document.getElementById('task-list');
    taskListElement.innerHTML = '';
    taskList.forEach(task => addTaskToDOM(task));
}

// Add a new folder
function addFolder() {
    const folderInput = document.getElementById('folder-input');
    const folder = {
        id: Date.now(),
        name: folderInput.value
    };
    folderList.push(folder);
    addFolderToDOM(folder);
    saveFolders();
    folderInput.value = '';
}

// Add folder to the DOM
function addFolderToDOM(folder) {
    const folderListElement = document.getElementById('folder-list');
    const folderItem = document.createElement('li');
    folderItem.textContent = folder.name;
    folderListElement.appendChild(folderItem);
}

// Save folders to local storage
function saveFolders() {
    localStorage.setItem('folders', JSON.stringify(folderList));
}