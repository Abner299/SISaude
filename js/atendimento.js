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
            if (paciente.classificacao.toUpperCase() === "LEVE") tr.classList.add("leve");
            else if (paciente.classificacao.toUpperCase() === "MODERADO") tr.classList.add("moderado");
            else if (paciente.classificacao.toUpperCase() === "GRAVE") tr.classList.add("grave");

            // Criando as células
            tr.innerHTML = `
                <td>${paciente.nome || "Nome não disponível"}</td>
                <td>${paciente.entrada || "Data não disponível"}</td>
                <td>${paciente.classificacao || "Classificação não disponível"}</td>
                <td>
                    <button class="btn-azul atender-btn" data-id="${pacienteId}">Atender</button>
                    <button class="btn-vermelho excluir-btn" data-id="${pacienteId}" data-nome="${paciente.nome}">Excluir</button>
                </td>
            `;

            tabelaPacientes.appendChild(tr);
        }
    });

    // Adicionando eventos aos botões
    document.querySelectorAll(".atender-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const pacienteId = btn.getAttribute("data-id");
            const paciente = querySnapshot.docs.find(d => d.id === pacienteId)?.data();
            abrirPopupAtendimento(paciente);
        });
    });

    document.querySelectorAll(".excluir-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const pacienteId = btn.getAttribute("data-id");
            const nome = btn.getAttribute("data-nome");
            if (confirm(`Tem certeza que deseja excluir ${nome}?`)) {
                await deleteDoc(doc(db, "ATENDIMENTO", pacienteId));
                carregarPacientesAtendimento();
            }
        });
    });
}

// Função para abrir o pop-up de atendimento
// Função para abrir o pop-up de atendimento
function abrirPopupAtendimento(paciente) {
    if (!paciente) return;

    const popupAtendimento = document.getElementById("popupAtendimento");
    if (!popupAtendimento) {
        console.error("Erro: O pop-up de atendimento não foi encontrado no DOM.");
        return;
    }

    // Seleciona os elementos e verifica se existem
    const campos = {
        nome: document.getElementById("popupNome"),
        cartao: document.getElementById("popupCartao"),
        classificacao: document.getElementById("popupClassificacao"),
        queixa: document.getElementById("popupQueixa"),
        pressao: document.getElementById("popupPressao"),
        temperatura: document.getElementById("popupTemperatura"),
        medico: document.getElementById("popupMedico"),
        entrada: document.getElementById("popupEntrada"),
        historico: document.getElementById("popupHistorico"),
        medicacao: document.getElementById("popupMedicacao")
    };

    for (const key in campos) {
        if (!campos[key]) {
            console.error(`Erro: Elemento popup${key.charAt(0).toUpperCase() + key.slice(1)} não encontrado.`);
            return;
        }
    }

    // Preenche os dados do paciente no pop-up
    campos.nome.textContent = paciente.nome || "Não informado";
    campos.cartao.textContent = paciente.cartao_n || "Não informado";
    campos.classificacao.textContent = paciente.classificacao || "Não informado";
    campos.queixa.textContent = paciente.queixa || "Não informado";
    campos.pressao.textContent = paciente.pressao || "Não informado";
    campos.temperatura.textContent = paciente.temperatura || "Não informado";
    campos.medico.textContent = paciente.medico || "Não informado";
    campos.entrada.textContent = paciente.entrada || "Não informado";
    campos.historico.value = paciente.historico || "";
    campos.medicacao.value = paciente.medicacao || "";

    // Exibe o pop-up
    popupAtendimento.style.display = "flex";
}

// Garante que o código só execute após o DOM estar carregado
document.addEventListener("DOMContentLoaded", function () {
    // Fechar o pop-up
    const popupFechar = document.getElementById("popupFechar");
    if (popupFechar) {
        popupFechar.addEventListener("click", () => {
            document.getElementById("popupAtendimento").style.display = "none";
        });
    }

    // Alternância entre abas
    const btnFicha = document.getElementById("btnFicha");
    const btnProntuario = document.getElementById("btnProntuario");

    if (btnFicha && btnProntuario) {
        btnFicha.addEventListener("click", () => {
            document.getElementById("tabFicha").style.display = "block";
            document.getElementById("tabProntuario").style.display = "none";
            btnFicha.classList.add("active");
            btnProntuario.classList.remove("active");
        });

        btnProntuario.addEventListener("click", () => {
            document.getElementById("tabFicha").style.display = "none";
            document.getElementById("tabProntuario").style.display = "block";
            btnProntuario.classList.add("active");
            btnFicha.classList.remove("active");
        });
    }

    // Carregar pacientes ao abrir a página
    carregarPacientesAtendimento();
});