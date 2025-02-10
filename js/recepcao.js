// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Buscar pacientes no Firestore
window.buscarPacientes = async function () {
    const termo = document.getElementById("buscaRecInput").value.trim().toUpperCase();
    const resultadosContainer = document.getElementById("buscaRecResultados");
    resultadosContainer.innerHTML = "";

    if (!termo) return;

    try {
        const querySnapshot = await getDocs(collection(db, "PACIENTES"));
        let encontrou = false;

        querySnapshot.forEach((doc) => {
            const paciente = doc.data();
            const cartaoStr = String(paciente.cartao_n); // Convertendo cartao_n para string

            if (
                paciente.nome.toUpperCase().includes(termo) || 
                cartaoStr.includes(termo) // Busca no número do cartão
            ) {
                encontrou = true;
                const div = document.createElement("div");
                div.classList.add("buscaRec-item");
                div.innerHTML = `
                    <p><strong>${paciente.nome}</strong> - Cartão: ${paciente.cartao_n} - Idade: ${paciente.idade}</p>
                    <button onclick="selecionarPaciente('${paciente.nome}', '${paciente.cartao_n}')">✔</button>
                `;
                resultadosContainer.appendChild(div);
            }
        });

        if (!encontrou) {
            resultadosContainer.innerHTML = "<p>Nenhum paciente encontrado.</p>";
        }

    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        resultadosContainer.innerHTML = "<p>Erro na busca.</p>";
    }
};

// Preencher dados no pop-up de Dar Entrada
window.selecionarPaciente = function (nome, cartao) {
    document.getElementById("entradaNome").value = nome;
    document.getElementById("entradaCartao").value = cartao;
    fecharBuscaRec();
};

// Fechar pop-ups ao clicar fora
window.onclick = function (event) {
    if (event.target === document.getElementById("darEntradaPopup")) fecharDarEntrada();
    if (event.target === document.getElementById("buscaRec")) fecharBuscaRec();
};