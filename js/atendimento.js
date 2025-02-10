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

    // Verificando o retorno dos dados
    console.log("QuerySnapshot:", querySnapshot);
    console.log("Documentos retornados:", querySnapshot.docs.length);

    const tabelaPacientes = document.querySelector("#tabelaAtendimento tbody");

    // Limpa a tabela antes de preencher
    tabelaPacientes.innerHTML = "";

    // Itera sobre os documentos da coleção
    querySnapshot.forEach((doc) => {
        const paciente = doc.data();
        
        // Verifica se o nome e outros campos existem
        console.log("Paciente:", paciente);  // Verificando o objeto paciente

        if (paciente.nome && paciente.entrada && paciente.classificacaoRisco) {
            const tr = document.createElement("tr");

            // Criando as células com os dados
            const tdNome = document.createElement("td");
            tdNome.textContent = paciente.nome;

            const tdEntrada = document.createElement("td");
            // A entrada deve ser formatada, caso seja uma string no formato de data e hora
            tdEntrada.textContent = paciente.entrada ? new Date(paciente.entrada).toLocaleString() : "Data não disponível";

            const tdClassificacaoRisco = document.createElement("td");
            tdClassificacaoRisco.textContent = paciente.classificacaoRisco;

            // Adicionando as células à linha
            tr.appendChild(tdNome);
            tr.appendChild(tdEntrada);
            tr.appendChild(tdClassificacaoRisco);

            // Adicionando a linha à tabela
            tabelaPacientes.appendChild(tr);
        }
    });
}

// Carregar os pacientes assim que a página for carregada
window.onload = carregarPacientesAtendimento;