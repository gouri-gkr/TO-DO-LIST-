const STORAGE_KEY = 'todoAppData_v1';
const THEME_KEY = 'todoBgColor_v1';

document.addEventListener('DOMContentLoaded', () => {
  // Query DOM elements (may be null if HTML changed)
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const colorPicker = document.getElementById('bg-color-picker');

  // Defensive checks
  if (!taskInput || !addTaskBtn || !taskList) {
    console.warn('Missing core UI elements. Ensure index.html contains #task-input, #add-task-btn, #task-list');
    return;
  }

  // Load data
  let data = loadData();
  if (!data || !data.folders || Object.keys(data.folders).length === 0) {
    data = { folders: {}, activeFolderId: null };
    const defaultId = createId();
    data.folders[defaultId] = { id: defaultId, name: 'Inbox', tasks: [] };
    data.activeFolderId = defaultId;
    saveData();
  }

  // Apply saved color and ensure picker matches
  const savedColor = localStorage.getItem(THEME_KEY);
  if (savedColor) applyBgColor(savedColor);
  if (colorPicker) {
    const computedBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-1').trim() || '#e8f7ff';
    try { colorPicker.value = savedColor || computedBg; } catch (e) { /* ignore invalid */ }
    const onColor = (e) => {
      const c = e.target.value;
      if (c) {
        applyBgColor(c);
        localStorage.setItem(THEME_KEY, c);
      }
    };
    colorPicker.addEventListener('input', onColor);
    colorPicker.addEventListener('change', onColor);
  }

  // Render tasks
  renderTasks();

  // Events: add task
  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;
    addTask(text);
    taskInput.value = '';
    taskInput.focus();
  });
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTaskBtn.click();
  });

  // Delegated events for tasks
  taskList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-task-id]');
    if (!li) return;
    const taskId = li.getAttribute('data-task-id');

    if (e.target.matches('.toggle')) {
      toggleDone(taskId);
      return;
    }
    if (e.target.closest('.edit-task')) {
      startEditTask(li, taskId);
      return;
    }
    if (e.target.closest('.delete-task')) {
      deleteTask(taskId);
      return;
    }
  });

  taskList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('.edit-input')) finishEditTask(e.target);
    if (e.key === 'Escape' && e.target.matches('.edit-input')) cancelEditTask();
  });

  // Data helpers
  function createId() { return 'id-' + Math.random().toString(36).slice(2, 9); }
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error('loadData error', err);
      return null;
    }
  }
  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) { console.error('saveData error', err); }
  }

  // Render
  function renderTasks() {
    taskList.innerHTML = '';
    const folder = data.folders[data.activeFolderId];
    if (!folder) return;
    folder.tasks.forEach(task => {
      const li = document.createElement('li');
      li.setAttribute('data-task-id', task.id);
      li.className = 'task-item';
      li.innerHTML = `
        <input type="checkbox" class="toggle" ${task.done ? 'checked' : ''} />
        <span class="task-text ${task.done ? 'done' : ''}">${escapeHtml(task.text)}</span>
        <div class="task-controls">
          <button class="icon-small edit-task" title="Edit" aria-label="Edit">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l3-1 11-11 1-3-3 1L4 20z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="icon-small delete-task" title="Delete" aria-label="Delete">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6v12M16 6v12M10 6V4h4v2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  // Task actions
  function addTask(text) {
    const folder = data.folders[data.activeFolderId];
    if (!folder) return;
    folder.tasks.push({ id: createId(), text, done: false });
    saveData(); renderTasks();
  }
  function toggleDone(taskId) {
    const folder = data.folders[data.activeFolderId]; if (!folder) return;
    const task = folder.tasks.find(t => t.id === taskId); if (!task) return;
    task.done = !task.done; saveData(); renderTasks();
  }
  function deleteTask(taskId) {
    const folder = data.folders[data.activeFolderId]; if (!folder) return;
    folder.tasks = folder.tasks.filter(t => t.id !== taskId); saveData(); renderTasks();
  }
  function startEditTask(li, taskId) {
    const folder = data.folders[data.activeFolderId]; if (!folder) return;
    const task = folder.tasks.find(t => t.id === taskId); if (!task) return;
    li.innerHTML = `<input class="edit-input" value="${escapeHtml(task.text)}" /><button class="edit-save">Save</button><button class="edit-cancel">Cancel</button>`;
    const input = li.querySelector('.edit-input'); input.focus();
    li.querySelector('.edit-save').addEventListener('click', () => finishEditTask(input));
    li.querySelector('.edit-cancel').addEventListener('click', () => cancelEditTask());
  }
  function finishEditTask(input) {
    const li = input.closest('li[data-task-id]'); const taskId = li && li.getAttribute('data-task-id');
    const folder = data.folders[data.activeFolderId]; if (!folder) return;
    const task = folder.tasks.find(t => t.id === taskId); if (!task) return;
    const newText = input.value.trim(); if (!newText) { alert('Task text cannot be empty'); return; }
    task.text = newText; saveData(); renderTasks();
  }
  function cancelEditTask() { renderTasks(); }

  // Color helpers
  function applyBgColor(hex) {
    if (!hex) return;
    document.documentElement.style.setProperty('--bg-1', hex);
    const light = mixWithWhite(hex, 0.88);
    document.documentElement.style.setProperty('--bg-2', light);
  }
  function mixWithWhite(hex, weight) {
    if (!/^#([0-9a-f]{6})$/i.test(hex)) return hex;
    const r = parseInt(hex.substr(1,2),16), g = parseInt(hex.substr(3,2),16), b = parseInt(hex.substr(5,2),16);
    const nr = Math.round(r + (255 - r) * (1 - weight));
    const ng = Math.round(g + (255 - g) * (1 - weight));
    const nb = Math.round(b + (255 - b) * (1 - weight));
    return '#' + [nr,ng,nb].map(v => v.toString(16).padStart(2,'0')).join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
});