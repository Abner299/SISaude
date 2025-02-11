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

// Inicializa o Firebase
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

                // Adiciona classe conforme a classificação
                switch (paciente.classificacao.toUpperCase()) {
                    case "LEVE":
                        tr.classList.add("leve");
                        break;
                    case "MODERADO":
                        tr.classList.add("moderado");
                        break;
                    case "GRAVE":
                        tr.classList.add("grave");
                        break;
                }

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
    const popup = document.getElementById("popupAtendimento");
    if (!popup) {
        console.error("Erro: Elemento popupAtendimento não encontrado.");
        return;
    }

    // Verifica se os elementos existem antes de preenchê-los
    const preencherCampo = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor || "Não informado";
    };

    preencherCampo("popupNome", paciente.nome);
    preencherCampo("popupCartao", paciente.cartao_n);
    preencherCampo("popupClassificacao", paciente.classificacao);
    preencherCampo("popupPressao", paciente.pressao);
    preencherCampo("popupTemperatura", paciente.temperatura);
    preencherCampo("popupMedico", paciente.medico);
    preencherCampo("popupEntrada", paciente.entrada);

    // Elementos que são inputs (textarea)
    const preencherInput = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.value = valor || "";
    };

    preencherInput("popupHistorico", paciente.historico);
    preencherInput("popupMedicacao", paciente.medicacao);

    // Exibe o pop-up
    popup.style.display = "flex";
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
    const alternarAba = (ativa, inativa, ativaId, inativaId) => {
        document.getElementById(ativaId).style.display = "block";
        document.getElementById(inativaId).style.display = "none";
        ativa.classList.add("active");
        inativa.classList.remove("active");
    };

    const btnFicha = document.getElementById("tabAtendimento");
    const btnProntuario = document.getElementById("tabProntuario");

    if (btnFicha && btnProntuario) {
        btnFicha.addEventListener("click", () => alternarAba(btnFicha, btnProntuario, "popupAtendimentoContent", "popupProntuarioContent"));
        btnProntuario.addEventListener("click", () => alternarAba(btnProntuario, btnFicha, "popupProntuarioContent", "popupAtendimentoContent"));
    }
});

// Carregar pacientes ao abrir a página
window.onload = carregarPacientesAtendimento;

console.log("Testando pop-up...");
const popup = document.getElementById("popupAtendimento");
console.log("Pop-up encontrado?", popup !== null);
console.log("Display atual:", popup ? popup.style.display : "Elemento não encontrado");