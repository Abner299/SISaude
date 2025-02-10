// 🔥 Importação do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// 🔥 Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRpgYQtFHZGTlf9c4b6REiMqKL99GubR8",
    authDomain: "sisaude-58311.firebaseapp.com",
    projectId: "sisaude-58311",
    storageBucket: "sisaude-58311.firebasestorage.app",
    messagingSenderId: "558586585256",
    appId: "1:558586585256:web:9f4cf5576d88ee0826a29d",
    measurementId: "G-PGY4RB77P9"
};

// 🔥 Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Pegando os elementos dos botões e listas
const btnPacientes = document.getElementById("btnPacientes");
const btnEquipe = document.getElementById("btnEquipe");
const listaPacientes = document.getElementById("listaPacientes");
const listaEquipe = document.getElementById("listaEquipe");

// 📌 Teste se os elementos foram encontrados
console.log("🔍 Testando elementos:");
console.log("btnPacientes:", btnPacientes);
console.log("btnEquipe:", btnEquipe);
console.log("listaPacientes:", listaPacientes);
console.log("listaEquipe:", listaEquipe);

// 📌 Se algum elemento for `null`, significa que o ID está errado no HTML
if (!btnPacientes || !btnEquipe || !listaPacientes || !listaEquipe) {
    console.error("❌ Elementos não encontrados no DOM! Verifique os IDs no HTML.");
} else {
    console.log("✅ Elementos carregados com sucesso!");
}

// 📌 Função para carregar os pacientes
async function carregarPacientes() {
    console.log("🔄 Carregando pacientes...");
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
            item.innerHTML = `<span><strong>${paciente.nome}</strong> - ${paciente.data_entrada || "Sem data"} - ${paciente.classificacao_risco || "Sem classificação"}</span>`;
            listaPacientes.appendChild(item);
        });

        console.log("✅ Pacientes carregados com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao carregar pacientes:", error);
        listaPacientes.innerHTML = "<p>Erro ao carregar pacientes.</p>";
    }
}

// 📌 Função para carregar a equipe médica
async function carregarEquipeMedica() {
    console.log("🔄 Carregando equipe médica...");
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
            item.innerHTML = `<span><strong>${medico.nome}</strong> - ${medico.crm} - ${medico.especialidade}</span>`;
            listaEquipe.appendChild(item);
        });

        console.log("✅ Equipe médica carregada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao carregar equipe médica:", error);
        listaEquipe.innerHTML = "<p>Erro ao carregar equipe médica.</p>";
    }
}

// 📌 Eventos para expandir as listas ao clicar nos botões
btnPacientes.addEventListener("click", () => {
    console.log("🟢 Botão Pacientes clicado!");
    listaPacientes.classList.toggle("show");
    if (listaPacientes.classList.contains("show")) {
        carregarPacientes();
    }
});

btnEquipe.addEventListener("click", () => {
    console.log("🔵 Botão Equipe clicado!");
    listaEquipe.classList.toggle("show");
    if (listaEquipe.classList.contains("show")) {
        carregarEquipeMedica();
    }
});