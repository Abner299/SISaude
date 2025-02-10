// Importação do Firebase
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const btnPacientes = document.getElementById("btnPacientes");
    const contentPacientes = btnPacientes.nextElementSibling;
    const listaPacientes = document.getElementById("listaPacientes");

    const btnEquipe = document.getElementById("btnEquipe");
    const contentEquipe = btnEquipe.nextElementSibling;
    const listaEquipe = document.getElementById("listaEquipe");

    function toggleContent(button, content) {
        content.classList.toggle("active");
    }

    btnPacientes.addEventListener("click", function () {
        toggleContent(btnPacientes, contentPacientes);
        carregarPacientes();
    });

    btnEquipe.addEventListener("click", function () {
        toggleContent(btnEquipe, contentEquipe);
        carregarEquipeMedica();
    });

    // Carregar Pacientes como lista
    async function carregarPacientes() {
        listaPacientes.innerHTML = "<p>Carregando...</p>";
        const querySnapshot = await getDocs(collection(db, "PACIENTES"));

        if (querySnapshot.empty) {
            listaPacientes.innerHTML = "<p>Nenhum paciente cadastrado.</p>";
            return;
        }

        listaPacientes.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const paciente = doc.data();
            const pacienteHTML = `
                <li><strong>${paciente.nome}</strong> - ${paciente["data_entrada"] || "Sem data"} - ${paciente["classificacao_risco"] || "Sem classificação"}</li>
            `;
            listaPacientes.innerHTML += pacienteHTML;
        });
    }

    // Carregar Equipe Médica como lista
    async function carregarEquipeMedica() {
        listaEquipe.innerHTML = "<p>Carregando...</p>";
        const querySnapshot = await getDocs(collection(db, "EQUIPE"));

        if (querySnapshot.empty) {
            listaEquipe.innerHTML = "<p>Nenhum médico cadastrado.</p>";
            return;
        }

        listaEquipe.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const medico = doc.data();
            const medicoHTML = `
                <li><strong>${medico.nome}</strong> - CRM: ${medico.crm} - ${medico.especialidade}</li>
            `;
            listaEquipe.innerHTML += medicoHTML;
        });
    }
});