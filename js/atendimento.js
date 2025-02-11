// Importações do Firebase
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

// Inicializa o app do Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Função para carregar os pacientes na tabela
async function carregarPacientesAtendimento() {
    try {
        const atendimentoRef = collection(db, "ATENDIMENTO");
        const querySnapshot = await getDocs(atendimentoRef);

        const tabelaPacientes = document.querySelector("#listaAtendimento tbody");
        if (!tabelaPacientes) return;

        tabelaPacientes.innerHTML = ""; // Limpa a tabela antes de preencher

        querySnapshot.forEach((docSnap) => {
            const paciente = docSnap.data();
            const pacienteId = docSnap.id;

            if (paciente.nome && paciente.entrada && paciente.classificacao) {
                const tr = document.createElement("tr");

                // Adiciona classe de cor conforme a classificação
                const classificacao = paciente.classificacao.toUpperCase();
                if (classificacao === "LEVE") tr.classList.add("leve");
                else if (classificacao === "MODERADO") tr.classList.add("moderado");
                else if (classificacao === "GRAVE") tr.classList.add("grave");

                // Criando as células
                const tdNome = document.createElement("td");
                tdNome.textContent = paciente.nome || "Nome não disponível";

                const tdEntrada = document.createElement("td");
                tdEntrada.textContent = paciente.entrada || "Data não disponível";

                const tdClassificacao = document.createElement("td");
                tdClassificacao.textContent = paciente.classificacao || "Classificação não disponível";

                // Botão "Atender" (abre o pop-up)
                const btnAtender = document.createElement("button");
                btnAtender.textContent = "Atender";
                btnAtender.classList.add("btn-azul");
                btnAtender.onclick = () => abrirPopupAtendimento(paciente);

                // Botão "Excluir" (remove do Firestore)
                const btnExcluir = document.createElement("button");
                btnExcluir.textContent = "Excluir";
                btnExcluir.classList.add("btn-vermelho");
                btnExcluir.onclick = async () => {
                    if (confirm(`Tem certeza que deseja excluir ${paciente.nome}?`)) {
                        await deleteDoc(doc(db, "ATENDIMENTO", pacienteId));
                        carregarPacientesAtendimento();
                    }
                };

                // Criando célula de ações
                const tdAcoes = document.createElement("td");
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
    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
    }
}

// Função para abrir o pop-up de atendimento
function abrirPopupAtendimento(paciente) {
    const elementos = {
        popupNome: document.getElementById("popupNome"),
        popupCartao: document.getElementById("popupCartao"),
        popupClassificacao: document.getElementById("popupClassificacao"),
        popupQueixa: document.getElementById("popupQueixa"),
        popupPressao: document.getElementById("popupPressao"),
        popupTemperatura: document.getElementById("popupTemperatura"),
        popupMedico: document.getElementById("popupMedico"),
        popupEntrada: document.getElementById("popupEntrada"),
        popupHistorico: document.getElementById("popupHistorico"),
        popupMedicacao: document.getElementById("popupMedicacao"),
        popupAtendimento: document.getElementById("popupAtendimento")
    };

    if (!elementos.popupAtendimento) {
        console.error("Erro: Elemento popupAtendimento não encontrado.");
        return;
    }

    // Preenchendo os campos do pop-up
    elementos.popupNome && (elementos.popupNome.textContent = paciente.nome || "Não informado");
    elementos.popupCartao && (elementos.popupCartao.textContent = paciente.cartao_n || "Não informado");
    elementos.popupClassificacao && (elementos.popupClassificacao.textContent = paciente.classificacao || "Não informado");
    elementos.popupQueixa && (elementos.popupQueixa.textContent = paciente.queixa || "Não informado");
    elementos.popupPressao && (elementos.popupPressao.textContent = paciente.pressao || "Não informado");
    elementos.popupTemperatura && (elementos.popupTemperatura.textContent = paciente.temperatura || "Não informado");
    elementos.popupMedico && (elementos.popupMedico.textContent = paciente.medico || "Não informado");
    elementos.popupEntrada && (elementos.popupEntrada.textContent = paciente.entrada || "Não informado");

    elementos.popupHistorico && (elementos.popupHistorico.value = paciente.historico || "");
    elementos.popupMedicacao && (elementos.popupMedicacao.value = paciente.medicacao || "");

    // Exibe o pop-up
    elementos.popupAtendimento.style.display = "flex";
}

// Fechar o pop-up
document.addEventListener("DOMContentLoaded", () => {
    const btnFechar = document.getElementById("popupFechar");
    if (btnFechar) {
        btnFechar.addEventListener("click", () => {
            const popup = document.getElementById("popupAtendimento");
            if (popup) popup.style.display = "none";
        });
    }

    // Alternância entre abas
    const btnFicha = document.getElementById("tabAtendimento");
    const btnProntuario = document.getElementById("tabProntuario");

    if (btnFicha && btnProntuario) {
        btnFicha.addEventListener("click", () => {
            document.getElementById("popupAtendimentoContent").style.display = "block";
            document.getElementById("popupProntuarioContent").style.display = "none";
            btnFicha.classList.add("active");
            btnProntuario.classList.remove("active");
        });

        btnProntuario.addEventListener("click", () => {
            document.getElementById("popupAtendimentoContent").style.display = "none";
            document.getElementById("popupProntuarioContent").style.display = "block";
            btnProntuario.classList.add("active");
            btnFicha.classList.remove("active");
        });
    }
});

// Carregar pacientes ao abrir a página
window.onload = carregarPacientesAtendimento;