// Importando Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Inicialização do Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Carregar pacientes na tabela
async function carregarPacientes() {
    const tabelaBody = document.querySelector("#tabelaPacientes tbody");
    tabelaBody.innerHTML = ""; // Limpa a tabela antes de carregar os dados

    try {
        const snapshot = await getDocs(collection(db, "ENTRADAS"));

        if (snapshot.empty) {
            tabelaBody.innerHTML = "<tr><td colspan='3'>Nenhum paciente encontrado.</td></tr>";
            return;
        }

        snapshot.forEach((doc) => {
            const paciente = doc.data();
            const nome = paciente.nome || "Sem Nome";
            const entrada = paciente.entrada || "Data não disponível";
            const classificacao = (paciente.classificacao || "").trim().toUpperCase();

            // Definir a classe de cor conforme a classificação
            let corClassificacao = "";
            if (classificacao === "LEVE") corClassificacao = "linha-leve";
            else if (classificacao === "MODERADO") corClassificacao = "linha-moderado";
            else if (classificacao === "GRAVE") corClassificacao = "linha-grave";

            // Criar linha na tabela
            const row = document.createElement("tr");
            if (corClassificacao) row.classList.add(corClassificacao); // Adiciona a classe somente se existir

            row.innerHTML = `
                <td>${nome}</td>
                <td>${entrada}</td>
                <td>${classificacao || "Não classificado"}</td>
                <td>
                    <div class="botoes-container">
                        <button class="editar-btn">Editar</button>
                        <button class="excluir-btn">Excluir</button>
                        <button class="seta-btn" onclick="moverParaAtendimento('${doc.id}')">→</button> <!-- Seta para mover para atendimento -->
                    </div>
                </td>
            `;

            tabelaBody.appendChild(row);
        });

    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        tabelaBody.innerHTML = "<tr><td colspan='3'>Erro ao carregar dados.</td></tr>";
    }
}

// Função para mover documento para a tabela 'atendimento'
async function moverParaAtendimento(docId) {
    try {
        const pacienteRef = doc(db, "ENTRADAS", docId);
        const pacienteSnapshot = await getDoc(pacienteRef);
        
        if (pacienteSnapshot.exists()) {
            const pacienteData = pacienteSnapshot.data();

            // Adicionando o paciente à coleção 'atendimento'
            await addDoc(collection(db, "ATENDIMENTO"), pacienteData);

            // Excluindo o paciente da coleção 'ENTRADAS'
            await deleteDoc(pacienteRef);

            alert("Paciente movido para atendimento com sucesso!");
            carregarPacientes();  // Atualiza a lista de pacientes
        } else {
            console.log("Paciente não encontrado");
        }
    } catch (error) {
        console.error("Erro ao mover paciente para atendimento:", error);
    }
}

// Fechar pop-ups
window.fecharDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "none";
};

// Carregar pacientes ao abrir a página
document.addEventListener("DOMContentLoaded", carregarPacientes);