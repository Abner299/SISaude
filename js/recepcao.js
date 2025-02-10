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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exibir Data e Hora no Formulário
function atualizarDataHora() {
    const now = new Date();
    const dataHoraFormatada = now.toLocaleString("pt-BR");
    document.getElementById("entradaDataHora").value = dataHoraFormatada;
}

// Abrir e Fechar Pop-ups
function abrirDarEntrada() {
    document.getElementById("darEntradaPopup").style.display = "block";
    atualizarDataHora();
}

function fecharDarEntrada() {
    document.getElementById("darEntradaPopup").style.display = "none";
}

// Função para Registrar Entrada no Firebase
async function registrarEntrada() {
    const nome = document.getElementById("entradaNome").value.trim();
    const cartao = document.getElementById("entradaCartao").value.trim();
    const queixa = document.getElementById("entradaQueixa").value.trim();
    const temp = document.getElementById("entradaTemp").value.trim();
    const pressao = document.getElementById("entradaPressao").value.trim();
    const medico = document.getElementById("entradaMedico").value.trim();
    const dataHora = document.getElementById("entradaDataHora").value.trim();
    const classificacao = document.querySelector('input[name="entradaClassificacao"]:checked');

    if (!nome || !cartao || !queixa || !temp || !pressao || !medico || !dataHora || !classificacao) {
        alert("Preencha todos os campos!");
        return;
    }

    const pacienteData = {
        nome: nome.toUpperCase(),
        cartao: cartao,
        queixa: queixa.toUpperCase(),
        temp: temp,
        pressao: pressao,
        medico: medico.toUpperCase(),
        dataHora: dataHora,
        classificacao: classificacao.value.toUpperCase()
    };

    try {
        await addDoc(collection(db, "pacientes"), pacienteData);
        alert("Entrada registrada com sucesso!");
        fecharDarEntrada();
        carregarPacientes();
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
    }
}

// Carregar Lista de Pacientes no Firebase
async function carregarPacientes() {
    const tabela = document.querySelector("#tabelaPacientes tbody");
    tabela.innerHTML = "";

    const q = query(collection(db, "pacientes"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const paciente = doc.data();
        const linha = `
            <tr>
                <td>${paciente.nome}</td>
                <td>${paciente.dataHora}</td>
                <td>${paciente.classificacao}</td>
            </tr>`;
        tabela.innerHTML += linha;
    });
}

// Abrir e Fechar Pop-up de Busca
function abrirBuscaRec() {
    document.getElementById("buscaRec").style.display = "block";
}

function fecharBuscaRec() {
    document.getElementById("buscaRec").style.display = "none";
}

// Buscar Pacientes no Firebase
async function buscarPacientes() {
    const termo = document.getElementById("buscaRecInput").value.trim().toUpperCase();
    const resultadosDiv = document.getElementById("buscaRecResultados");
    resultadosDiv.innerHTML = "";

    if (termo === "") return;

    const q = query(collection(db, "pacientes"), where("nome", ">=", termo), where("nome", "<=", termo + "\uf8ff"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const paciente = doc.data();
        const item = document.createElement("p");
        item.textContent = `${paciente.nome} - ${paciente.cartao}`;
        item.onclick = () => selecionarPaciente(paciente);
        resultadosDiv.appendChild(item);
    });
}

// Selecionar Paciente na Busca
function selecionarPaciente(paciente) {
    document.getElementById("entradaNome").value = paciente.nome;
    document.getElementById("entradaCartao").value = paciente.cartao;
    fecharBuscaRec();
}

// Iniciar carregamento de pacientes ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
    carregarPacientes();
});

// Tornar funções globais para serem chamadas no HTML
window.abrirDarEntrada = abrirDarEntrada;
window.fecharDarEntrada = fecharDarEntrada;
window.registrarEntrada = registrarEntrada;
window.abrirBuscaRec = abrirBuscaRec;
window.fecharBuscaRec = fecharBuscaRec;
window.buscarPacientes = buscarPacientes;