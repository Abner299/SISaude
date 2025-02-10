// Importando o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Mostra uma página ao clicar no menu
window.showPage = function (pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });
    document.getElementById(pageId).classList.add("active");
};

// Função para abrir o pop-up de cadastro de usuário
window.abrirCadastroUsuario = function () {
    document.getElementById("popupCadastroUsuario").style.display = "block";
};

// Fechar o pop-up
window.fecharCadastroUsuario = function () {
    document.getElementById("popupCadastroUsuario").style.display = "none";
};

// Gerar CRM automaticamente (começa com "20" + 2 números aleatórios)
function gerarCRM() {
    return "20" + Math.floor(10 + Math.random() * 90); // Exemplo: 2023
}

// Cadastrar usuário no Firebase Firestore
window.cadastrarUsuario = async function () {
    const user = document.getElementById("user").value.trim().toUpperCase();
    const senha = document.getElementById("senha").value;
    const nome = document.getElementById("nome").value.trim().toUpperCase();
    const especialidade = document.getElementById("especialidade").value.trim().toUpperCase();
    const crm = gerarCRM();

    if (!user || !senha || !nome || !especialidade) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        await setDoc(doc(db, "USERS", user), {
            user,
            senha,
            nome,
            especialidade,
            crm
        });

        alert(`Usuário ${user} cadastrado com sucesso!`);
        fecharCadastroUsuario();
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        alert("Erro ao cadastrar usuário. Tente novamente.");
    }
};
// Verifica se o usuário está logado
const userData = JSON.parse(localStorage.getItem("user"));

if (userData) {
    document.querySelector(".user-info").innerHTML = `
        <p><strong>Nome:</strong> ${userData.nome}</p>
        <p><strong>Cargo:</strong> ${userData.especialidade}</p>
        <p><strong>CRM:</strong> ${userData.crm}</p>
    `;
} else {
    alert("Usuário não autenticado. Faça login novamente.");
    window.location.href = "index.html"; // Redireciona para o login
}
function atualizarDataHora() {
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString("pt-BR");
    const horaFormatada = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    document.getElementById("date-time").textContent = `${dataFormatada} - ${horaFormatada}`;
}

// Atualiza a cada segundo
setInterval(atualizarDataHora, 1000);
atualizarDataHora();