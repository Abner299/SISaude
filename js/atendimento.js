// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Inicializa o Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Função para carregar pacientes do Firestore e exibir na tabela
async function carregarPacientesAtendimento() {
    const atendimentoRef = collection(db, "ATENDIMENTO");
    const querySnapshot = await getDocs(atendimentoRef);

    const tabelaPacientes = document.getElementById("tabelaAtendimento")?.querySelector("tbody");
    if (!tabelaPacientes) {
        console.error("Erro: Tabela de atendimento não encontrada.");
        return;
    }

    // Limpa a tabela antes de preencher
    tabelaPacientes.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
        const paciente = docSnap.data();
        if (paciente.nome && paciente.entrada && paciente.classificacao) {
            const tr = document.createElement("tr");

            // Criando as células com os dados
            const tdNome = document.createElement("td");
            tdNome.textContent = paciente.nome;

            const tdEntrada = document.createElement("td");
            tdEntrada.textContent = paciente.entrada;

            const tdClassificacao = document.createElement("td");
            tdClassificacao.textContent = paciente.classificacao;
            tdClassificacao.style.color = "white"; // Letras brancas
            tdClassificacao.style.backgroundColor = corClassificacao(paciente.classificacao);

            // Botões de ação
            const tdAcoes = document.createElement("td");

            // Botão Atender
            const btnAtender = document.createElement("button");
            btnAtender.textContent = "Atender";
            btnAtender.classList.add("btn-atender");
            btnAtender.onclick = () => abrirPopupAtender(paciente);

            // Botão Excluir
            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.classList.add("btn-excluir");
            btnExcluir.onclick = () => excluirPaciente(docSnap.id);

            tdAcoes.appendChild(btnAtender);
            tdAcoes.appendChild(btnExcluir);

            // Adicionando células à linha
            tr.appendChild(tdNome);
            tr.appendChild(tdEntrada);
            tr.appendChild(tdClassificacao);
            tr.appendChild(tdAcoes);

            // Adicionando a linha à tabela
            tabelaPacientes.appendChild(tr);
        }
    });
}

// Define a cor de fundo conforme a classificação
function corClassificacao(classificacao) {
    switch (classificacao.toUpperCase()) {
        case "LEVE": return "green";
        case "MODERADO": return "yellow";
        case "GRAVE": return "red";
        default: return "gray";
    }
}

// Função para excluir paciente
async function excluirPaciente(id) {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
        await deleteDoc(doc(db, "ATENDIMENTO", id));
        alert("Paciente excluído!");
        carregarPacientesAtendimento();
    }
}

// Função para abrir o pop-up de atendimento
// Função para abrir o pop-up de atendimento
function abrirPopupAtender(paciente) {
    const popup = document.getElementById("FichaEntradaAtender");
    if (!popup) {
        console.error("Erro: Elemento FichaEntradaAtender não encontrado.");
        return;
    }

    // Preenchendo os dados do paciente no pop-up
    document.getElementById("infoNome").textContent = paciente.nome || "Não informado";
    document.getElementById("infoCartao").textContent = paciente.cartao_n || "Não informado";
    document.getElementById("infoClassificacao").textContent = paciente.classificacao || "Não informado";
    document.getElementById("infoEntrada").textContent = paciente.entrada || "Não informado";
    document.getElementById("infoMedico").textContent = paciente.medico || "Não informado";
    document.getElementById("infoPressao").textContent = paciente.pressao || "Não informado";
    document.getElementById("infoQueixa").textContent = paciente.queixa || "Não informado";
    document.getElementById("infoTemperatura").textContent = paciente.temperatura || "Não informado";

    // Obtendo os botões do menu
    const btnFichaEntrada = document.getElementById("menuFichaEntrada");
    const btnProntuario = document.getElementById("menuProntuario");

    // Garante que os botões existem antes de manipulá-los
    if (btnFichaEntrada && btnProntuario) {
        // Verifica se há dados suficientes para exibir os botões
        const temFichaEntrada = !!(paciente.cartao_n && paciente.entrada && paciente.classificacao);
        const temProntuario = !!(paciente.medico || paciente.pressao || paciente.queixa || paciente.temperatura);

        // Exibir ou ocultar os botões conforme necessário
        btnFichaEntrada.style.display = temFichaEntrada ? "block" : "none";
        btnProntuario.style.display = temProntuario ? "block" : "none";
    }

    popup.classList.add("active");
    popup.style.display = "block";
}

// Função para fechar o pop-up
function fecharPopupAtender() {
    const popup = document.getElementById("FichaEntradaAtender");
    if (popup) {
        popup.style.display = "none";
        popup.classList.remove("active");

        // Oculta os botões do menu quando fechar o pop-up
        document.getElementById("menuFichaEntrada").style.display = "none";
        document.getElementById("menuProntuario").style.display = "none";
    }
}

// Carregar os pacientes assim que a página for carregada
document.addEventListener("DOMContentLoaded", () => {
    carregarPacientesAtendimento();
});