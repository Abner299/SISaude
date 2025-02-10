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

// Inicializa o Firebase apenas se ainda não estiver inicializado
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const db = getFirestore();

// Função para salvar os dados no Firestore (coleção ENTRADAS)
async function registrarEntrada() {
    const nome = document.getElementById("entradaNome").value.trim();
    const cartao = document.getElementById("entradaCartao").value.trim();
    const queixa = document.getElementById("entradaQueixa").value.trim();
    const temperatura = document.getElementById("entradaTemp").value.trim();
    const pressao = document.getElementById("entradaPressao").value.trim();
    const medico = document.getElementById("entradaMedico").value.trim();
    const dataHora = new Date().toLocaleString("pt-BR");
    
    // Obtendo a classificação de risco selecionada
    const classificacao = document.querySelector('input[name="entradaClassificacao"]:checked');
    const risco = classificacao ? classificacao.value : "";

    if (!nome || !cartao || !queixa || !temperatura || !pressao || !risco) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    try {
        await addDoc(collection(db, "ENTRADAS"), {
            nome: nome.toUpperCase(),
            cartao: cartao,
            queixa: queixa.toUpperCase(),
            temperatura: temperatura,
            pressao: pressao,
            classificacao: risco,
            medico: medico.toUpperCase(),
            dataHora: dataHora
        });

        alert("Entrada registrada com sucesso!");
        fecharDarEntrada();
        carregarPacientes(); // Atualiza a tabela após a inserção
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        alert("Erro ao registrar entrada. Tente novamente.");
    }
}

// Função para carregar os pacientes da coleção PACIENTES
async function carregarPacientes() {
    const tabela = document.querySelector("#tabelaPacientes tbody");
    tabela.innerHTML = ""; // Limpa os dados antes de carregar

    try {
        const querySnapshot = await getDocs(collection(db, "PACIENTES"));
        querySnapshot.forEach((doc) => {
            const paciente = doc.data();
            const linha = `
                <tr>
                    <td>${paciente.nome}</td>
                    <td>${paciente.dataHora || "Sem registro"}</td>
                    <td>${paciente.classificacao || "N/A"}</td>
                </tr>
            `;
            tabela.innerHTML += linha;
        });
    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
    }
}

// Função para abrir o pop-up de entrada e definir o horário e médico
function abrirDarEntrada() {
    document.getElementById("abrirDarEntrada").style.display = "block";
    document.getElementById("entradaDataHora").value = new Date().toLocaleString("pt-BR");
    document.getElementById("entradaMedico").value = "Dr. João Silva"; // Definir dinamicamente se necessário
}




// Função para fechar o pop-up de entrada
function fecharDarEntrada() {
    document.getElementById("darEntradaPopup").style.display = "none";
    document.getElementById("entradaForm").reset();
}

// Carregar os pacientes ao iniciar
document.addEventListener("DOMContentLoaded", carregarPacientes);