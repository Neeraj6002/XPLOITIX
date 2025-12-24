// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getFirestore } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCT619qICcyn_0jLSRZq-KcjYgJVjBwg4",
  authDomain: "xploitix-c2d84.firebaseapp.com",
  projectId: "xploitix-c2d84",
  storageBucket: "xploitix-c2d84.firebasestorage.app",
  messagingSenderId: "465564339732",
  appId: "1:465564339732:web:4d7b34ae73ddfc4507e101",
  measurementId: "G-3WYCF075T1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

