// firebase.js
console.log("🔥 Loading Firebase modules...");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("✅ Firebase modules imported");

const firebaseConfig = {
  apiKey: "AIzaSyCCT619qICcyn_0jLSRZq-KcjYgJVjBwg4",
  authDomain: "xploitix-c2d84.firebaseapp.com",
  projectId: "xploitix-c2d84",
  storageBucket: "xploitix-c2d84.firebasestorage.app",
  messagingSenderId: "465564339732",
  appId: "1:465564339732:web:4d7b34ae73ddfc4507e101",
  measurementId: "G-3WYCF075T1"
};

console.log("🔥 Initializing Firebase app...");
const app = initializeApp(firebaseConfig);
console.log("✅ Firebase app initialized:", app.name);

console.log("🔥 Getting Firestore instance...");
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

console.log("✅ Firestore instance created:", db.type);
console.log("✅ Firebase setup complete!");