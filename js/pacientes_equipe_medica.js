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

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Espera o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    // Verificar se os elementos existem
    const btnPacientes = document.getElementById("btnPacientes");
    const btnEquipe = document.getElementById("btnEquipe");
    const listaPacientes = document.getElementById("listaPacientes");
    const listaEquipe = document.getElementById("listaEquipe");

    // Adicionar evento ao clicar no botão de Pacientes
    btnPacientes.addEventListener("click", () => {
        listaPacientes.classList.toggle("active");
        listaEquipe.classList.remove("active");
        carregarPacientes(); // Carregar os pacientes
    });

    // Adicionar evento ao clicar no botão de Equipe
    btnEquipe.addEventListener("click", () => {
        listaEquipe.classList.toggle("active");
        listaPacientes.classList.remove("active");
        carregarEquipeMedica(); // Carregar a equipe médica
    });

    // Função para carregar os pacientes da coleção "PACIENTES"
    async function carregarPacientes() {
        const lista = listaPacientes.querySelector("ul");
        lista.innerHTML = ""; // Limpa a lista de pacientes

        try {
            const querySnapshot = await db.collection("PACIENTES").get();
            if (querySnapshot.empty) {
                lista.innerHTML = "<li class='nenhum'>Nenhum paciente encontrado.</li>";
                return;
            }

            querySnapshot.forEach(doc => {
                const { nome, idade, motivo } = doc.data();
                const pacienteItem = document.createElement("li");
                pacienteItem.textContent = `${nome} | ${idade} anos | ${motivo}`;
                lista.appendChild(pacienteItem);
            });
        } catch (error) {
            console.error("Erro ao carregar pacientes:", error);
        }
    }

    // Função para carregar a equipe médica da coleção "EQUIPE"
    async function carregarEquipeMedica() {
        const lista = listaEquipe.querySelector("ul");
        lista.innerHTML = ""; // Limpa a lista de equipe

        try {
            const querySnapshot = await db.collection("EQUIPE").get();
            if (querySnapshot.empty) {
                lista.innerHTML = "<li class='nenhum'>Nenhum médico encontrado.</li>";
                return;
            }

            querySnapshot.forEach(doc => {
                const { nome, crm, especialidade } = doc.data();
                const equipeItem = document.createElement("li");
                equipeItem.textContent = `${nome} | CRM: ${crm} | ${especialidade}`;
                lista.appendChild(equipeItem);
            });
        } catch (error) {
            console.error("Erro ao carregar equipe médica:", error);
        }
    }
});