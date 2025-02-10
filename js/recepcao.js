// =============================
// IMPORTAÇÃO DO FIREBASE
// =============================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// =============================
// CONFIGURAÇÃO DO FIREBASE
// =============================
const firebaseConfig = {
    apiKey: "AIzaSyCRpgYQtFHZGTlf9c4b6REiMqKL99GubR8",
    authDomain: "sisaude-58311.firebaseapp.com",
    projectId: "sisaude-58311",
    storageBucket: "sisaude-58311.appspot.com",
    messagingSenderId: "558586585256",
    appId: "1:558586585256:web:9f4cf5576d88ee0826a29d",
    measurementId: "G-PGY4RB77P9"
};

// =============================
// INICIALIZAÇÃO DO FIREBASE
// =============================
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// =============================
// FUNÇÃO PARA CARREGAR PACIENTES NA TABELA
// =============================
async function carregarPacientes() {
    const tabelaBody = document.querySelector("#tabelaPacientes tbody");
    tabelaBody.innerHTML = ""; // Limpa a tabela antes de carregar os dados

    try {
        const snapshot = await getDocs(collection(db, "PACIENTES"));

        if (snapshot.empty) {
            tabelaBody.innerHTML = "<tr><td colspan='3'>Nenhum paciente encontrado.</td></tr>";
            return;
        }

        snapshot.forEach((doc) => {
            const paciente = doc.data();
            const nome = paciente.nome || "Sem Nome";
            const entrada = paciente.entrada || "Data não disponível";
            const classificacao = paciente.classificacao || "Não classificado";

            // Criar linha na tabela
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${nome}</td>
                <td>${entrada}</td>
                <td>${classificacao}</td>
            `;

            tabelaBody.appendChild(row);
        });

    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        tabelaBody.innerHTML = "<tr><td colspan='3'>Erro ao carregar dados.</td></tr>";
    }
}

// =============================
// FUNÇÕES PARA ABRIR E FECHAR POP-UPS
// =============================
window.abrirDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "flex";
    document.getElementById("entradaDataHora").value = new Date().toLocaleString("pt-BR");
};

window.fecharDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "none";
};

window.abrirBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "flex";
    document.getElementById("buscaRecInput").value = "";
    document.getElementById("buscaRecResultados").innerHTML = "";
};

window.fecharBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "none";
};

// =============================
// FUNÇÃO PARA BUSCAR PACIENTES NO FIRESTORE
// =============================
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

// =============================
// SELECIONAR PACIENTE NO POP-UP DE DAR ENTRADA
// =============================
window.selecionarPaciente = function (nome, cartao) {
    const nomeInput = document.getElementById("entradaNome");
    const cartaoInput = document.getElementById("entradaCartao");

    nomeInput.value = nome;
    cartaoInput.value = cartao;

    nomeInput.classList.add("input-bloqueado");
    cartaoInput.classList.add("input-bloqueado");

    fecharBuscaRec();
};

// =============================
// REGISTRAR ENTRADA DE PACIENTE NO FIRESTORE
// =============================
window.registrarEntrada = async function () {
    const nome = document.getElementById("entradaNome").value.trim();
    const dataHora = document.getElementById("entradaDataHora").value.trim();
    const classificacao = document.getElementById("entradaClassificacao").value.trim();

    if (!nome || !dataHora || !classificacao) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await addDoc(collection(db, "PACIENTES"), {
            nome: nome.toUpperCase(),
            entrada: dataHora,
            classificacao: classificacao.toUpperCase(),
        });

        alert("Paciente registrado com sucesso!");
        fecharDarEntrada();
        carregarPacientes(); // Atualiza a tabela
    } catch (error) {
        console.error("Erro ao registrar paciente:", error);
        alert("Erro ao registrar paciente.");
    }
};

// =============================
// FECHAR POP-UPS AO CLICAR FORA
// =============================
window.onclick = function (event) {
    if (event.target === document.getElementById("darEntradaPopup")) fecharDarEntrada();
    if (event.target === document.getElementById("buscaRec")) fecharBuscaRec();
};

// =============================
// CARREGAR PACIENTES AO INICIAR A PÁGINA
// =============================
document.addEventListener("DOMContentLoaded", carregarPacientes);