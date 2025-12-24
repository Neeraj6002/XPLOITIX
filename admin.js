import { db, auth } from './firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

console.log("🚀 Admin.js loaded");

const tableBody = document.getElementById('adminTable');
const searchInput = document.getElementById('searchInput');
const yearFilter = document.getElementById('yearFilter');
const experienceFilter = document.getElementById('experienceFilter');
const loadingSpinner = document.getElementById('loadingSpinner');
const tableContent = document.getElementById('tableContent');
const noData = document.getElementById('noData');

let allRegistrations = [];
let filteredRegistrations = [];

// Auth Check with enhanced debugging
onAuthStateChanged(auth, (user) => {
    console.log("🔐 Auth state changed:", user ? user.email : "Not logged in");
    
    if (!user) {
        console.warn("⚠️ No user logged in, redirecting to login page...");
        window.location.href = "login.html";
    } else {
        console.log('✅ Admin authenticated:', user.email);
        console.log('👤 User UID:', user.uid);
        fetchData();
    }
});

// Fetch Data with enhanced error handling
async function fetchData() {
    try {
        console.log("📡 Starting data fetch...");
        
        loadingSpinner.style.display = 'flex';
        tableContent.style.display = 'none';
        noData.style.display = 'none';

        // Check if db is initialized
        if (!db) {
            throw new Error("Firestore is not initialized!");
        }
        console.log("✅ Firestore instance confirmed");

        // Try to fetch data
        console.log("📥 Querying 'registrations' collection...");
        const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        console.log(`📊 Query completed. Documents found: ${querySnapshot.size}`);
        
        allRegistrations = [];
        querySnapshot.forEach((doc) => {
            console.log(`  📄 Doc ID: ${doc.id}`);
            const data = doc.data();
            allRegistrations.push({
                id: doc.id,
                ...data,
                timestamp: data.createdAt?.toDate() || new Date()
            });
        });

        console.log('✅ Fetched', allRegistrations.length, 'registrations');
        console.log('📋 Sample data:', allRegistrations[0]);
        
        filteredRegistrations = [...allRegistrations];
        updateStatistics();
        renderTable();

        loadingSpinner.style.display = 'none';
        if (allRegistrations.length > 0) {
            tableContent.style.display = 'block';
            console.log("✅ Table displayed");
        } else {
            noData.style.display = 'block';
            console.log("⚠️ No data to display");
        }

    } catch (error) {
        console.error('❌ Error fetching data:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Show user-friendly error
        loadingSpinner.style.display = 'none';
        noData.style.display = 'block';
        document.querySelector('#noData p').textContent = 
            `Error loading data: ${error.message}. Check console for details.`;
    }
}

// Update Statistics
function updateStatistics() {
    console.log("📊 Updating statistics...");
    
    document.getElementById('totalCount').textContent = allRegistrations.length;

    // Today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegs = allRegistrations.filter(reg => reg.timestamp >= today);
    document.getElementById('todayCount').textContent = todayRegs.length;

    // Unique colleges
    const colleges = new Set(allRegistrations.map(reg => reg.college).filter(Boolean));
    document.getElementById('collegeCount').textContent = colleges.size;

    // Advanced users
    const advancedUsers = allRegistrations.filter(reg => 
        reg.experience === 'advanced' || reg.experience === 'professional'
    );
    document.getElementById('advancedCount').textContent = advancedUsers.length;
    
    console.log("✅ Statistics updated:", {
        total: allRegistrations.length,
        today: todayRegs.length,
        colleges: colleges.size,
        advanced: advancedUsers.length
    });
}

// Render Table
function renderTable() {
    console.log("🎨 Rendering table with", filteredRegistrations.length, "entries");
    
    tableBody.innerHTML = '';
    
    if (filteredRegistrations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">No matching registrations found.</td></tr>';
        return;
    }

    filteredRegistrations.forEach((reg, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td style="color: var(--text-primary); font-weight: 600;">${reg.name || 'N/A'}</td>
            <td>${reg.email || 'N/A'}</td>
            <td>${reg.phone || 'N/A'}</td>
            <td>${reg.college || 'N/A'}</td>
            <td>${reg.year ? (reg.year === 'other' ? 'Other' : reg.year + ' Year') : 'N/A'}</td>
            <td style="text-transform: capitalize;">${reg.experience || 'N/A'}</td>
            <td>${formatDate(reg.timestamp)}</td>
        `;
        tableBody.appendChild(row);
    });
    
    console.log("✅ Table rendered successfully");
}

// Format Date
function formatDate(date) {
    if (!date) return 'N/A';
    try {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
    }
}

// Filter Function
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const yearValue = yearFilter.value;
    const expValue = experienceFilter.value;

    console.log("🔍 Applying filters:", { searchTerm, yearValue, expValue });

    filteredRegistrations = allRegistrations.filter(reg => {
        const matchesSearch = !searchTerm || 
            reg.name?.toLowerCase().includes(searchTerm) ||
            reg.email?.toLowerCase().includes(searchTerm) ||
            reg.phone?.toLowerCase().includes(searchTerm) ||
            reg.college?.toLowerCase().includes(searchTerm);

        const matchesYear = !yearValue || reg.year === yearValue;
        const matchesExp = !expValue || reg.experience === expValue;

        return matchesSearch && matchesYear && matchesExp;
    });

    console.log(`✅ Filtered results: ${filteredRegistrations.length} entries`);
    renderTable();
}

// Event Listeners
searchInput.addEventListener('input', applyFilters);
yearFilter.addEventListener('change', applyFilters);
experienceFilter.addEventListener('change', applyFilters);

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        console.log("🚪 Logging out...");
        await signOut(auth);
        console.log("✅ Logged out successfully");
        window.location.href = "login.html";
    } catch (error) {
        console.error('❌ Logout error:', error);
        alert('Error logging out: ' + error.message);
    }
});

// Export CSV
document.getElementById('exportBtn').addEventListener('click', () => {
    console.log("📥 Exporting CSV...");
    
    if (allRegistrations.length === 0) {
        alert('No data to export!');
        return;
    }

    const headers = ['Name', 'Email', 'Phone', 'College', 'Year', 'Experience', 'Registered At'];
    const rows = allRegistrations.map(reg => [
        reg.name || '',
        reg.email || '',
        reg.phone || '',
        reg.college || '',
        reg.year || '',
        reg.experience || '',
        formatDate(reg.timestamp)
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xploitix_registrations_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log("✅ CSV exported successfully");
});