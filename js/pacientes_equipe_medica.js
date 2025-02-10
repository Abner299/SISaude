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

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    // Seleciona os botões e os containers de lista
    const btnPacientes = document.getElementById("btnPacientes");
    const contentPacientes = btnPacientes.nextElementSibling;
    const listaPacientes = document.getElementById("listaPacientes");

    const btnEquipe = document.getElementById("btnEquipe");
    const contentEquipe = btnEquipe.nextElementSibling;
    const listaEquipe = document.getElementById("listaEquipe");

    // Função para alternar visibilidade
    function toggleContent(button, content) {
        content.classList.toggle("active");
    }

    // Eventos de clique para expandir/recolher listas
    btnPacientes.addEventListener("click", function () {
        toggleContent(btnPacientes, contentPacientes);
        carregarPacientes();
    });

    btnEquipe.addEventListener("click", function () {
        toggleContent(btnEquipe, contentEquipe);
        carregarEquipeMedica();
    });

    // Função para carregar **Pacientes** do Firestore
    async function carregarPacientes() {
        listaPacientes.innerHTML = "<p>Carregando...</p>";
        const querySnapshot = await getDocs(collection(db, "PACIENTES"));

        if (querySnapshot.empty) {
            listaPacientes.innerHTML = "<p>Nenhum paciente cadastrado.</p>";
            return;
        }

        listaPacientes.innerHTML = ""; // Limpa antes de carregar

        querySnapshot.forEach((doc) => {
            const paciente = doc.data();
            const pacienteHTML = `
                <tr>
                    <td>${paciente.nome}</td>
                    <td>${paciente["data_entrada"] || "N/A"}</td>
                    <td>${paciente["classificacao_risco"] || "N/A"}</td>
                </tr>
            `;
            listaPacientes.innerHTML += pacienteHTML;
        });
    }

    // Função para carregar **Equipe Médica** do Firestore
    async function carregarEquipeMedica() {
        listaEquipe.innerHTML = "<p>Carregando...</p>";
        const querySnapshot = await getDocs(collection(db, "EQUIPE"));

        if (querySnapshot.empty) {
            listaEquipe.innerHTML = "<p>Nenhum médico cadastrado.</p>";
            return;
        }

        listaEquipe.innerHTML = ""; // Limpa antes de carregar

        querySnapshot.forEach((doc) => {
            const medico = doc.data();
            const medicoHTML = `
                <tr>
                    <td>${medico.nome}</td>
                    <td>${medico.crm}</td>
                    <td>${medico.especialidade}</td>
                </tr>
            `;
            listaEquipe.innerHTML += medicoHTML;
        });
    }
});