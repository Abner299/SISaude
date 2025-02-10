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
    console.log("📌 Script carregado!");

    // Pegando os botões e as listas
    const btnPacientes = document.getElementById("btnPacientes");
    const listaPacientes = document.getElementById("listaPacientes");

    const btnEquipe = document.getElementById("btnEquipe");
    const listaEquipe = document.getElementById("listaEquipe");

    if (!btnPacientes || !listaPacientes || !btnEquipe || !listaEquipe) {
        console.error("❌ Elementos não encontrados no DOM!");
        return;
    }

    // Clique no botão Pacientes
    btnPacientes.addEventListener("click", function () {
        listaPacientes.classList.toggle("active");
        if (listaPacientes.classList.contains("active")) {
            carregarPacientes();
        } else {
            listaPacientes.innerHTML = "";
        }
    });

    // Clique no botão Equipe Médica
    btnEquipe.addEventListener("click", function () {
        listaEquipe.classList.toggle("active");
        if (listaEquipe.classList.contains("active")) {
            carregarEquipeMedica();
        } else {
            listaEquipe.innerHTML = "";
        }
    });

    // Função para carregar Pacientes
    async function carregarPacientes() {
        listaPacientes.innerHTML = "<p>Carregando...</p>";

        try {
            const querySnapshot = await getDocs(collection(db, "PACIENTES"));
            listaPacientes.innerHTML = "";

            if (querySnapshot.empty) {
                listaPacientes.innerHTML = "<p>Nenhum paciente cadastrado.</p>";
                return;
            }

            querySnapshot.forEach((doc) => {
                const paciente = doc.data();
                const item = document.createElement("li");
                item.innerHTML = `<strong>${paciente.nome}</strong> - ${paciente["data_entrada"] || "Sem data"} - ${paciente["classificacao_risco"] || "Sem classificação"}`;
                listaPacientes.appendChild(item);
            });
        } catch (error) {
            console.error("Erro ao carregar pacientes:", error);
            listaPacientes.innerHTML = "<p>Erro ao carregar pacientes.</p>";
        }
    }

    // Função para carregar Equipe Médica
    async function carregarEquipeMedica() {
        listaEquipe.innerHTML = "<p>Carregando...</p>";

        try {
            const querySnapshot = await getDocs(collection(db, "EQUIPE"));
            listaEquipe.innerHTML = "";

            if (querySnapshot.empty) {
                listaEquipe.innerHTML = "<p>Nenhum médico cadastrado.</p>";
                return;
            }

            querySnapshot.forEach((doc) => {
                const medico = doc.data();
                const item = document.createElement("li");
                item.innerHTML = `<strong>${medico.nome}</strong> - CRM: ${medico.crm} - ${medico.especialidade}`;
                listaEquipe.appendChild(item);
            });
        } catch (error) {
            console.error("Erro ao carregar equipe médica:", error);
            listaEquipe.innerHTML = "<p>Erro ao carregar equipe médica.</p>";
        }
    }
});