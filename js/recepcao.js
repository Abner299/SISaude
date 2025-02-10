// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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
            tabelaBody.innerHTML = "<tr><td colspan='3'>Nenhum paciente encontrado.</td></tr>";
            return;
        }

        snapshot.forEach((doc) => {
            const paciente = doc.data();
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
            `;

            tabelaBody.appendChild(row);
        });

    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        tabelaBody.innerHTML = "<tr><td colspan='3'>Erro ao carregar dados.</td></tr>";
    }
}

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

// Preencher dados no pop-up de Dar Entrada e travar os campos
window.selecionarPaciente = function (nome, cartao) {
    const nomeInput = document.getElementById("entradaNome");
    const cartaoInput = document.getElementById("entradaCartao");

    nomeInput.value = nome;
    cartaoInput.value = cartao;

    nomeInput.classList.add("input-bloqueado");
    cartaoInput.classList.add("input-bloqueado");

    fecharBuscaRec();
};

// Adicionar paciente ao banco de dados
window.registrarEntrada = async function () {
    const nome = document.getElementById("entradaNome").value.trim();
    const cartao = document.getElementById("entradaCartao").value.trim();
    const queixa = document.getElementById("entradaQueixa").value.trim();
    const temperatura = document.getElementById("entradaTemp").value.trim();
    const pressao = document.getElementById("entradaPressao").value.trim();
    const classificacao = document.querySelector('input[name="entradaClassificacao"]:checked')?.value || "NÃO INFORMADO";
    const dataHora = new Date().toLocaleString("pt-BR");
    const medico = document.getElementById("entradaMedico").value.trim();

    if (!nome || !cartao || !queixa) {
        alert("Por favor, preencha os campos obrigatórios.");
        return;
    }

    try {
        await addDoc(collection(db, "ENTRADAS"), {
            nome: nome.toUpperCase(),
            cartao: cartao.toUpperCase(),
            queixa: queixa.toUpperCase(),
            temperatura: temperatura,
            pressao: pressao,
            classificacao: classificacao.toUpperCase(),
            dataHoraEntrada: dataHora,
            medico: medico.toUpperCase(),
            timestamp: serverTimestamp()
        });

        alert("Entrada registrada com sucesso!");
        fecharDarEntrada();
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        alert("Erro ao salvar no banco de dados.");
    }
};

// Fechar pop-ups ao clicar fora
window.onclick = function (event) {
    if (event.target === document.getElementById("darEntradaPopup")) fecharDarEntrada();
    if (event.target === document.getElementById("buscaRec")) fecharBuscaRec();
};

// Carregar pacientes ao abrir a página
document.addEventListener("DOMContentLoaded", carregarPacientes);