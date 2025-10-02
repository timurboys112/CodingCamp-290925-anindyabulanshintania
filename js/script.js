// === Ambil elemen ===
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const filterTodayBtn = document.getElementById("filter-today-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");
const statusFilter = document.getElementById("status-filter");
const todoList = document.getElementById("todo-list");
const pendingCount = document.getElementById("pending-count");
const doneCount = document.getElementById("done-count");
const progressBar = document.getElementById("progress-bar");

// Data & index edit
let todos = [];
let editIndex = null;

// === Render Todos ===
function renderTodos(list = todos) {
  todoList.innerHTML = "";

  if (list.length === 0) {
    todoList.innerHTML = `<tr><td colspan="4" style="text-align:center;">No task found</td></tr>`;
    updateCounter();
    updateProgress();
    return;
  }

  list.forEach((todo, index) => {
    const row = document.createElement("tr");
    if (todo.done) row.classList.add("done-row");

    row.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td class="${todo.done ? 'status-done' : ''}">
        ${todo.done ? "Done" : "Pending"}
      </td>
      <td>
        <button class="action-btn edit-btn" data-index="${index}">✏️</button>
        <button class="action-btn toggle-btn" data-index="${index}">✔</button>
        <button class="action-btn delete-btn" data-index="${index}">🗑</button>
      </td>
    `;

    todoList.appendChild(row);
  });

  // Event listener untuk setiap tombol
  document.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", () => editTask(btn.dataset.index))
  );
  document.querySelectorAll(".toggle-btn").forEach(btn =>
    btn.addEventListener("click", () => toggleStatus(btn.dataset.index))
  );
  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", () => deleteTask(btn.dataset.index))
  );

  updateCounter();
  updateProgress();
}

// === Tambah atau Update Task ===
function addTodo() {
  const task = todoInput.value.trim();
  const date = dateInput.value;

  if (task === "" || date === "") {
    alert("Please enter task and date");
    return;
  }

  if (editIndex === null) {
    todos.push({ task, date, done: false });
  } else {
    todos[editIndex].task = task;
    todos[editIndex].date = date;
    editIndex = null;
    addBtn.textContent = "+";
  }

  todoInput.value = "";
  dateInput.value = "";
  renderTodos();
}

// === Edit Task ===
function editTask(index) {
  todoInput.value = todos[index].task;
  dateInput.value = todos[index].date;
  editIndex = index;
  addBtn.textContent = "Update";
}

// === Hapus Task ===
function deleteTask(index) {
  todos.splice(index, 1);
  renderTodos();
}

// === Toggle Status ===
function toggleStatus(index) {
  todos[index].done = !todos[index].done;
  renderTodos();
}

// === Hapus Semua ===
function deleteAll() {
  todos = [];
  renderTodos();
}

// === Filter Hari Ini ===
function filterToday() {
  const today = new Date().toISOString().split("T")[0];
  const filtered = todos.filter(todo => todo.date === today);
  renderTodos(filtered);
}

// === Filter by Status ===
function filterByStatus() {
  let filtered = [...todos];
  const value = statusFilter.value;

  if (value === "pending") {
    filtered = todos.filter(todo => !todo.done);
  } else if (value === "done") {
    filtered = todos.filter(todo => todo.done);
  }

  renderTodos(filtered);
}

// === Update Counter ===
function updateCounter() {
  const pending = todos.filter(todo => !todo.done).length;
  const done = todos.filter(todo => todo.done).length;
  pendingCount.textContent = `Pending: ${pending}`;
  doneCount.textContent = `Done: ${done}`;
}

// === Update Progress Bar ===
function updateProgress() {
  if (todos.length === 0) {
    progressBar.style.width = "0%";
    return;
  }
  const done = todos.filter(todo => todo.done).length;
  const percent = Math.round((done / todos.length) * 100);
  progressBar.style.width = percent + "%";
}

// === Event Listeners ===
addBtn.addEventListener("click", addTodo);
deleteAllBtn.addEventListener("click", deleteAll);
filterTodayBtn.addEventListener("click", filterToday);
statusFilter.addEventListener("change", filterByStatus);

// Render awal
renderTodos();