import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAi_BtXUJhdIEo3psuJid-z6rywbn_lroM",
    authDomain: "goias-ep.firebaseapp.com",
    projectId: "goias-ep",
    storageBucket: "goias-ep.appspot.com",
    messagingSenderId: "955246303922",
    appId: "1:955246303922:web:578d8a19470469736b87ab"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para abrir pop-up de dar entrada
window.abrirDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "block";
    document.getElementById("entradaDataHora").value = new Date().toLocaleString();
    document.getElementById("entradaMedico").value = document.querySelector(".user-info p strong").innerText;
};

// Fechar pop-up de dar entrada
window.fecharDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "none";
};

// Abrir pop-up de busca
window.abrirBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "block";
};

// Fechar pop-up de busca
window.fecharBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "none";
};

// Confirmar entrada e salvar no Firestore
window.confirmarEntrada = async function () {
    const nome = document.getElementById("entradaNome").value.trim().toUpperCase();
    const cartao = document.getElementById("entradaCartao").value.trim();
    const queixa = document.getElementById("entradaQueixa").value.trim();
    const temperatura = document.getElementById("entradaTemp").value.trim();
    const pressao = document.getElementById("entradaPressao").value.trim();
    const dataHora = document.getElementById("entradaDataHora").value;
    const medico = document.getElementById("entradaMedico").value;
    const classificacao = document.querySelector("input[name='entradaClassificacao']:checked");

    if (!nome || !cartao || !queixa || !classificacao) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    try {
        await addDoc(collection(db, "pacientes"), {
            nome,
            cartao,
            queixa,
            temperatura,
            pressao,
            dataHora,
            medico,
            classificacao: classificacao.value
        });

        alert("Entrada registrada com sucesso!");
        fecharDarEntrada();
        carregarPacientes();
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao registrar entrada.");
    }
};

// Buscar pacientes
window.buscarPacientes = async function () {
    const termo = document.getElementById("buscaRecInput").value.trim().toUpperCase();
    const resultadosDiv = document.getElementById("buscaRecResultados");
    resultadosDiv.innerHTML = "";

    if (!termo) return;

    const q = query(collection(db, "pacientes"), where("nome", ">=", termo), where("nome", "<=", termo + "\uf8ff"), orderBy("nome"), limit(5));
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
        const paciente = doc.data();
        const item = document.createElement("div");
        item.className = "resultado-item";
        item.innerHTML = `<strong>${paciente.nome}</strong> - Cartão: ${paciente.cartao}`;
        item.onclick = () => selecionarPaciente(paciente);
        resultadosDiv.appendChild(item);
    });
};

// Selecionar paciente da busca
window.selecionarPaciente = function (paciente) {
    document.getElementById("entradaNome").value = paciente.nome;
    document.getElementById("entradaCartao").value = paciente.cartao;
    fecharBuscaRec();
};

// Carregar pacientes na tabela
window.carregarPacientes = async function () {
    const tabela = document.getElementById("tabelaPacientes").querySelector("tbody");
    tabela.innerHTML = "";

    const q = query(collection(db, "pacientes"), orderBy("dataHora", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
        const paciente = doc.data();
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${paciente.nome}</td>
            <td>${paciente.dataHora}</td>
            <td>${paciente.classificacao}</td>
        `;
        tabela.appendChild(tr);
    });
};

// Carregar pacientes ao abrir a página
window.onload = carregarPacientes;