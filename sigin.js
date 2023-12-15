// import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { auth, createEmailPassword } from "./config.js";

const form = document.querySelector("form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  createAccount();
});

function createAccount() {
  createEmailPassword(auth, email.value, password.value).then(function (
    responsed
  ) {
    window.location = "./login.html";
  });
}
