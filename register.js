import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("registrationForm"); // ✅ FIX
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.innerText = "PROCESSING...";

  try {
    await addDoc(collection(db, "registrations"), {
      name: document.getElementById("name").value.trim(),          // ✅ FIX
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      year: document.getElementById("year").value,
      college: document.getElementById("college").value.trim(),
      experience: document.getElementById("experience").value,
      createdAt: serverTimestamp()
    });

    msg.style.color = "#39ff14";
    msg.innerText = "Registration successful!";
    form.reset();

  } catch (error) {
    console.error(error);
    msg.style.color = "red";
    msg.innerText = "Firestore Error: " + error.code;
  }

  btn.disabled = false;
  btn.innerText = "SUBMIT REGISTRATION";
});
