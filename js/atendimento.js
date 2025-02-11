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
function abrirPopupAtender(paciente) {
    const popup = document.getElementById("fichaAtendimento");
    if (!popup) {
        console.error("Erro: Elemento fichaAtendimento não encontrado.");
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

    // Mostra a aba da ficha de entrada por padrão
    mostrarAba('fichaEntrada');

    popup.style.display = "block";
}

// Função para fechar o pop-up
function fecharFichaAtendimento() {
    const popup = document.getElementById("fichaAtendimento");
    if (popup) {
        popup.style.display = "none";
    }
}

// Função para alternar entre as abas do atendimento
function mostrarAba(aba) {
    const fichas = document.querySelectorAll(".abaConteudo");
    fichas.forEach((f) => f.style.display = "none");

    const botoes = document.querySelectorAll(".menuAtendimento button");
    botoes.forEach((b) => b.classList.remove("abaAtiva"));
    
    document.getElementById(aba).style.display = "block";
    document.getElementById(`btn${aba.charAt(0).toUpperCase() + aba.slice(1)}`).classList.add("abaAtiva");
}

// Função para salvar o prontuário (apenas exibe no console por enquanto)
function salvarProntuario() {
    const texto = document.getElementById("prontuarioTexto").value;
    if (texto.trim() !== "") {
        console.log("Prontuário salvo:", texto);
        alert("Prontuário salvo com sucesso!");
    } else {
        alert("Por favor, insira informações no prontuário.");
    }
}

// Carregar os pacientes assim que a página for carregada
document.addEventListener("DOMContentLoaded", () => {
    carregarPacientesAtendimento();
});