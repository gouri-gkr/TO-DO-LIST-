const STORAGE_KEY = 'dailyTasks';

export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function getTasks() {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
}

export function clearTasks() {
    localStorage.removeItem(STORAGE_KEY);
}