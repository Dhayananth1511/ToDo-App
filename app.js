// Base API URL (will connect to backend later)
const BASE_URL = "";
const API = (path) => `${BASE_URL}/api${path}`;

// Select elements
const list = document.getElementById("list");
const newTitle = document.getElementById("newTitle");
const addBtn = document.getElementById("addBtn");
const countEl = document.getElementById("count");
const tabs = document.querySelectorAll(".tab");

// State
let todos = [];
let filter = "all";

// --- Helpers ---
function setCount() {
  const n =
    filter === "active"
      ? todos.filter((t) => !t.completed).length
      : filter === "completed"
      ? todos.filter((t) => t.completed).length
      : todos.length;

  countEl.textContent = `${n} item${n === 1 ? "" : "s"}`;
}

function itemTemplate(t) {
  const li = document.createElement("li");
  li.className = `item ${t.completed ? "completed" : ""}`;
  li.dataset.id = t.id;

  li.innerHTML = `
    <input type="checkbox" class="toggle" ${t.completed ? "checked" : ""}>
    <input class="title" value="${t.title}">
    <button class="delete">Delete</button>
  `;

  // Toggle complete
  li.querySelector(".toggle").addEventListener("change", (e) => {
    t.completed = e.target.checked;
    render();
  });

  // Edit title
  const titleEl = li.querySelector(".title");
  titleEl.addEventListener("blur", () => {
    const v = titleEl.value.trim();
    if (v) {
      t.title = v;
    } else {
      titleEl.value = t.title;
    }
    render();
  });

  // Delete
  li.querySelector(".delete").addEventListener("click", () => {
    todos = todos.filter((todo) => todo.id !== t.id);
    render();
  });

  return li;
}

function render() {
  list.innerHTML = "";

  const filtered =
    filter === "active"
      ? todos.filter((t) => !t.completed)
      : filter === "completed"
      ? todos.filter((t) => t.completed)
      : todos;

  filtered.forEach((t) => list.appendChild(itemTemplate(t)));

  setCount();
}

// --- Events ---
addBtn.addEventListener("click", () => {
  const title = newTitle.value.trim();
  if (!title) return;

  const todo = {
    id: Date.now().toString(),
    title,
    completed: false,
  };

  todos.unshift(todo);
  newTitle.value = "";
  render();
});

newTitle.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

// Filters
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((x) => x.classList.remove("active"));
    tab.classList.add("active");
    filter = tab.dataset.filter;
    render();
  });
});

// Initial render
render();
