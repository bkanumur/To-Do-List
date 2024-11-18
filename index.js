const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".input");
const ulEl = document.querySelector(".list");
const recycleListEl = document.querySelector(".recycle-list");
const clearBtn = document.querySelector(".clear-btn");
const recycleBinBtn = document.querySelector(".recycle-bin-btn");
const emptyRecycleBinBtn = document.querySelector(".empty-recycle-bin-btn");
const progressBarEl = document.querySelector(".progress-bar");
const pointsEl = document.querySelector(".points");

let list = JSON.parse(localStorage.getItem("list")) || [];
let recycleBin = JSON.parse(localStorage.getItem("recycleBin")) || [];
let points = parseInt(localStorage.getItem("points")) || 0;

if (list.length) {
  list.forEach((task) => renderTask(task));
}
if (recycleBin.length) {
  recycleBin.forEach((task) => renderRecycleTask(task));
}
updateProgress();

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const taskName = inputEl.value.trim();
  const dueDate = document.querySelector(".date-picker").value;
  const priority = document.querySelector(".priority").value;

  if (taskName) {
    const newTask = { name: taskName, dueDate, priority, checked: false };
    list.push(newTask);
    renderTask(newTask);
    saveToLocalStorage();
    updateProgress();
  }
  inputEl.value = "";
});

ulEl.addEventListener("click", (event) => {
  const target = event.target;
  const liEl = target.closest("li");

  if (target.classList.contains("fa-check-square")) {
    liEl.classList.toggle("checked");
    const taskName = liEl.dataset.name;

    list = list.map((task) =>
      task.name === taskName ? { ...task, checked: !task.checked } : task
    );
    saveToLocalStorage();
    updateProgress();
  }

  if (target.classList.contains("fa-trash")) {
    const taskName = liEl.dataset.name;
    const taskToRecycle = list.find((task) => task.name === taskName);
    list = list.filter((task) => task.name !== taskName);
    recycleBin.push(taskToRecycle);
    liEl.remove();
    renderRecycleTask(taskToRecycle);
    saveToLocalStorage();
    updateProgress();
  }
});

clearBtn.addEventListener("click", () => {
  if (list.length > 0 && confirm("Are you sure you want to clear all tasks?")) {
    recycleBin.push(...list);
    list = [];
    ulEl.innerHTML = "";
    saveToLocalStorage();
    updateProgress();
    recycleBin.forEach((task) => renderRecycleTask(task));
  }
});

recycleBinBtn.addEventListener("click", () => {
  document.querySelector(".recycle-bin").classList.toggle("visible");
});

emptyRecycleBinBtn.addEventListener("click", () => {
  if (recycleBin.length > 0 && confirm("Are you sure you want to empty the recycle bin?")) {
    recycleBin = [];
    recycleListEl.innerHTML = "";
    saveToLocalStorage();
  }
});

function renderTask(task) {
  const liEl = document.createElement("li");
  liEl.dataset.name = task.name;
  liEl.innerHTML = `
    <span>${task.name} (${task.dueDate || "No due date"})</span>
    <span class="priority-label ${task.priority.toLowerCase()}">${task.priority}</span>
    <div>
      <i class="fas fa-check-square"></i>
      <i class="fas fa-trash"></i>
    </div>
  `;
  if (task.checked) liEl.classList.add("checked");
  ulEl.appendChild(liEl);
}

function renderRecycleTask(task) {
  const liEl = document.createElement("li");
  liEl.dataset.name = task.name;
  liEl.innerHTML = `
    <span>${task.name} (${task.dueDate || "No due date"})</span>
    <span class="priority-label ${task.priority.toLowerCase()}">${task.priority}</span>
    <button class="restore-btn">Restore</button>
  `;
  recycleListEl.appendChild(liEl);

  liEl.querySelector(".restore-btn").addEventListener("click", () => {
    list.push(task);
    recycleBin = recycleBin.filter((t) => t.name !== task.name);
    liEl.remove();
    renderTask(task);
    saveToLocalStorage();
    updateProgress();
  });
}

function saveToLocalStorage() {
  localStorage.setItem("list", JSON.stringify(list));
  localStorage.setItem("recycleBin", JSON.stringify(recycleBin));
  localStorage.setItem("points", points);
}

function updateProgress() {
  const completedTasks = list.filter((task) => task.checked).length;
  const totalTasks = list.length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  progressBarEl.style.width = `${progress}%`;
}