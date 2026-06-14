const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const folderSelect = document.getElementById('folder-select');

// Function to render tasks
function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.name;
        if (task.completed) {
            taskItem.classList.add('completed');
            taskItem.innerHTML += ' ✔'; // Add tick mark for completed tasks
        }
        taskItem.addEventListener('click', () => toggleTaskCompletion(task));
        taskList.appendChild(taskItem);
    });
}

// Function to toggle task completion
function toggleTaskCompletion(task) {
    task.completed = !task.completed;
    updateTaskList();
}

// Function to update the task list
function updateTaskList() {
    const tasks = getTasks(); // Assume this function retrieves tasks from storage
    renderTasks(tasks);
}

// Function to add a new task
function addTask() {
    const taskName = taskInput.value.trim();
    if (taskName) {
        const newTask = { name: taskName, completed: false };
        saveTask(newTask); // Assume this function saves the task to storage
        taskInput.value = '';
        updateTaskList();
    }
}

// Event listener for adding tasks
document.getElementById('add-task-button').addEventListener('click', addTask);

// Initialize the UI
updateTaskList();