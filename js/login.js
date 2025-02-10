// Importando o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Função para validar login
async function login(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const username = document.getElementById("username").value.trim().toUpperCase();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "USERS", username));

        if (!userDoc.exists()) {
            alert("Usuário não encontrado!");
            return;
        }

        const userData = userDoc.data();

        if (userData.senha !== password) {
            alert("Senha incorreta!");
            return;
        }

        // Armazena os dados do usuário no localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Redireciona para a página principal
        window.location.href = "home.html";
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao tentar logar. Tente novamente.");
    }
}

// Adiciona o evento ao formulário
document.getElementById("loginForm").addEventListener("submit", login);