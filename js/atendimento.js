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

    const tabelaPacientes = document.getElementById("listaAtendimento")?.querySelector("tbody");
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
function abrirPopupAtender(paciente) {
    const popup = document.getElementById("FichaEntradaAtender");
    if (!popup) {
        console.error("Erro: Elemento FichaEntradaAtender não encontrado.");
        return;
    }

    // Preenchendo os dados do paciente no pop-up
    document.getElementById("infoNome").textContent = paciente.nome;
    document.getElementById("infoCartao").textContent = paciente.cartao_n;
    document.getElementById("infoClassificacao").textContent = paciente.classificacao;
    document.getElementById("infoEntrada").textContent = paciente.entrada;
    document.getElementById("infoMedico").textContent = paciente.medico;
    document.getElementById("infoPressao").textContent = paciente.pressao;
    document.getElementById("infoQueixa").textContent = paciente.queixa;
    document.getElementById("infoTemperatura").textContent = paciente.temperatura;

    // Exibindo o pop-up
    popup.style.display = "block";

    // Exibir apenas os botões dentro do pop-up ao abrir
    const menuFichaEntrada = document.getElementById("menuFichaEntrada");
    const menuProntuario = document.getElementById("menuProntuario");

    if (menuFichaEntrada) menuFichaEntrada.style.display = "inline-block";
    if (menuProntuario) menuProntuario.style.display = "inline-block";
}

// Função para fechar o pop-up
function fecharPopupAtender() {
    const popup = document.getElementById("FichaEntradaAtender");
    if (popup) popup.style.display = "none";
}

// Esconder os botões "Ficha de Entrada" e "Prontuário" ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    carregarPacientesAtendimento();

    const menuFichaEntrada = document.getElementById("menuFichaEntrada");
    const menuProntuario = document.getElementById("menuProntuario");

    if (menuFichaEntrada) menuFichaEntrada.style.display = "none";
    if (menuProntuario) menuProntuario.style.display = "none";
});