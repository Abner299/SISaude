import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRpgYQtFHZGTlf9c4b6REiMqKL99GubR8",
    authDomain: "sisaude-58311.firebaseapp.com",
    projectId: "sisaude-58311",
    storageBucket: "sisaude-58311.firebasestorage.app",
    messagingSenderId: "558586585256",
    appId: "1:558586585256:web:9f4cf5576d88ee0826a29d",
    measurementId: "G-PGY4RB77P9"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para alternar páginas
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });
    document.getElementById(pageId).classList.add("active");
}

// Função para abrir e fechar pop-up de cadastro
function abrirPopupCadastro() {
    document.getElementById("popupCadastro").style.display = "block";
}
function fecharPopupCadastro() {
    document.getElementById("popupCadastro").style.display = "none";
}

// Função para gerar CRM único
async function gerarCRM() {
    let numeroAleatorio;
    let crmExiste = true;

    while (crmExiste) {
        numeroAleatorio = Math.floor(Math.random() * 90) + 10; // Gera número entre 10 e 99
        const crm = `20${numeroAleatorio}`;
        const docRef = doc(db, "USERS", crm);
        const docSnap = await getDoc(docRef);
        crmExiste = docSnap.exists();
    }

    return `20${numeroAleatorio}`;
}

// Função para registrar usuário no Firestore
async function registrarUsuario() {
    const user = document.getElementById("cadUser").value.trim();
    const senha = document.getElementById("cadSenha").value.trim();
    const nome = document.getElementById("cadNome").value.trim();
    const especialidade = document.getElementById("cadEspecialidade").value.trim();

    if (!user || !senha || !nome || !especialidade) {
        alert("Preencha todos os campos!");
        return;
    }

    const userRef = doc(db, "USERS", user);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        alert("Usuário já existe!");
        return;
    }

    const crm = await gerarCRM();

    await setDoc(userRef, {
        user: user,
        senha: senha,
        nome: nome,
        especialidade: especialidade,
        crm: crm
    });

    alert("Usuário cadastrado com sucesso!");
    fecharPopupCadastro();
}

// Evento para trocar a data/hora automaticamente
function atualizarDataHora() {
    const agora = new Date();
    const dataFormatada = agora.toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" });
    document.getElementById("date-time").innerText = dataFormatada;
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();
// Tornando a função acessível globalmente
window.showPage = function (pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });
    document.getElementById(pageId).classList.add("active");
};