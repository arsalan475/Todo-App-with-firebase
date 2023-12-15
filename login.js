import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { auth } from "./config.js";

const form = document.querySelector("form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const uid = user.uid;
//     console.log(uid);
//   } else {
//     window.location = "index.html";
//   }
// });

form.addEventListener("submit", function (event) {
  event.preventDefault();
  loginAccount();
});

function loginAccount() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(function (responsed) {
      window.location = "./ui.html";
    })
    .catch(function (err) {
      console.log(err);
    });
}
