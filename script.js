// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM elements
const taskNameInput = document.getElementById("taskName");
const categoryInput = document.getElementById("category");
const deadlineInput = document.getElementById("deadline");
const statusInput = document.getElementById("status");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterStatus = document.getElementById("filterStatus");
const filterCategory = document.getElementById("filterCategory");

// Add Task
addTaskBtn.addEventListener("click", addTask);

function addTask() {
  const task = {
    id: Date.now(),
    name: taskNameInput.value.trim(),
    category: categoryInput.value.trim(),
    deadline: deadlineInput.value,
    status: statusInput.value
  };

  if (!task.name || !task.category || !task.deadline) return;

  tasks.push(task);
  saveTasks();
  updateCategoryFilter();
  renderTasks(tasks);

  taskNameInput.value = "";
  categoryInput.value = "";
  deadlineInput.value = "";
}

// Render Tasks
function renderTasks(taskArray) {
  taskList.innerHTML = "";
  checkOverdueTasks();

  taskArray.forEach(task => {
    const tr = document.createElement("tr");

    if (task.status === "Overdue") tr.classList.add("overdue");

    tr.innerHTML = `
      <td>${task.name}</td>
      <td>${task.category}</td>
      <td>${task.deadline}</td>
      <td>${task.status}</td>
      <td>
        <select data-id="${task.id}">
          <option ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option ${task.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
      </td>
    `;

    taskList.appendChild(tr);
  });
}

// Update Status (Event Delegation)
taskList.addEventListener("change", (e) => {
  if (e.target.tagName === "SELECT") {
    const task = tasks.find(t => t.id == e.target.dataset.id);
    task.status = e.target.value;
    saveTasks();
    renderTasks(tasks);
  }
});

// Overdue Check
function checkOverdueTasks() {
  const today = new Date().toISOString().split("T")[0];

  tasks.forEach(task => {
    if (task.deadline < today && task.status !== "Completed") {
      task.status = "Overdue";
    }
  });

  saveTasks();
}

// Filters
filterStatus.addEventListener("change", applyFilters);
filterCategory.addEventListener("change", applyFilters);

function applyFilters() {
  let filtered = tasks;

  if (filterStatus.value !== "All") {
    filtered = filtered.filter(t => t.status === filterStatus.value);
  }

  if (filterCategory.value !== "All") {
    filtered = filtered.filter(t => t.category === filterCategory.value);
  }

  renderTasks(filtered);
}

// Category Filter Setup
function updateCategoryFilter() {
  const categories = [...new Set(tasks.map(t => t.category))];
  filterCategory.innerHTML = `<option value="All">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filterCategory.appendChild(option);
  });
}

// Local Storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initial Load
updateCategoryFilter();
renderTasks(tasks);
