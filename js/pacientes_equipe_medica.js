// Importando o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRpgYQtFHZGTlf9c4b6REiMqKL99GubR8",
    authDomain: "sisaude-58311.firebaseapp.com",
    projectId: "sisaude-58311",
    storageBucket: "sisaude-58311.firebasestorage.app",
    messagingSenderId: "558586585256",
    appId: "1:558586585256:web:9f4cf5576d88ee0826a29d",
    measurementId: "G-PGY4RB77P9"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function () {
    await carregarEquipeMedica();
    await carregarPacientes();
});

async function carregarEquipeMedica() {
    const listaEquipeMedica = document.getElementById("listaEquipeMedica");

    if (!listaEquipeMedica) {
        console.error("Elemento 'listaEquipeMedica' não encontrado.");
        return;
    }

    listaEquipeMedica.innerHTML = "<p>Carregando...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "EQUIPE"));
        let html = "";

        querySnapshot.forEach(doc => {
            const { nome, crm, especialidade } = doc.data();
            html += `<p><strong>${nome}</strong> - CRM: ${crm} - ${especialidade}</p>`;
        });

        listaEquipeMedica.innerHTML = html || "<p>Nenhum médico cadastrado.</p>";
    } catch (error) {
        console.error("Erro ao carregar equipe médica:", error);
        listaEquipeMedica.innerHTML = "<p>Erro ao carregar dados.</p>";
    }
}

async function carregarPacientes() {
    const listaPacientes = document.getElementById("listaPacientes");

    if (!listaPacientes) {
        console.error("Elemento 'listaPacientes' não encontrado.");
        return;
    }

    listaPacientes.innerHTML = "<p>Carregando...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "PACIENTES"));
        let html = "<ul>";

        querySnapshot.forEach(doc => {
            const { nome, idade, status } = doc.data();
            html += `<li>${nome} - ${idade} anos - ${status}</li>`;
        });

        html += "</ul>";
        listaPacientes.innerHTML = html || "<p>Nenhum paciente cadastrado.</p>";
    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        listaPacientes.innerHTML = "<p>Erro ao carregar dados.</p>";
    }
}
window.showPage = function (pageId) {
    const allPages = document.querySelectorAll(".page");
    allPages.forEach(page => page.classList.remove("active"));

    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add("active");
    } else {
        console.error(`Página ${pageId} não encontrada.`);
    }
};