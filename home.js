import { app } from "./config.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth } from "./config.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
  } else {
    window.location = "login.html";
  }
});

const db = getFirestore(app);

const todoAppContainer = document.querySelector(".todo-app");
const inputBox = document.querySelector("#content");
let todoContainer;

const addBtn = document.querySelector(".add-todo");
const eiditBtn = document.querySelector(".edit");
let todosBtns;
const clear = document.querySelector(".clear");

const footer = document.querySelector(".footer");
const count = document.querySelector(".count");
let todos = [];
let disabled = true;
let index;

async function showData() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.dir(`${doc.id} => ${doc.data()}`);
    todos.push(doc.data());
    console.log(todos);
  });
  todos.forEach((el) => {
    creatingHtml(el.title);
  });
  count.textContent = todos.length;
}

showData();

async function addTodos(e) {
  if (!inputBox.value) return;
  creatingHtml(inputBox.value);

  if (e.key === "Enter" || e.type === "click") {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        title: inputBox.value,
        uid: auth.currentUser.uid,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    inputBox.value = "";

    console.log(todos.length);
  }
}

function creatingHtml(el, i) {
  let html = `<div class="todos">
    <input type="text" value="${el}" class="todo-content" disabled/>
    <div class='btns'>
    <span class="edit" title="Edit todo">+</span>
    <span class="dlt" title="Delete todo">-</span>
    </div>
  </div>
  `;
  document.querySelector(".data").insertAdjacentHTML("afterbegin", html);
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

function deletTodo(e) {
  if (!e.target.classList.contains("dlt")) return;
  const todo = e.target.closest(".todos").firstElementChild;
  e.target.closest(".todos").remove();
}

function editTodo(e) {
  if (!e.target.classList.contains("edit")) return;
  const todo = e.target.closest(".todos").firstElementChild;
  if (disabled) {
    todo.disabled = false;
    todo.focus();
    todo.classList.add("active");
  }

  if (!disabled) {
    todo.disabled = true;
    todo.classList.remove("active");
  }
  disabled = !disabled;
}

function clearAll() {
  document.querySelectorAll(".todos").forEach(function (el) {
    el.remove();
  });
}

let logout = document.querySelector(".logout");

addBtn.addEventListener("click", addTodos);
todoAppContainer.addEventListener("mouseover", (e) => toggleBtns(e, "flex"));
todoAppContainer.addEventListener("mouseout", (e) => toggleBtns(e, "none"));

todoAppContainer.addEventListener("click", deletTodo);
todoAppContainer.addEventListener("click", editTodo);
clear.addEventListener("click", clearAll);
window.addEventListener("load", () => inputBox.focus());

logout.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location = "./login.html";
    })
    .catch((error) => {
      console.log(error);
    });
});
