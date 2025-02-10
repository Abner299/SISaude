// Importando Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Configuração Firebase
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

// Esperando o DOM carregar completamente
document.addEventListener("DOMContentLoaded", () => {
    // Botões e áreas de conteúdo
    const btnPacientes = document.getElementById("btnPacientes");
    const btnEquipe = document.getElementById("btnEquipe");
    const listaPacientes = document.getElementById("listaPacientes");
    const listaEquipe = document.getElementById("listaEquipe");

    // Evento para carregar lista de pacientes
    btnPacientes.addEventListener("click", () => {
        listaPacientes.innerHTML = '';  // Limpar conteúdo antes de carregar novos dados
        carregarPacientes();  // Função que carrega os pacientes
    });

    // Evento para carregar lista de equipe médica
    btnEquipe.addEventListener("click", () => {
        listaEquipe.innerHTML = '';  // Limpar conteúdo antes de carregar novos dados
        carregarEquipeMedica();  // Função que carrega a equipe médica
    });

    // Função para carregar pacientes do Firestore
    async function carregarPacientes() {
        try {
            // Pegando dados da coleção "pacientes"
            const pacientesRef = collection(db, "PACIENTES");
            const pacientesSnapshot = await getDocs(pacientesRef);
            const pacientesList = pacientesSnapshot.docs.map(doc => doc.data());

            // Exibindo os pacientes na lista
            pacientesList.forEach(paciente => {
                const pacienteItem = document.createElement("li");
                pacienteItem.textContent = `${paciente.nome} | ${paciente.idade} anos | Motivo: ${paciente.motivo}`;
                listaPacientes.appendChild(pacienteItem);
            });
        } catch (error) {
            console.error("Erro ao carregar pacientes:", error);
        }
    }

    // Função para carregar equipe médica do Firestore
    async function carregarEquipeMedica() {
        try {
            // Pegando dados da coleção "equipe"
            const equipeRef = collection(db, "EQUIPE");
            const equipeSnapshot = await getDocs(equipeRef);
            const equipeList = equipeSnapshot.docs.map(doc => doc.data());

            // Exibindo os médicos na lista
            equipeList.forEach(membro => {
                const equipeItem = document.createElement("li");
                equipeItem.textContent = `${membro.nome} | CRM: ${membro.crm} | Especialidade: ${membro.especialidade}`;
                listaEquipe.appendChild(equipeItem);
            });
        } catch (error) {
            console.error("Erro ao carregar equipe médica:", error);
        }
    }
});
// Função para alternar visibilidade
function toggleList(buttonId, listId) {
    const button = document.getElementById(buttonId);
    const list = document.getElementById(listId);

    // Verifica se a lista e o botão existem
    if (!button || !list) {
        console.error("Botão ou lista não encontrado!");
        return;
    }

    // Adiciona o evento de clique no botão
    button.addEventListener("click", () => {
        // Alterna a visibilidade da lista
        if (list.style.display === "none" || list.style.display === "") {
            list.style.display = "block";  // Mostra a lista
        } else {
            list.style.display = "none";   // Esconde a lista
        }
    });
}

// Chama a função para os dois botões
document.addEventListener("DOMContentLoaded", () => {
    toggleList("btnPacientes", "listaPacientes");
    toggleList("btnEquipe", "listaEquipe");
});