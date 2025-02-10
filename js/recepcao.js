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

// Inicializar Firebase apenas se ainda não foi inicializado
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
}
const db = getFirestore(app);

// Função para abrir o pop-up de Dar Entrada
function abrirDarEntrada() {
    document.getElementById("darEntradaPopup").style.display = "block";
}

// Função para fechar o pop-up de Dar Entrada
function fecharDarEntrada() {
    document.getElementById("darEntradaPopup").style.display = "none";
}

// Função para buscar pacientes na coleção "PACIENTES"
async function buscarPacientes() {
    const buscaInput = document.getElementById("buscaRecInput").value.trim().toUpperCase();
    const resultadosDiv = document.getElementById("buscaRecResultados");

    resultadosDiv.innerHTML = ""; // Limpa os resultados anteriores

    if (buscaInput === "") return;

    const pacientesRef = collection(db, "PACIENTES");
    const querySnapshot = await getDocs(pacientesRef);

    querySnapshot.forEach((doc) => {
        const paciente = doc.data();
        if (paciente.NOME.includes(buscaInput) || paciente.CARTAO.includes(buscaInput)) {
            const div = document.createElement("div");
            div.className = "resultado-item";
            div.innerHTML = `<strong>${paciente.NOME}</strong> - Cartão: ${paciente.CARTAO}`;
            div.onclick = () => selecionarPaciente(paciente);
            resultadosDiv.appendChild(div);
        }
    });
}

// Função para selecionar um paciente da busca
function selecionarPaciente(paciente) {
    document.getElementById("entradaNome").value = paciente.NOME;
    document.getElementById("entradaCartao").value = paciente.CARTAO;
    fecharBuscaRec();
}

// Função para fechar o pop-up de busca
function fecharBuscaRec() {
    document.getElementById("buscaRec").style.display = "none";
}

// Função para abrir a busca de pacientes
function abrirBuscaRec() {
    document.getElementById("buscaRec").style.display = "block";
}

// Função para registrar a entrada do paciente na coleção "ENTRADAS"
async function registrarEntrada() {
    const nome = document.getElementById("entradaNome").value.trim().toUpperCase();
    const cartao = document.getElementById("entradaCartao").value.trim();
    const queixa = document.getElementById("entradaQueixa").value.trim().toUpperCase();
    const temperatura = document.getElementById("entradaTemp").value.trim();
    const pressao = document.getElementById("entradaPressao").value.trim();
    const dataHora = new Date().toLocaleString("pt-BR");

    // Captura a classificação de risco selecionada
    const classificacao = document.querySelector("input[name='entradaClassificacao']:checked")?.value || "NÃO CLASSIFICADO";

    // Validação
    if (!nome || !cartao || !queixa) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    try {
        await addDoc(collection(db, "ENTRADAS"), {
            NOME: nome,
            CARTAO: cartao,
            QUEIXA: queixa,
            TEMPERATURA: temperatura,
            PRESSAO: pressao,
            CLASSIFICACAO: classificacao,
            DATA_HORA: dataHora
        });

        alert("Entrada registrada com sucesso!");
        fecharDarEntrada();
        atualizarListaPacientes();
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        alert("Erro ao registrar entrada. Tente novamente.");
    }
}

// Função para atualizar a lista de pacientes na tabela
async function atualizarListaPacientes() {
    const tabelaBody = document.querySelector("#tabelaPacientes tbody");
    tabelaBody.innerHTML = ""; // Limpa a tabela

    const entradasRef = collection(db, "ENTRADAS");
    const querySnapshot = await getDocs(entradasRef);

    querySnapshot.forEach((doc) => {
        const entrada = doc.data();
        const row = tabelaBody.insertRow();

        row.innerHTML = `
            <td>${entrada.NOME}</td>
            <td>${entrada.DATA_HORA}</td>
            <td>${entrada.CLASSIFICACAO}</td>
        `;
    });
}

// Deixar funções acessíveis globalmente
window.abrirDarEntrada = abrirDarEntrada;
window.fecharDarEntrada = fecharDarEntrada;
window.registrarEntrada = registrarEntrada;
window.buscarPacientes = buscarPacientes;
window.abrirBuscaRec = abrirBuscaRec;
window.fecharBuscaRec = fecharBuscaRec;
window.atualizarListaPacientes = atualizarListaPacientes;