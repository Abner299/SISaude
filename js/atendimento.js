// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRpgYQtFHZGTlf9c4b6REiMqKL99GubR8",
    authDomain: "sisaude-58311.firebaseapp.com",
    projectId: "sisaude-58311",
    storageBucket: "sisaude-58311.appspot.com",
    messagingSenderId: "558586585256",
    appId: "1:558586585256:web:9f4cf5576d88ee0826a29d",
    measurementId: "G-PGY4RB77P9"
};

// Inicializa o app do Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Função para carregar pacientes do Firestore e exibir na tabela
async function carregarPacientesAtendimento() {
    const atendimentoRef = collection(db, "ATENDIMENTO");
    const querySnapshot = await getDocs(atendimentoRef);
    const tabelaPacientes = document.querySelector("#tabelaPacientes tbody");

    // Limpa a tabela antes de preencher
    tabelaPacientes.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const paciente = doc.data();
        const tr = document.createElement("tr");

        // Criando as células com os dados
        const tdNome = document.createElement("td");
        tdNome.textContent = paciente.nome;
        const tdDataHoraEntrada = document.createElement("td");
        tdDataHoraEntrada.textContent = paciente.dataHoraEntrada;
        const tdClassificacaoRisco = document.createElement("td");
        tdClassificacaoRisco.textContent = paciente.classificacaoRisco;

        // Adicionando as células à linha
        tr.appendChild(tdNome);
        tr.appendChild(tdDataHoraEntrada);
        tr.appendChild(tdClassificacaoRisco);

        // Adicionando a linha à tabela
        tabelaPacientes.appendChild(tr);
    });
}

// Carregar os pacientes assim que a página for carregada
window.onload = carregarPacientesAtendimento;