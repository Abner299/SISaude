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

    // Verificando se o tbody existe
    if (!tabelaPacientes) {
        console.error("Tabela de pacientes não encontrada.");
        return;
    }

    // Limpa a tabela antes de preencher
    tabelaPacientes.innerHTML = "";

    // Itera sobre os documentos da coleção
    querySnapshot.forEach((doc) => {
        const paciente = doc.data();
        
        // Verificando os dados do paciente
        console.log("Paciente:", paciente);

        // Verifica se os campos obrigatórios existem antes de criar a linha na tabela
        if (paciente.nome && paciente.entrada && paciente.classificacao) {
            const tr = document.createElement("tr");

            // Criando as células com os dados
            const tdNome = document.createElement("td");
            tdNome.textContent = paciente.nome || "Nome não disponível";

            const tdEntrada = document.createElement("td");
            // A entrada deve ser formatada, caso seja uma string no formato de data e hora
            tdEntrada.textContent = paciente.entrada ? formatarData(paciente.entrada) : "Data não disponível";

            const tdClassificacao = document.createElement("td");
            tdClassificacao.textContent = paciente.classificacao || "Classificação não disponível";

            // Adicionando as células à linha
            tr.appendChild(tdNome);
            tr.appendChild(tdEntrada);
            tr.appendChild(tdClassificacao);

            // Adicionando a linha à tabela
            tabelaPacientes.appendChild(tr);
        } else {
            console.error("Paciente com dados incompletos:", paciente);
        }
    });
}

// Função para formatar a data corretamente
function formatarData(data) {
    const date = new Date(data);
    return !isNaN(date) ? date.toLocaleString() : "Data inválida";
}

// Carregar os pacientes assim que a página for carregada
window.onload = carregarPacientesAtendimento;