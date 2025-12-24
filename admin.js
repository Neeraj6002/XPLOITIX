import { db, auth } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const tableBody = document.getElementById('adminTable');

// Protection Check
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        fetchData();
    }
});

async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "registrations"));
    tableBody.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        tableBody.innerHTML += `
            <tr>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.phone}</td>
                <td>${data.college}</td>
            </tr>
        `;
    });
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "login.html");
});