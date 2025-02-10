// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Inicialização do Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Carregar pacientes na tabela
async function carregarPacientes() {
    const tabelaBody = document.querySelector("#tabelaPacientes tbody");
    tabelaBody.innerHTML = ""; // Limpa a tabela antes de carregar os dados

    try {
        const snapshot = await getDocs(collection(db, "ENTRADAS"));

        if (snapshot.empty) {
            tabelaBody.innerHTML = "<tr><td colspan='4'>Nenhum paciente encontrado.</td></tr>";
            return;
        }

        snapshot.forEach((doc) => {
            const paciente = doc.data();
            const id = doc.id; // ID do documento no Firestore
            const nome = paciente.nome || "Sem Nome";
            const entrada = paciente.entrada || "Data não disponível";
            const classificacao = (paciente.classificacao || "").trim().toUpperCase();

            // Definir a classe de cor conforme a classificação
            let corClassificacao = "";
            if (classificacao === "LEVE") corClassificacao = "linha-leve";
            else if (classificacao === "MODERADO") corClassificacao = "linha-moderado";
            else if (classificacao === "GRAVE") corClassificacao = "linha-grave";

            // Criar linha na tabela
            const row = document.createElement("tr");
            if (corClassificacao) row.classList.add(corClassificacao); // Adiciona a classe somente se existir

            row.innerHTML = `
                <td>${nome}</td>
                <td>${entrada}</td>
                <td>${classificacao || "Não classificado"}</td>
                <td>
                    <button class="btn-acao btn-visualizar" onclick="visualizarPaciente('${id}')">🔍</button>
                    <button class="btn-acao btn-excluir" onclick="excluirPaciente('${id}')">🗑️</button>
                    <button class="btn-acao btn-seta">➡️</button>
                </td>
            `;

            tabelaBody.appendChild(row);
        });

    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        tabelaBody.innerHTML = "<tr><td colspan='4'>Erro ao carregar dados.</td></tr>";
    }
}

// Função para visualizar paciente
window.visualizarPaciente = async function (id) {
    try {
        const docRef = doc(db, "ENTRADAS", id);
        const pacienteSnap = await getDoc(docRef);

        if (pacienteSnap.exists()) {
            const paciente = pacienteSnap.data();
            alert(`Nome: ${paciente.nome}\nEntrada: ${paciente.entrada}\nClassificação: ${paciente.classificacao}`);
        } else {
            alert("Paciente não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao visualizar paciente:", error);
    }
};

// Função para excluir paciente
window.excluirPaciente = async function (id) {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;

    try {
        await deleteDoc(doc(db, "ENTRADAS", id));
        alert("Paciente excluído com sucesso!");
        carregarPacientes(); // Atualiza a tabela
    } catch (error) {
        console.error("Erro ao excluir paciente:", error);
        alert("Erro ao excluir paciente.");
    }
};

// Carregar pacientes ao abrir a página
document.addEventListener("DOMContentLoaded", carregarPacientes);