      import { db, auth } from './firebase.js';
        import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
        import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

        const tableBody = document.getElementById('adminTable');
        const searchInput = document.getElementById('searchInput');
        const yearFilter = document.getElementById('yearFilter');
        const experienceFilter = document.getElementById('experienceFilter');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const tableContent = document.getElementById('tableContent');
        const noData = document.getElementById('noData');

        let allRegistrations = [];
        let filteredRegistrations = [];

        // Auth Check
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = "login.html";
            } else {
                console.log('✅ Admin authenticated:', user.email);
                fetchData();
            }
        });

        // Fetch Data
        async function fetchData() {
            try {
                loadingSpinner.style.display = 'flex';
                tableContent.style.display = 'none';
                noData.style.display = 'none';

                const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                
                allRegistrations = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    allRegistrations.push({
                        id: doc.id,
                        ...data,
                        timestamp: data.createdAt?.toDate() || new Date()
                    });
                });

                console.log('✅ Fetched', allRegistrations.length, 'registrations');
                
                filteredRegistrations = [...allRegistrations];
                updateStatistics();
                renderTable();

                loadingSpinner.style.display = 'none';
                if (allRegistrations.length > 0) {
                    tableContent.style.display = 'block';
                } else {
                    noData.style.display = 'block';
                }

            } catch (error) {
                console.error('❌ Error fetching data:', error);
                loadingSpinner.style.display = 'none';
                noData.style.display = 'block';
            }
        }

        // Update Statistics
        function updateStatistics() {
            document.getElementById('totalCount').textContent = allRegistrations.length;

            // Today's registrations
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayRegs = allRegistrations.filter(reg => reg.timestamp >= today);
            document.getElementById('todayCount').textContent = todayRegs.length;

            // Unique colleges
            const colleges = new Set(allRegistrations.map(reg => reg.college));
            document.getElementById('collegeCount').textContent = colleges.size;

            // Advanced users
            const advancedUsers = allRegistrations.filter(reg => 
                reg.experience === 'advanced' || reg.experience === 'professional'
            );
            document.getElementById('advancedCount').textContent = advancedUsers.length;
        }

        // Render Table
        function renderTable() {
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
                    <td>${reg.year ? reg.year + (reg.year !== 'other' ? ' Year' : '') : 'N/A'}</td>
                    <td style="text-transform: capitalize;">${reg.experience || 'N/A'}</td>
                    <td>${formatDate(reg.timestamp)}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Format Date
        function formatDate(date) {
            if (!date) return 'N/A';
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Filter Function
        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const yearValue = yearFilter.value;
            const expValue = experienceFilter.value;

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

            renderTable();
        }

        // Event Listeners
        searchInput.addEventListener('input', applyFilters);
        yearFilter.addEventListener('change', applyFilters);
        experienceFilter.addEventListener('change', applyFilters);

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = "login.html";
            } catch (error) {
                console.error('❌ Logout error:', error);
            }
        });

        // Export CSV
        document.getElementById('exportBtn').addEventListener('click', () => {
            if (allRegistrations.length === 0) {
                alert('No data to export!');
                return;
            }

            const headers = ['Name', 'Email', 'Phone', 'College', 'Year', 'Experience', 'Registered At'];
            const rows = allRegistrations.map(reg => [
                reg.name,
                reg.email,
                reg.phone,
                reg.college,
                reg.year,
                reg.experience,
                formatDate(reg.timestamp)
            ]);

            let csvContent = headers.join(',') + '\n';
            rows.forEach(row => {
                csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
            });

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `xploitix_registrations_${Date.now()}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        });