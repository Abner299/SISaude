document.addEventListener("DOMContentLoaded", function () {
    showPage('home'); // Página inicial padrão

    // Evento de clique para itens do menu
    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Evento para abrir pop-up de cadastro de usuário
    document.getElementById("btn-add-user").addEventListener("click", function () {
        document.getElementById("popup-cadastro").style.display = "block";
    });

    // Evento para fechar pop-up
    document.getElementById("close-popup").addEventListener("click", function () {
        document.getElementById("popup-cadastro").style.display = "none";
    });

    // Evento para salvar usuário
    document.getElementById("btn-save-user").addEventListener("click", function () {
        const username = document.getElementById("user").value.trim();
        const password = document.getElementById("password").value.trim();
        const nome = document.getElementById("nome").value.trim();
        const especialidade = document.getElementById("especialidade").value.trim();

        if (username && password && nome && especialidade) {
            const crm = "20" + Math.floor(10 + Math.random() * 90); // CRM aleatório

            const novoUsuario = {
                username: username.toUpperCase(),
                password: password,
                nome: nome.toUpperCase(),
                especialidade: especialidade.toUpperCase(),
                crm: crm + " SISaúde"
            };

            console.log("Usuário cadastrado:", novoUsuario);
            alert("Usuário cadastrado com sucesso!");

            document.getElementById("popup-cadastro").style.display = "none";
        } else {
            alert("Preencha todos os campos!");
        }
    });
});

// Função para trocar páginas
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}






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

// Função para registrar usuário
async function registrarUsuario(user, senha, nome, especialidade) {
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
}

// Exemplo de uso:
registrarUsuario("drjoao", "123456", "Dr. João Silva", "Cardiologista");