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
}

// Função para abrir o pop-up de atendimento
function abrirPopupAtendimento() {
    let popup = document.getElementById('popupAtendimento');
    if (popup) {
        popup.classList.add('mostrar');
    }
}

function fecharPopupAtendimento() {
    let popup = document.getElementById('popupAtendimento');
    if (popup) {
        popup.classList.remove('mostrar');
    }
}

// Adicione isso para fechar ao clicar no botão Fechar
document.getElementById('popupFechar').addEventListener('click', fecharPopupAtendimento);

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