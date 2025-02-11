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
            btnAtender.onclick = () => exibirPopupAtendimento(paciente);

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

// Função para criar e exibir o pop-up de atendimento
function exibirPopupAtendimento(paciente) {
    // Se o pop-up já existir, remove antes de criar um novo
    const popupExistente = document.getElementById("popupAtendimento");
    if (popupExistente) {
        popupExistente.remove();
    }

    // Criando o elemento do pop-up
    const popup = document.createElement("div");
    popup.id = "popupAtendimento";
    popup.classList.add("popup-container");

    popup.innerHTML = `
        <div class="popup">
            <h2>Ficha de Entrada</h2>
            <p><strong>Nome:</strong> ${paciente.nome || "Não informado"}</p>
            <p><strong>Cartão N°:</strong> ${paciente.cartao_n || "Não informado"}</p>
            <p><strong>Classificação:</strong> ${paciente.classificacao || "Não informado"}</p>
            <p><strong>Entrada:</strong> ${paciente.entrada || "Não informado"}</p>
            <p><strong>Médico:</strong> ${paciente.medico || "Não informado"}</p>
            <p><strong>Pressão:</strong> ${paciente.pressao || "Não informado"}</p>
            <p><strong>Queixa:</strong> ${paciente.queixa || "Não informado"}</p>
            <p><strong>Temperatura:</strong> ${paciente.temperatura || "Não informado"}</p>
            <button class="btn-fechar" onclick="fecharPopup()">Fechar</button>
        </div>
    `;

    // Adicionando o pop-up ao body
    document.body.appendChild(popup);
}

// Função para fechar o pop-up
function fecharPopup() {
    const popup = document.getElementById("popupAtendimento");
    if (popup) {
        popup.remove();
    }
}

// Carregar os pacientes assim que a página for carregada
window.onload = carregarPacientesAtendimento;