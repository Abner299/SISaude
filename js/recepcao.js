// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Referência à tabela de pacientes
const tabelaPacientes = document.querySelector("#tabelaPacientes tbody");

// Função para carregar pacientes na tabela
function carregarPacientes() {
    const q = query(collection(db, "PACIENTES"), orderBy("dataHoraEntrada", "desc"));

    onSnapshot(q, (snapshot) => {
        tabelaPacientes.innerHTML = ""; // Limpa a tabela antes de preencher novamente

        snapshot.forEach((doc) => {
            const paciente = doc.data();
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${paciente.nome || "N/A"}</td>
                <td>${paciente.cartao_n || "N/A"}</td>
                <td>${paciente.idade || "N/A"}</td>
                <td>${paciente.dataHoraEntrada || "N/A"}</td>
                <td><button onclick="verDetalhes('${doc.id}')">Ver</button></td>
            `;

            tabelaPacientes.appendChild(tr);
        });
    });
}

// Função para abrir o pop-up de Dar Entrada
window.abrirDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "flex";
    document.getElementById("entradaDataHora").value = new Date().toLocaleString("pt-BR");
};

// Função para fechar pop-ups
window.fecharDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "none";
};
window.fecharBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "none";
};

// Função para abrir pop-up de busca
window.abrirBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "flex";
    document.getElementById("buscaRecInput").value = "";
    document.getElementById("buscaRecResultados").innerHTML = "";
};

// Função para buscar pacientes por nome ou cartão
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

// Função para selecionar paciente no pop-up de Dar Entrada
window.selecionarPaciente = function (nome, cartao) {
    const nomeInput = document.getElementById("entradaNome");
    const cartaoInput = document.getElementById("entradaCartao");

    nomeInput.value = nome;
    cartaoInput.value = cartao;

    nomeInput.classList.add("input-bloqueado");
    cartaoInput.classList.add("input-bloqueado");

    fecharBuscaRec();
};

// Função para adicionar paciente no Firestore
window.adicionarPaciente = async function () {
    const nome = document.getElementById("entradaNome").value.trim();
    const cartao = document.getElementById("entradaCartao").value.trim();
    const idade = document.getElementById("entradaIdade").value.trim();
    const dataHoraEntrada = document.getElementById("entradaDataHora").value.trim();

    if (!nome || !cartao || !idade || !dataHoraEntrada) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await addDoc(collection(db, "PACIENTES"), {
            nome: nome.toUpperCase(),
            cartao_n: cartao,
            idade: idade,
            dataHoraEntrada: dataHoraEntrada
        });

        alert("Paciente adicionado com sucesso!");
        fecharDarEntrada();
    } catch (error) {
        console.error("Erro ao adicionar paciente:", error);
        alert("Erro ao adicionar paciente.");
    }
};

// Função para ver detalhes do paciente
window.verDetalhes = function (id) {
    alert("Detalhes do paciente: " + id);
};

// Fechar pop-ups ao clicar fora
window.onclick = function (event) {
    if (event.target === document.getElementById("darEntradaPopup")) fecharDarEntrada();
    if (event.target === document.getElementById("buscaRec")) fecharBuscaRec();
};

// Carregar pacientes na tabela ao abrir a página
document.addEventListener("DOMContentLoaded", carregarPacientes);