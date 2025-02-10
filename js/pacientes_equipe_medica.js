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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const btnPacientes = document.getElementById("btnPacientes");
    const btnEquipe = document.getElementById("btnEquipe");
    const listaPacientes = document.getElementById("listaPacientes");
    const listaEquipe = document.getElementById("listaEquipe");

    if (!btnPacientes || !btnEquipe || !listaPacientes || !listaEquipe) {
        console.error("❌ Elementos não encontrados no DOM!");
        return;
    }

    console.log("✅ Elementos carregados com sucesso!");

    // Evento para carregar pacientes
    btnPacientes.addEventListener("click", async () => {
        console.log("🟢 Botão Pacientes clicado!");
        await carregarPacientes();
    });

    // Evento para carregar equipe médica
    btnEquipe.addEventListener("click", async () => {
        console.log("🔵 Botão Equipe clicado!");
        await carregarEquipeMedica();
    });

    async function carregarPacientes() {
        console.log("🔄 Carregando pacientes...");
        listaPacientes.innerHTML = "";

        try {
            const querySnapshot = await getDocs(collection(db, "PACIENTES"));
            if (querySnapshot.empty) {
                listaPacientes.innerHTML = "<li>Nenhum paciente encontrado.</li>";
                return;
            }

            querySnapshot.forEach(doc => {
                const { nome, idade, motivo } = doc.data();
                const pacienteItem = document.createElement("li");
                pacienteItem.textContent = `${nome} | ${idade} anos | ${motivo}`;
                listaPacientes.appendChild(pacienteItem);
            });

            console.log("✅ Pacientes carregados com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao carregar pacientes:", error);
        }
    }

    async function carregarEquipeMedica() {
        console.log("🔄 Carregando equipe médica...");
        listaEquipe.innerHTML = "";

        try {
            const querySnapshot = await getDocs(collection(db, "EQUIPE"));
            if (querySnapshot.empty) {
                listaEquipe.innerHTML = "<li>Nenhum médico encontrado.</li>";
                return;
            }

            querySnapshot.forEach(doc => {
                const { nome, crm, especialidade } = doc.data();
                const equipeItem = document.createElement("li");
                equipeItem.textContent = `${nome} | CRM: ${crm} | ${especialidade}`;
                listaEquipe.appendChild(equipeItem);
            });

            console.log("✅ Equipe médica carregada com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao carregar equipe médica:", error);
        }
    }
});