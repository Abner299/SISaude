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

// Inicializa o app do Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Função para carregar pacientes do Firestore e exibir na tabela
async function carregarPacientesAtendimento() {
    const atendimentoRef = collection(db, "ATENDIMENTO");
    const querySnapshot = await getDocs(atendimentoRef);

    const tabelaPacientes = document.querySelector("#listaAtendimento tbody");

    // Limpa a tabela antes de preencher
    tabelaPacientes.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
        const paciente = docSnap.data();
        const pacienteId = docSnap.id; // ID do documento no Firestore

        if (paciente.nome && paciente.entrada && paciente.classificacao) {
            const tr = document.createElement("tr");

            // Adiciona classe de cor com base na classificação
            if (paciente.classificacao.toUpperCase() === "LEVE") {
                tr.classList.add("leve");
            } else if (paciente.classificacao.toUpperCase() === "MODERADO") {
                tr.classList.add("moderado");
            } else if (paciente.classificacao.toUpperCase() === "GRAVE") {
                tr.classList.add("grave");
            }

            // Criando as células com os dados
            const tdNome = document.createElement("td");
            tdNome.textContent = paciente.nome || "Nome não disponível";

            const tdEntrada = document.createElement("td");
            tdEntrada.textContent = paciente.entrada || "Data não disponível";

            const tdClassificacao = document.createElement("td");
            tdClassificacao.textContent = paciente.classificacao || "Classificação não disponível";

            // Botão "Atender" (abre pop-up)
            const btnAtender = document.createElement("button");
            btnAtender.textContent = "Atender";
            btnAtender.classList.add("btn-azul"); // Classe CSS
            btnAtender.onclick = () => preencherPopupAtendimento(paciente);

            // Botão "Excluir" (remove o paciente do Firestore)
            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.classList.add("btn-vermelho"); // Classe CSS
            btnExcluir.onclick = async () => {
                if (confirm(`Tem certeza que deseja excluir ${paciente.nome}?`)) {
                    await deleteDoc(doc(db, "ATENDIMENTO", pacienteId));
                    carregarPacientesAtendimento(); // Atualiza a lista após excluir
                }
            };

            // Criando célula de ações e adicionando botões
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

// Função para preencher e exibir o pop-up sem alterar a estrutura HTML
function preencherPopupAtendimento(paciente) {
    document.getElementById("popupNome").textContent = paciente.nome || "Não informado";
    document.getElementById("popupCartao").textContent = paciente.cartao_n || "Não informado";
    document.getElementById("popupClassificacao").textContent = paciente.classificacao || "Não informado";
    document.getElementById("popupEntrada").textContent = paciente.entrada || "Não informado";
    document.getElementById("popupMedico").textContent = paciente.medico || "Não informado";
    document.getElementById("popupPressao").textContent = paciente.pressao || "Não informado";
    document.getElementById("popupQueixa").textContent = paciente.queixa || "Não informado";
    document.getElementById("popupTemperatura").textContent = paciente.temperatura || "Não informado";

    document.getElementById("popupAtendimento").style.display = "block";
}

// Função para fechar o pop-up
function fecharPopupAtendimento() {
    document.getElementById("popupAtendimento").style.display = "none";
}

// Carregar os pacientes assim que a página for carregada
window.onload = carregarPacientesAtendimento;