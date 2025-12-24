import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("✅ register.js loaded");
console.log("✅ db object:", db);

const form = document.getElementById("registrationForm");
const toast = document.getElementById("toast");

console.log("✅ Form element:", form);
console.log("✅ Toast element:", toast);

// Function to show toast notification
function showToast(title, description, isSuccess = true) {
  console.log("🔔 Showing toast:", title, description);
  
  if (!toast) {
    console.error("❌ Toast element not found!");
    alert(title + ": " + description);
    return;
  }
  
  const toastTitle = toast.querySelector('.toast-title');
  const toastDescription = toast.querySelector('.toast-description');
  
  if (!toastTitle || !toastDescription) {
    console.error("❌ Toast children not found!");
    alert(title + ": " + description);
    return;
  }
  
  toastTitle.textContent = title;
  toastDescription.textContent = description;
  
  if (!isSuccess) {
    toast.style.borderColor = '#ff3939';
    toastTitle.style.color = '#ff3939';
  } else {
    toast.style.borderColor = '#39ff14';
    toastTitle.style.color = '#39ff14';
  }
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

if (form) {
  console.log("✅ Adding form submit listener");
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📝 Form submitted!");

    const btn = document.getElementById("submitBtn");
    
    if (!btn) {
      console.error("❌ Submit button not found!");
      return;
    }
    
    btn.disabled = true;
    btn.innerText = "PROCESSING...";

    try {
      // Get form values
      const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        year: document.getElementById("year").value,
        college: document.getElementById("college").value.trim(),
        experience: document.getElementById("experience").value,
        createdAt: serverTimestamp()
      };

      console.log("📦 Form data:", formData);
      console.log("🔥 Attempting to add to Firestore...");
      console.log("🔥 Collection path: registrations");
      console.log("🔥 Database object:", db);

      // Add to Firestore
      const docRef = await addDoc(collection(db, "registrations"), formData);
      
      console.log("✅ SUCCESS! Document written with ID:", docRef.id);
      
      // Show success toast
      showToast(
        "Registration Successful!",
        "Welcome to XPLOITIX 2026. Check your email for confirmation."
      );
      
      // Reset form
      form.reset();

    } catch (error) {
      console.error("❌ ERROR adding document:", error);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error message:", error.message);
      console.error("❌ Full error:", error);
      
      // Show error toast
      showToast(
        "Registration Failed",
        `Error: ${error.message || error.code || 'Unknown error'}`,
        false
      );
    }

    // Re-enable button
    btn.disabled = false;
    btn.innerText = "SUBMIT REGISTRATION";
  });
  
  console.log("✅ Form listener added successfully");
} else {
  console.error("❌ CRITICAL: Form element not found!");
}