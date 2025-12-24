import { db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById('regForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.innerText = "PROCESSING...";

    try {
        await addDoc(collection(db, "registrations"), {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            college: document.getElementById('college').value,
            timestamp: new Date()
        });
        msg.style.color = "#39ff14";
        msg.innerText = "Access Granted. Registration Successful!";
        form.reset();
    } catch (error) {
        msg.style.color = "red";
        msg.innerText = "Error: " + error.message;
    }
    btn.innerText = "SUBMIT REQUEST";
});