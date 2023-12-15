const todoAppContainer = document.querySelector(".todo-app");
const inputBox = document.querySelector("#content");
let todoContainer;

const addBtn = document.querySelector(".add-todo");
const eiditBtn = document.querySelector(".edit");
let todosBtns;
const clear = document.querySelector(".clear");

const footer = document.querySelector(".footer");
const count = document.querySelector(".count");
let disabled = true;

let stored = [];
let dateArr = [];
let arr;
let arr2;
let index;

if (localStorage.getItem("todoText")) {
  arr = localStorage.getItem("todoText").split(",");
  arr2 = localStorage.getItem("date").split(",");
  count.textContent = arr.length;
  stored.push(...arr);
  dateArr.push(...arr2);
}

stored.forEach(function (el, i) {
  if (el) {
    creatingHtml(el, dateArr[i]);
    todoContainer = document.querySelector(".todo-content");
    todosBtns = document.querySelectorAll(".todos span");
  }
});

function creatingHtml(el, i) {
  let html = `<div class="todos">
    <input type="text" value="${el}" class="todo-content" disabled/>
    <div class='btns'>
    <span class="edit" title="Edit todo">+</span>
    <span class="dlt" title="Delete todo">-</span>
    </div>
    <div class='date'>${i}</div>
  </div>
  `;
  document.querySelector(".data").insertAdjacentHTML("afterbegin", html);
}

function addTodos(e) {
  if (!inputBox.value) return;
  if (e.key === "Enter" || e.type === "click") {
    footer.style.display = "flex";
    creatingHtml(inputBox.value, new Date().toDateString());
    saveToLocalStorage();
    count.textContent = stored.length;
    inputBox.value = "";
  }
}

function deletTodo(e) {
  if (!e.target.classList.contains("dlt")) return;
  const todo = e.target.closest(".todos").firstElementChild;
  index = stored.indexOf(todo.value);
  stored.splice(index, 1);
  localStorage.setItem("todoText", stored);
  e.target.closest(".todos").remove();
  count.textContent = stored.length;
}

function editTodo(e) {
  if (!e.target.classList.contains("edit")) return;
  const todo = e.target.closest(".todos").firstElementChild;
  if (disabled) {
    todo.disabled = false;
    todo.focus();
    index = stored.indexOf(todo.value);
    console.log(index, todo.value);
    todo.classList.add("active");
  }

  if (!disabled) {
    todo.disabled = true;
    todo.classList.remove("active");
    stored.splice(index, 1, todo.value);
    localStorage.setItem("todoText", stored);
  }
  disabled = !disabled;
}

function saveToLocalStorage() {
  stored.push(inputBox.value);
  dateArr.push(new Date().toDateString());
  localStorage.setItem("todoText", stored);
  localStorage.setItem("date", dateArr);
}

function clearAll() {
  stored.length = 0;
  localStorage.setItem("todoText", stored);
  count.textContent = stored.length;
  document.querySelectorAll(".todos").forEach(function (el) {
    el.remove();
  });
}

function toggleBtns(e, displayValue) {
  if (
    e.target.classList.contains("todo-content") ||
    e.target.classList.contains("edit") ||
    e.target.classList.contains("dlt")
  ) {
    e.target
      .closest(".todos")
      .querySelectorAll("span")
      .forEach((el) => (el.style.display = displayValue));
  }
}

todoAppContainer.addEventListener("click", deletTodo);
todoAppContainer.addEventListener("click", editTodo);
clear.addEventListener("click", clearAll);
addBtn.addEventListener("click", addTodos);
document.addEventListener("keydown", addTodos);
window.addEventListener("load", () => inputBox.focus());
todoAppContainer.addEventListener("mouseover", (e) => toggleBtns(e, "flex"));
todoAppContainer.addEventListener("mouseout", (e) => toggleBtns(e, "none"));
