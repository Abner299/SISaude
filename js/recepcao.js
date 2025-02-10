// Importando Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Função para obter informações do médico logado
async function obterDadosMedico() {
    const userId = localStorage.getItem("userId");
    if (!userId) return "Usuário não identificado";

    try {
        const medicoSnap = await getDoc(doc(db, "usuarios", userId));
        if (medicoSnap.exists()) {
            const { nome, crm = "N/A", especialidade = "Sem Especialidade" } = medicoSnap.data();
            return `${nome} - CRM: ${crm} - ${especialidade}`;
        }
        return "Médico não encontrado";
    } catch (error) {
        console.error("Erro ao obter dados do médico:", error);
        return "Erro ao carregar";
    }
}

// Funções no escopo global para serem acessíveis no HTML
window.abrirDarEntrada = async function () {
    const popup = document.getElementById("darEntradaPopup");
    if (!popup) return;

    popup.style.display = "flex";
    document.getElementById("entradaDataHora").value = new Date().toLocaleString("pt-BR");
    document.getElementById("entradaMedico").value = await obterDadosMedico();
};

window.fecharDarEntrada = function () {
    const popup = document.getElementById("darEntradaPopup");
    if (popup) popup.style.display = "none";
};

window.darEntrada = async function () {
    const form = {
        nome: document.getElementById("entradaNome").value.trim(),
        numeroCartao: document.getElementById("entradaCartao").value.trim(),
        queixa: document.getElementById("entradaQueixa").value.trim(),
        temperatura: document.getElementById("entradaTemp").value.trim(),
        pressao: document.getElementById("entradaPressao").value.trim(),
        classificacao: document.querySelector("input[name='entradaClassificacao']:checked")?.value || "",
        medicoResponsavel: document.getElementById("entradaMedico").value
    };

    if (Object.values(form).includes("") || form.classificacao === "") {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await addDoc(collection(db, "RECEPCAO"), {
            ...form,
            nome: form.nome.toUpperCase(),
            queixa: form.queixa.toUpperCase(),
            classificacao: form.classificacao.toUpperCase(),
            dataHora: serverTimestamp()
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
    if (event.target === modal) fecharDarEntrada();
};