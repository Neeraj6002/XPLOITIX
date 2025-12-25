import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

console.log("✅ admin.js loaded");

let allRegistrations = [];
let filteredRegistrations = [];

// Check authentication
onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("❌ No user logged in, redirecting to login...");
    window.location.href = "login.html";
  } else {
    console.log("✅ User authenticated:", user.email);
    loadRegistrations();
  }
});

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("✅ Logged out successfully");
    window.location.href = "login.html";
  } catch (error) {
    console.error("❌ Logout error:", error);
    showToast("Logout Failed", error.message, false);
  }
});

// Load all registrations
async function loadRegistrations() {
  const spinner = document.getElementById("loadingSpinner");
  const tableContent = document.getElementById("tableContent");
  const noData = document.getElementById("noData");

  try {
    console.log("📊 Loading registrations...");
    
    const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    allRegistrations = [];
    querySnapshot.forEach((doc) => {
      allRegistrations.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Loaded ${allRegistrations.length} registrations`);
    
    filteredRegistrations = [...allRegistrations];
    
    updateStatistics();
    displayRegistrations();
    
    spinner.style.display = "none";
    
    if (allRegistrations.length === 0) {
      noData.style.display = "block";
      tableContent.style.display = "none";
    } else {
      noData.style.display = "none";
      tableContent.style.display = "block";
    }
    
  } catch (error) {
    console.error("❌ Error loading registrations:", error);
    spinner.style.display = "none";
    noData.style.display = "block";
    showToast("Error Loading Data", error.message, false);
  }
}

// Update statistics
function updateStatistics() {
  const totalCount = allRegistrations.length;
  
  // Today's registrations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = allRegistrations.filter(reg => {
    if (reg.createdAt && reg.createdAt.toDate) {
      const regDate = reg.createdAt.toDate();
      regDate.setHours(0, 0, 0, 0);
      return regDate.getTime() === today.getTime();
    }
    return false;
  }).length;
  
  // Unique colleges
  const uniqueColleges = new Set(allRegistrations.map(reg => reg.college));
  const collegeCount = uniqueColleges.size;
  
  // IEEE members count (using isIEEEMember field)
  const ieeeCount = allRegistrations.filter(reg => reg.isIEEEMember === "yes").length;
  
  document.getElementById("totalCount").textContent = totalCount;
  document.getElementById("todayCount").textContent = todayCount;
  document.getElementById("collegeCount").textContent = collegeCount;
  document.getElementById("advancedCount").textContent = ieeeCount;
  
  // Update label for clarity
  const advancedLabel = document.querySelector('#advancedCount').previousElementSibling;
  advancedLabel.textContent = "IEEE MEMBERS";
}

// Display registrations in table
function displayRegistrations() {
  const tableBody = document.getElementById("adminTable");
  tableBody.innerHTML = "";
  
  if (filteredRegistrations.length === 0) {
    document.getElementById("noData").style.display = "block";
    document.getElementById("tableContent").style.display = "none";
    return;
  }
  
  document.getElementById("noData").style.display = "none";
  document.getElementById("tableContent").style.display = "block";
  
  filteredRegistrations.forEach((reg, index) => {
    const row = document.createElement("tr");
    
    // Format date
    let dateStr = "N/A";
    if (reg.createdAt && reg.createdAt.toDate) {
      const date = reg.createdAt.toDate();
      dateStr = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Format IEEE membership
    const ieeeMember = reg.isIEEEMember === "yes" ? "✓ YES" : "✗ NO";
    const ieeeClass = reg.isIEEEMember === "yes" ? "ieee-yes" : "ieee-no";
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${reg.fullName || "N/A"}</strong></td>
      <td>${reg.email || "N/A"}</td>
      <td>${reg.phone || "N/A"}</td>
      <td>${reg.college || "N/A"}</td>
      <td>${reg.department || "N/A"}</td>
      <td><span class="${ieeeClass}">${ieeeMember}</span></td>
      <td>${dateStr}</td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Add IEEE member styling
  const style = document.createElement('style');
  style.textContent = `
    .ieee-yes {
      color: #00ff00;
      font-weight: 700;
      text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
    }
    .ieee-no {
      color: rgba(0, 255, 0, 0.4);
    }
  `;
  if (!document.getElementById('ieee-styles')) {
    style.id = 'ieee-styles';
    document.head.appendChild(style);
  }
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  applyFilters(searchTerm);
});

// Year filter
document.getElementById("yearFilter").addEventListener("change", () => {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
  applyFilters(searchTerm);
});

// Experience filter
document.getElementById("experienceFilter").addEventListener("change", () => {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
  applyFilters(searchTerm);
});

// Apply all filters
function applyFilters(searchTerm = "") {
  const yearFilter = document.getElementById("yearFilter").value;
  const experienceFilter = document.getElementById("experienceFilter").value;
  
  filteredRegistrations = allRegistrations.filter(reg => {
    // Search filter
    const matchesSearch = !searchTerm || 
      (reg.fullName && reg.fullName.toLowerCase().includes(searchTerm)) ||
      (reg.email && reg.email.toLowerCase().includes(searchTerm)) ||
      (reg.phone && reg.phone.toLowerCase().includes(searchTerm)) ||
      (reg.college && reg.college.toLowerCase().includes(searchTerm)) ||
      (reg.department && reg.department.toLowerCase().includes(searchTerm));
    
    // Year filter
    const matchesYear = !yearFilter || 
      (reg.year && reg.year.toString() === yearFilter);
    
    // Experience filter
    const matchesExperience = !experienceFilter || 
      (reg.experienceLevel && reg.experienceLevel.toLowerCase() === experienceFilter.toLowerCase());
    
    return matchesSearch && matchesYear && matchesExperience;
  });
  
  displayRegistrations();
}

// Export to CSV
document.getElementById("exportBtn").addEventListener("click", () => {
  if (filteredRegistrations.length === 0) {
    showToast("No Data", "No registrations to export.", false);
    return;
  }
  
  const headers = ["#", "Full Name", "Email", "Phone", "College", "Department", "IEEE Member", "Registered Date"];
  const csvContent = [
    headers.join(","),
    ...filteredRegistrations.map((reg, index) => {
      const dateStr = reg.createdAt && reg.createdAt.toDate 
        ? reg.createdAt.toDate().toISOString() 
        : "N/A";
      
      return [
        index + 1,
        `"${reg.fullName || ""}"`,
        `"${reg.email || ""}"`,
        `"${reg.phone || ""}"`,
        `"${reg.college || ""}"`,
        `"${reg.department || ""}"`,
        reg.isIEEEMember === "yes" ? "Yes" : "No",
        `"${dateStr}"`
      ].join(",");
    })
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `xploitix_registrations_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast("Export Successful", `Exported ${filteredRegistrations.length} registrations to CSV.`);
});

// Toast notification
function showToast(title, description, isSuccess = true) {
  let toast = document.getElementById("admin-toast");
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'admin-toast';
    toast.innerHTML = `
      <div class="toast-title"></div>
      <div class="toast-description"></div>
    `;
    document.body.appendChild(toast);
    
    const style = document.createElement('style');
    style.textContent = `
      .admin-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #00ff00;
        border-radius: 0;
        padding: 20px 24px;
        min-width: 320px;
        max-width: 500px;
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.4);
        transform: translateX(150%);
        transition: transform 0.3s ease;
        z-index: 10000;
        font-family: 'Orbitron', monospace;
      }
      .admin-toast::before,
      .admin-toast::after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        border: 2px solid #00ff00;
      }
      .admin-toast::before {
        top: -2px;
        left: -2px;
        border-right: none;
        border-bottom: none;
      }
      .admin-toast::after {
        bottom: -2px;
        right: -2px;
        border-left: none;
        border-top: none;
      }
      .admin-toast.show {
        transform: translateX(0);
      }
      .admin-toast .toast-title {
        color: #00ff00;
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
      }
      .admin-toast .toast-description {
        color: rgba(0, 255, 0, 0.8);
        font-size: 12px;
        line-height: 1.5;
      }
      .admin-toast.error {
        border-color: #ff0000;
      }
      .admin-toast.error .toast-title {
        color: #ff0000;
        text-shadow: 0 0 8px rgba(255, 0, 0, 0.5);
      }
      .admin-toast.error::before,
      .admin-toast.error::after {
        border-color: #ff0000;
      }
    `;
    document.head.appendChild(style);
  }
  
  const toastTitle = toast.querySelector('.toast-title');
  const toastDescription = toast.querySelector('.toast-description');
  
  toastTitle.textContent = title;
  toastDescription.textContent = description;
  
  if (!isSuccess) {
    toast.classList.add('error');
  } else {
    toast.classList.remove('error');
  }
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}