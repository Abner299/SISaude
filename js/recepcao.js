// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Buscar pacientes
window.buscarPacientes = async function () {
    const termo = document.getElementById("buscaRecInput").value.trim().toUpperCase();
    const resultadosContainer = document.getElementById("buscaRecResultados");
    resultadosContainer.innerHTML = "";

    if (!termo) return;

    const qNome = query(
        collection(db, "PACIENTES"),
        where("nome", ">=", termo),
        where("nome", "<=", termo + "\uf8ff")
    );

    const qCartao = query(
        collection(db, "PACIENTES"),
        where("cartao_n", ">=", Number(termo)),
        where("cartao_n", "<=", Number(termo) + "\uf8ff")
    );

    try {
        let pacientes = [];

        const querySnapshotNome = await getDocs(qNome);
        querySnapshotNome.forEach((doc) => pacientes.push(doc.data()));

        const querySnapshotCartao = await getDocs(qCartao);
        querySnapshotCartao.forEach((doc) => {
            const paciente = doc.data();
            if (!pacientes.some(p => p.cartao_n === paciente.cartao_n)) {
                pacientes.push(paciente);
            }
        });

        if (pacientes.length === 0) {
            resultadosContainer.innerHTML = "<p>Nenhum paciente encontrado.</p>";
            return;
        }

        pacientes.forEach((paciente) => {
            const div = document.createElement("div");
            div.classList.add("buscaRec-item");
            div.innerHTML = `
                <p><strong>${paciente.nome}</strong> - Cartão: ${paciente.cartao_n} - Idade: ${paciente.idade}</p>
                <button onclick="selecionarPaciente('${paciente.nome}', '${paciente.cartao_n}')">✔</button>
            `;
            resultadosContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        resultadosContainer.innerHTML = "<p>Erro na busca.</p>";
    }
};

// Preencher dados no pop-up de Dar Entrada
window.selecionarPaciente = function (nome, cartao) {
    const nomeInput = document.getElementById("entradaNome");
    const cartaoInput = document.getElementById("entradaCartao");

    nomeInput.value = nome;
    cartaoInput.value = cartao;

    // Adiciona classe para bloquear a edição
    nomeInput.classList.add("input-bloqueado");
    cartaoInput.classList.add("input-bloqueado");

    fecharBuscaRec();
};

// Fechar pop-ups ao clicar fora
window.onclick = function (event) {
    if (event.target === document.getElementById("darEntradaPopup")) fecharDarEntrada();
    if (event.target === document.getElementById("buscaRec")) fecharBuscaRec();
};