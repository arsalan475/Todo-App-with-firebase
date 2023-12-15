// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWpzzuFzliKQWC0fmR3EP9PHgXPT35d0w",
  authDomain: "blogging-app-11dec.firebaseapp.com",
  projectId: "blogging-app-11dec",
  storageBucket: "blogging-app-11dec.appspot.com",
  messagingSenderId: "110905258270",
  appId: "1:110905258270:web:d106047e54275f515c590f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const createEmailPassword = createUserWithEmailAndPassword;
