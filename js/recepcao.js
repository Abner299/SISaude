// Importando o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// **Função para adicionar um paciente à recepção**
window.darEntrada = async function () {
    const nomePaciente = prompt("Nome do paciente:");
    const classificacao = prompt("Classificação de risco (Leve, Moderado, Grave):");

    if (!nomePaciente || !classificacao) {
        alert("Preencha todas as informações.");
        return;
    }

    try {
        await addDoc(collection(db, "RECEPCAO"), {
            nome: nomePaciente.toUpperCase(),
            classificacao: classificacao.toUpperCase(),
            dataHora: serverTimestamp()
        });
        alert("Entrada registrada com sucesso!");
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        alert("Erro ao registrar entrada.");
    }
};

// **Função para atualizar a lista em tempo real**
function carregarLista() {
    const lista = document.getElementById("listaPacientes");
    lista.innerHTML = "<tr><th>Nome</th><th>Data e Hora</th><th>Classificação</th></tr>";

    onSnapshot(collection(db, "RECEPCAO"), (snapshot) => {
        lista.innerHTML = "<tr><th>Nome</th><th>Data e Hora</th><th>Classificação</th></tr>"; // Reset lista

        snapshot.forEach((doc) => {
            const paciente = doc.data();
            const dataFormatada = paciente.dataHora ? new Date(paciente.dataHora.seconds * 1000).toLocaleString("pt-BR") : "Sem Data";

            lista.innerHTML += `
                <tr>
                    <td>${paciente.nome}</td>
                    <td>${dataFormatada}</td>
                    <td>${paciente.classificacao}</td>
                </tr>
            `;
        });
    });
}

// **Chamar a função ao carregar a página**
document.addEventListener("DOMContentLoaded", carregarLista);