// Importando o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Função para obter informações do médico logado
async function obterDadosMedico() {
    const userId = localStorage.getItem("userId"); // Supondo que o ID do usuário logado está salvo no localStorage
    if (!userId) {
        console.error("Usuário não identificado.");
        return "";
    }

    const medicoRef = doc(db, "usuarios", userId);
    const medicoSnap = await getDoc(medicoRef);

    if (medicoSnap.exists()) {
        const dados = medicoSnap.data();
        return `${dados.nome} - CRM: ${dados.crm} - ${dados.especialidade}`;
    } else {
        console.error("Médico não encontrado no banco.");
        return "";
    }
}

// Função para abrir o pop-up "DarEntrada"
window.abrirDarEntrada = async function () {
    const modal = document.getElementById("DarEntrada");
    document.getElementById("dataHoraEntrada").value = new Date().toLocaleString("pt-BR");

    // Preenchendo o nome do médico automaticamente
    document.getElementById("medicoResponsavel").value = await obterDadosMedico();

    modal.style.display = "block";
};

// Função para fechar o pop-up
window.fecharDarEntrada = function () {
    document.getElementById("DarEntrada").style.display = "none";
};

// Função para salvar os dados no Firestore
window.darEntrada = async function () {
    const nomePaciente = document.getElementById("nomePaciente").value.trim();
    const numeroCartao = document.getElementById("numeroCartao").value.trim();
    const queixa = document.getElementById("queixa").value.trim();
    const temperatura = document.getElementById("temperatura").value.trim();
    const pressao = document.getElementById("pressao").value.trim();
    const classificacao = document.querySelector("input[name='classificacao']:checked");
    const dataHoraEntrada = new Date();
    const medicoResponsavel = document.getElementById("medicoResponsavel").value;

    if (!nomePaciente || !numeroCartao || !queixa || !temperatura || !pressao || !classificacao) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await addDoc(collection(db, "RECEPCAO"), {
            nome: nomePaciente.toUpperCase(),
            numeroCartao,
            queixa: queixa.toUpperCase(),
            temperatura,
            pressao,
            classificacao: classificacao.value.toUpperCase(),
            dataHora: serverTimestamp(),
            medicoResponsavel
        });

        alert("Entrada registrada com sucesso!");
        fecharDarEntrada();
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        alert("Erro ao registrar entrada.");
    }
};