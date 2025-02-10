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

// Espera o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    // Verificar se os elementos existem
    const btnPacientes = document.getElementById("btnPacientes");
    const btnEquipe = document.getElementById("btnEquipe");
    const listaPacientes = document.getElementById("listaPacientes");
    const listaEquipe = document.getElementById("listaEquipe");

    // Checar se os elementos são encontrados
    if (!btnPacientes || !btnEquipe || !listaPacientes || !listaEquipe) {
        console.error("❌ Não foi possível encontrar os elementos no DOM!");
        return;
    }

    console.log("✅ Elementos carregados com sucesso!");

    // Adicionar evento ao clicar no botão de Pacientes
    btnPacientes.addEventListener("click", () => {
        console.log("🟢 Botão 'Pacientes' clicado!");
        carregarPacientes(); // Carregar os pacientes
    });

    // Adicionar evento ao clicar no botão de Equipe
    btnEquipe.addEventListener("click", () => {
        console.log("🔵 Botão 'Equipe Médica' clicado!");
        carregarEquipeMedica(); // Carregar a equipe médica
    });

    // Função para carregar os pacientes da coleção "PACIENTES"
    async function carregarPacientes() {
        console.log("🔄 Carregando pacientes...");
        listaPacientes.innerHTML = ""; // Limpa a lista de pacientes

        try {
            // Buscando dados da coleção "PACIENTES"
            const querySnapshot = await getDocs(collection(db, "PACIENTES"));
            if (querySnapshot.empty) {
                listaPacientes.innerHTML = "<li>Nenhum paciente encontrado.</li>";
                return;
            }

            // Criar itens de lista para cada paciente
            querySnapshot.forEach(doc => {
                const { nome, idade, motivo } = doc.data();
                const pacienteItem = document.createElement("li");
                pacienteItem.textContent = `${nome} | ${idade} anos | ${motivo}`;

                // Logar o conteúdo antes de adicionar ao DOM
                console.log("Criando item de paciente:", pacienteItem);

                listaPacientes.appendChild(pacienteItem);
            });

            console.log("✅ Pacientes carregados com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao carregar pacientes:", error);
        }
    }

    // Função para carregar a equipe médica da coleção "EQUIPE"
    async function carregarEquipeMedica() {
        console.log("🔄 Carregando equipe médica...");
        listaEquipe.innerHTML = ""; // Limpa a lista de equipe

        try {
            // Buscando dados da coleção "EQUIPE"
            const querySnapshot = await getDocs(collection(db, "EQUIPE"));
            if (querySnapshot.empty) {
                listaEquipe.innerHTML = "<li>Nenhum médico encontrado.</li>";
                return;
            }

            // Criar itens de lista para cada membro da equipe
            querySnapshot.forEach(doc => {
                const { nome, crm, especialidade } = doc.data();
                const equipeItem = document.createElement("li");
                equipeItem.textContent = `${nome} | CRM: ${crm} | ${especialidade}`;

                // Logar o conteúdo antes de adicionar ao DOM
                console.log("Criando item de equipe médica:", equipeItem);

                listaEquipe.appendChild(equipeItem);
            });

            console.log("✅ Equipe médica carregada com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao carregar equipe médica:", error);
        }
    }
});