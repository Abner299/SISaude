// Importando Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Obtém informações do médico logado
async function obterDadosMedico() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("Usuário não identificado.");
        return "Desconhecido";
    }

    try {
        const medicoRef = doc(db, "usuarios", userId);
        const medicoSnap = await getDoc(medicoRef);

        if (medicoSnap.exists()) {
            const dados = medicoSnap.data();
            return `${dados.nome} - CRM: ${dados.crm || "N/A"} - ${dados.especialidade || "Sem Especialidade"}`;
        } else {
            console.error("Médico não encontrado.");
            return "Médico não encontrado";
        }
    } catch (error) {
        console.error("Erro ao obter dados do médico:", error);
        return "Erro ao obter dados";
    }
}

// Abrir pop-up de Dar Entrada
window.abrirDarEntrada = async function () {
    const popup = document.getElementById("darEntradaPopup");
    if (popup) {
        popup.style.display = "flex";
        document.getElementById("entradaDataHora").value = new Date().toLocaleString("pt-BR");
        document.getElementById("entradaMedico").value = await obterDadosMedico();
    }
};

// Fechar pop-up
window.fecharDarEntrada = function () {
    const popup = document.getElementById("darEntradaPopup");
    if (popup) popup.style.display = "none";
};

// Salvar no Firebase
window.darEntrada = async function () {
    const nomePaciente = document.getElementById("entradaNome").value.trim();
    const numCartao = document.getElementById("entradaCartao").value.trim();
    const queixa = document.getElementById("entradaQueixa").value.trim();
    const temperatura = document.getElementById("entradaTemp").value.trim();
    const pressao = document.getElementById("entradaPressao").value.trim();
    const classificacao = document.querySelector("input[name='entradaClassificacao']:checked");
    const medicoResponsavel = document.getElementById("entradaMedico").value;

    if (!nomePaciente || !numCartao || !queixa || !temperatura || !pressao || !classificacao) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await addDoc(collection(db, "RECEPCAO"), {
            nome: nomePaciente.toUpperCase(),
            numeroCartao: numCartao,
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

// Fechar pop-up ao clicar fora dele
window.onclick = function (event) {
    const modal = document.getElementById("darEntradaPopup");
    if (event.target === modal) {
        fecharDarEntrada();
    }
};