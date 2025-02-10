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

// Inicializando o Firebase
if (!getApps().length) {
    initializeApp(firebaseConfig);
}
const db = getFirestore();

// Função para carregar pacientes da coleção "ATENDIMENTO"
async function carregarPacientesAtendimento() {
    const tabelaPacientes = document.getElementById('tabelaPacientesAtendimento').getElementsByTagName('tbody')[0];

    try {
        const querySnapshot = await getDocs(collection(db, "ATENDIMENTO"));
        // Limpar a tabela antes de adicionar novos dados
        tabelaPacientes.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const paciente = doc.data();
            const linha = tabelaPacientes.insertRow();

            const nomeCell = linha.insertCell(0);
            nomeCell.textContent = paciente.nome || "Nome não informado";

            const entradaCell = linha.insertCell(1);
            entradaCell.textContent = paciente.dataHoraEntrada || "Data não informada";

            const riscoCell = linha.insertCell(2);
            riscoCell.textContent = paciente.classificacaoRisco || "Não informado";
        });
    } catch (error) {
        console.log("Erro ao carregar pacientes: ", error);
    }
}

// Chamar a função para carregar pacientes assim que a página de Atendimento for acessada
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('atendimento').classList.contains('active')) {
        carregarPacientesAtendimento();
    }
});