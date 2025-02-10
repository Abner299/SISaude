// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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
            const pacienteId = doc.id;
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
            if (corClassificacao) row.classList.add(corClassificacao);

            row.innerHTML = `
                <td>${nome}</td>
                <td>${entrada}</td>
                <td>${classificacao || "Não classificado"}</td>
                <td class="acoes">
                    <button class="btn-visualizar" onclick="visualizarPaciente('${pacienteId}')">🔍</button>
                    <button class="btn-excluir" onclick="excluirPaciente('${pacienteId}')">🗑️</button>
                    <button class="btn-seta-verde">➡️</button>
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
window.visualizarPaciente = async function (pacienteId) {
    try {
        const docRef = doc(db, "ENTRADAS", pacienteId);
        const docSnap = await getDocs(collection(db, "ENTRADAS"));

        if (!docSnap.empty) {
            const paciente = docSnap.docs.find(d => d.id === pacienteId)?.data();
            if (!paciente) return;

            // Preencher os dados no pop-up de visualização
            document.getElementById("entradaNome").value = paciente.nome || "";
            document.getElementById("entradaDataHora").value = paciente.entrada || "";
            document.querySelector(`input[name="entradaClassificacao"][value="${paciente.classificacao}"]`)?.click();

            // Travar os campos para evitar edição
            document.getElementById("entradaNome").classList.add("input-bloqueado");
            document.getElementById("entradaDataHora").classList.add("input-bloqueado");

            document.getElementById("darEntradaPopup").style.display = "flex";
        }
    } catch (error) {
        console.error("Erro ao visualizar paciente:", error);
    }
};

// Função para excluir paciente
window.excluirPaciente = async function (pacienteId) {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;

    try {
        await deleteDoc(doc(db, "ENTRADAS", pacienteId));
        alert("Paciente excluído com sucesso!");
        carregarPacientes();
    } catch (error) {
        console.error("Erro ao excluir paciente:", error);
        alert("Erro ao excluir paciente.");
    }
};

// Abrir pop-up de Dar Entrada
window.abrirDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "flex";
    document.getElementById("entradaDataHora").value = new Date().toLocaleString("pt-BR");
};

// Fechar pop-ups
window.fecharDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "none";
};
window.fecharBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "none";
};

// Abrir pop-up de busca
window.abrirBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "flex";
    document.getElementById("buscaRecInput").value = "";
    document.getElementById("buscaRecResultados").innerHTML = "";
};

// Buscar pacientes no Firestore
window.buscarPacientes = async function () {
    const termo = document.getElementById("buscaRecInput").value.trim().toUpperCase();
    const resultadosContainer = document.getElementById("buscaRecResultados");
    resultadosContainer.innerHTML = "";

    if (!termo) return;

    try {
        const snapshot = await getDocs(collection(db, "PACIENTES"));
        const encontrados = [];

        snapshot.forEach((doc) => {
            const paciente = doc.data();
            const nome = paciente.nome ? paciente.nome.toUpperCase() : "";
            const cartao = paciente.cartao_n ? String(paciente.cartao_n) : "";

            if (nome.includes(termo) || cartao.startsWith(termo)) {
                encontrados.push({ id: doc.id, ...paciente });
            }
        });

        if (encontrados.length === 0) {
            resultadosContainer.innerHTML = "<p>Nenhum paciente encontrado.</p>";
            return;
        }

        encontrados.forEach((paciente) => {
            const div = document.createElement("div");
            div.classList.add("buscaRec-item");
            div.innerHTML = `
                <p><strong>${paciente.nome || "Sem Nome"}</strong> - Cartão: ${paciente.cartao_n || "N/A"} - Idade: ${paciente.idade || "N/A"}</p>
                <button onclick="selecionarPaciente('${paciente.nome || ""}', '${paciente.cartao_n || ""}')">✔</button>
            `;
            resultadosContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        resultadosContainer.innerHTML = "<p>Erro na busca.</p>";
    }
};

// Fechar pop-ups ao clicar fora
window.onclick = function (event) {
    if (event.target === document.getElementById("darEntradaPopup")) fecharDarEntrada();
    if (event.target === document.getElementById("buscaRec")) fecharBuscaRec();
};

// Carregar pacientes ao abrir a página
document.addEventListener("DOMContentLoaded", carregarPacientes);