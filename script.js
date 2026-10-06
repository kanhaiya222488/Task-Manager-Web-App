// Task Manager - plain JavaScript (no libraries).
// Tasks are kept in an array and saved in the browser's localStorage,
// so they are still there after you refresh or close the page.

const STORAGE_KEY = "task-manager-tasks";

// ---------- State ----------
let tasks = loadTasks();       // array of task objects
let currentFilter = "all";     // "all" | "active" | "completed"
let searchText = "";

// ---------- Page elements ----------
const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const priorityInput = document.getElementById("task-priority");
const dueInput = document.getElementById("task-due");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter");
const list = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const counter = document.getElementById("counter");
const clearButton = document.getElementById("clear-completed");

// ---------- Saving and loading ----------
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------- Task operations ----------
function addTask(title, priority, dueDate) {
  title = title.trim();
  if (title === "") return;          // ignore empty titles

  tasks.unshift({
    id: Date.now(),                  // unique id based on the current time
    title: title,
    priority: priority,              // "low" | "medium" | "high"
    dueDate: dueDate,                // "YYYY-MM-DD" or ""
    completed: false
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  const newTitle = prompt("Edit task:", task.title);
  if (newTitle !== null && newTitle.trim() !== "") {
    task.title = newTitle.trim();
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}

// ---------- Helpers ----------
function isOverdue(task) {
  if (task.completed || task.dueDate === "") return false;
  const today = new Date().toISOString().slice(0, 10);   // today as YYYY-MM-DD
  return task.dueDate < today;
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return day + "-" + month + "-" + year;
}

// Returns the tasks that match the selected filter and the search text.
function getVisibleTasks() {
  return tasks.filter(task => {
    if (currentFilter === "active" && task.completed) return false;
    if (currentFilter === "completed" && !task.completed) return false;
    return task.title.toLowerCase().includes(searchText.toLowerCase());
  });
}

// ---------- Drawing the page ----------
function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = "task" + (task.completed ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const info = document.createElement("div");
  info.className = "task-info";

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;       // textContent keeps user input safe

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const badge = document.createElement("span");
  badge.className = "badge " + task.priority;
  badge.textContent = task.priority;
  meta.appendChild(badge);

  if (task.dueDate !== "") {
    const due = document.createElement("span");
    due.textContent = "Due " + formatDate(task.dueDate);
    if (isOverdue(task)) {
      due.className = "overdue";
      due.textContent += " (overdue)";
    }
    meta.appendChild(due);
  }

  info.appendChild(title);
  info.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "actions";

  const editButton = document.createElement("button");
  editButton.className = "icon-button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => editTask(task.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "icon-button delete";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  item.appendChild(checkbox);
  item.appendChild(info);
  item.appendChild(actions);
  return item;
}

function render() {
  list.innerHTML = "";
  const visible = getVisibleTasks();
  visible.forEach(task => list.appendChild(createTaskElement(task)));

  emptyMessage.hidden = visible.length !== 0;

  const remaining = tasks.filter(t => !t.completed).length;
  counter.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");

  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  });
}

// ---------- Events ----------
form.addEventListener("submit", event => {
  event.preventDefault();               // stop the page from reloading
  addTask(titleInput.value, priorityInput.value, dueInput.value);
  form.reset();
  priorityInput.value = "medium";
  titleInput.focus();
});

searchInput.addEventListener("input", () => {
  searchText = searchInput.value;
  render();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    render();
  });
});

clearButton.addEventListener("click", clearCompleted);

render();
