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

// Evita erro de inicialização duplicada
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Função para carregar pacientes na tabela
async function carregarPacientes() {
    const tabelaBody = document.querySelector("#tabelaPacientes tbody");
    if (!tabelaBody) return;

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

// Abrir pop-up de Dar Entrada
window.abrirDarEntrada = function () {
    const popup = document.getElementById("darEntradaPopup");
    const entradaDataHora = document.getElementById("entradaDataHora");

    if (popup && entradaDataHora) {
        popup.style.display = "flex";
        entradaDataHora.value = new Date().toLocaleString("pt-BR");
    }
};

// Fechar pop-ups
window.fecharDarEntrada = function () {
    const popup = document.getElementById("darEntradaPopup");
    if (popup) popup.style.display = "none";
};

window.fecharBuscaRec = function () {
    const popup = document.getElementById("buscaRec");
    if (popup) popup.style.display = "none";
};

// Abrir pop-up de busca
window.abrirBuscaRec = function () {
    const popup = document.getElementById("buscaRec");
    const input = document.getElementById("buscaRecInput");
    const resultados = document.getElementById("buscaRecResultados");

    if (popup && input && resultados) {
        popup.style.display = "flex";
        input.value = "";
        resultados.innerHTML = "";
    }
};

// Buscar pacientes no Firestore
window.buscarPacientes = async function () {
    const input = document.getElementById("buscaRecInput");
    const resultadosContainer = document.getElementById("buscaRecResultados");

    if (!input || !resultadosContainer) return;

    const termo = input.value.trim().toUpperCase();
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
        } else {
            encontrados.forEach((paciente) => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <p><strong>Nome:</strong> ${paciente.nome}</p>
                    <p><strong>Cartão:</strong> ${paciente.cartao_n}</p>
                    <button onclick="selecionarPaciente('${paciente.id}')">Selecionar</button>
                `;
                resultadosContainer.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        resultadosContainer.innerHTML = "<p>Erro ao buscar pacientes.</p>";
    }
};

// Selecionar paciente para preencher o formulário
window.selecionarPaciente = function (id) {
    const popup = document.getElementById("buscaRec");
    if (popup) popup.style.display = "none";

    const paciente = pacientes.find(p => p.id === id);
    if (paciente) {
        document.getElementById("entradaNome").value = paciente.nome;
        document.getElementById("entradaCartao").value = paciente.cartao_n;
    }
};

// Registrar entrada
window.registrarEntrada = function () {
    const nome = document.getElementById("entradaNome").value;
    const cartao = document.getElementById("entradaCartao").value;
    const queixa = document.getElementById("entradaQueixa").value;
    const temp = document.getElementById("entradaTemp").value;
    const pressao = document.getElementById("entradaPressao").value;
    const classificacao = document.querySelector('input[name="entradaClassificacao"]:checked')?.value;

    if (!nome || !cartao || !queixa || !temp || !pressao || !classificacao) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        addDoc(collection(db, "PACIENTES"), {
            nome: nome,
            cartao_n: cartao,
            queixa: queixa,
            temperatura: temp,
            pressao: pressao,
            classificacao: classificacao,
            entrada: new Date().toLocaleString("pt-BR"),
        });

        alert("Entrada registrada com sucesso!");
        fecharDarEntrada();
        carregarPacientes();
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        alert("Erro ao registrar entrada.");
    }
};

// Função para carregar pacientes ao iniciar
document.addEventListener("DOMContentLoaded", carregarPacientes);