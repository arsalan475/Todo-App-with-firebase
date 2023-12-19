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
  orderBy,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  deleteField,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth } from "./config.js";

let uid;

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    uid = user.uid;
    console.log(uid);
    showData(user);
  } else {
    window.location = "./login.html";
  }
});

// Remove the 'capital' field from the document

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

async function showData(user) {
  const q = query(
    collection(db, "users"),
    where("uid", "==", user.uid),
    orderBy("timeStamp", "desc")
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    todos.push({ ...doc.data(), docId: doc.id });
    console.log(todos);
  });
  todos.forEach((el) => {
    creatingHtml(el.title, el.docId);
  });
  count.textContent = todos.length;
}

async function addTodos(e) {
  if (!inputBox.value) return;

  try {
    const docRef = await addDoc(collection(db, "users"), {
      title: inputBox.value,
      uid: auth.currentUser.uid,
      timeStamp: Timestamp.fromDate(new Date()),
    });

    creatingHtml(inputBox.value, docRef.id);
    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  inputBox.value = "";

  // console.log(todos.length);
}

function creatingHtml(el, docId) {
  let html = `<div class="todos">
    <input type="text" value="${el}" id=${docId} class="todo-content" disabled/>
    <div class='btns'>
    <span class="edit" title="Edit todo">+</span>
    <span class="dlt" title="Delete todo">-</span>
    </div>
  </div>
  `;

  document.querySelector(".data").insertAdjacentHTML("afterbegin", html);
  count.textContent = document.querySelectorAll(".todos").length;
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

async function deletTodo(e) {
  if (!e.target.classList.contains("dlt")) return;
  const todo = e.target.closest(".todos").firstElementChild;
  e.target.closest(".todos").remove();
  console.log("runned");
  const userRef = doc(db, "users", todo.id);

  // const deleted = await updateDoc(userRef, {
  //   title: deleteField(),
  //   uid: deleteField(),
  //   timeStamp: deleteField(),
  // }).then((res) => {
  //   count.textContent = document.querySelectorAll(".todos").length;
  // });

  await deleteDoc(userRef).then((res) => {
    count.textContent = document.querySelectorAll(".todos").length;
  });
}

async function editTodo(e) {
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
    await updateDoc(doc(db, "users", todo.id), {
      title: todo.value,
    }).then((updated) => {
      console.log(updated);
    });
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

// Your Firebase configuration

// Reference to the Firestore database
