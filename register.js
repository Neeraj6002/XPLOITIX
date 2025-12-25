import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("✅ register.js loaded");
console.log("✅ db object:", db);

const form = document.getElementById("registration-form");

console.log("✅ Form element:", form);

// Function to show toast notification
function showToast(title, description, isSuccess = true) {
  console.log("🔔 Showing toast:", title, description);
  
  // Create toast element if it doesn't exist
  let toast = document.getElementById("toast");
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-title"></div>
      <div class="toast-description"></div>
    `;
    document.body.appendChild(toast);
    
    // Add toast styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #39ff14;
        border-radius: 8px;
        padding: 1.5rem;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
        transform: translateX(150%);
        transition: transform 0.3s ease;
        z-index: 10000;
      }
      .toast.show {
        transform: translateX(0);
      }
      .toast-title {
        color: #39ff14;
        font-family: 'Orbitron', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      .toast-description {
        color: #a0a0a0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);
  }
  
  const toastTitle = toast.querySelector('.toast-title');
  const toastDescription = toast.querySelector('.toast-description');
  
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

    const btn = form.querySelector('button[type="submit"]');
    
    if (!btn) {
      console.error("❌ Submit button not found!");
      return;
    }
    
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "PROCESSING...";

    try {
      // Get form values using the correct input names
      const formData = {
        fullName: form.elements['fullName'].value.trim(),
        email: form.elements['email'].value.trim(),
        phone: form.elements['phone'].value.trim(),
        college: form.elements['college'].value.trim(),
        department: form.elements['department'].value.trim(),
        isIEEEMember: form.elements['isIEEEMember'].value,
        createdAt: serverTimestamp()
      };

      console.log("📦 Form data:", formData);
      console.log("🔥 Attempting to add to Firestore...");

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
      
      // Show error toast
      showToast(
        "Registration Failed",
        `Error: ${error.message || error.code || 'Unknown error'}`,
        false
      );
    }

    // Re-enable button
    btn.disabled = false;
    btn.textContent = originalText;
  });
  
  console.log("✅ Form listener added successfully");
} else {
  console.error("❌ CRITICAL: Form element with id='registration-form' not found!");
}