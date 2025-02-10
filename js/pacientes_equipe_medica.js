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

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Aguarda o carregamento do DOM
document.addEventListener("DOMContentLoaded", function () {
    carregarEquipeMedica();
    carregarPacientes();

    // Adiciona evento de clique para os botões expansíveis
    document.getElementById("btnPacientes").addEventListener("click", function () {
        toggleSection("secaoPacientes");
    });

    document.getElementById("btnEquipe").addEventListener("click", function () {
        toggleSection("secaoEquipe");
    });
});

// Função para alternar a visibilidade das seções
function toggleSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.classList.toggle("expandido");
    }
}

// Carregar dados da equipe médica
async function carregarEquipeMedica() {
    const tabelaEquipe = document.getElementById("tabelaEquipe");

    if (!tabelaEquipe) return;

    tabelaEquipe.innerHTML = "<p>Carregando...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "EQUIPE"));
        let html = `<table class="tabela-equipe">
                        <tr>
                            <th>Nome</th>
                            <th>CRM</th>
                            <th>Especialidade</th>
                        </tr>`;

        querySnapshot.forEach(doc => {
            const { nome, crm, especialidade } = doc.data();
            html += `<tr>
                        <td>${nome}</td>
                        <td>${crm}</td>
                        <td>${especialidade}</td>
                     </tr>`;
        });

        html += `</table>`;

        tabelaEquipe.innerHTML = html || "<p>Nenhum médico cadastrado.</p>";
    } catch (error) {
        console.error("Erro ao carregar equipe médica:", error);
        tabelaEquipe.innerHTML = "<p>Erro ao carregar dados.</p>";
    }
}

// Carregar dados dos pacientes
async function carregarPacientes() {
    const tabelaPacientes = document.getElementById("tabelaPacientes");

    if (!tabelaPacientes) return;

    tabelaPacientes.innerHTML = "<p>Carregando...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "PACIENTES"));
        let html = `<table class="tabela-pacientes">
                        <tr>
                            <th>Nome</th>
                            <th>Data e Hora de Entrada</th>
                            <th>Classificação de Risco</th>
                        </tr>`;

        querySnapshot.forEach(doc => {
            const { nome, dataHora, risco } = doc.data();
            html += `<tr>
                        <td>${nome}</td>
                        <td>${dataHora}</td>
                        <td class="${risco.toLowerCase()}">${risco}</td>
                     </tr>`;
        });

        html += `</table>`;

        tabelaPacientes.innerHTML = html || "<p>Nenhum paciente cadastrado.</p>";
    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        tabelaPacientes.innerHTML = "<p>Erro ao carregar dados.</p>";
    }
}