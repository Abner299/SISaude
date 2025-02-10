// Importando o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Configuração do Firebase (SISaúde)
const firebaseConfig = {
    apiKey: "AIzaSyCRpgYQtFHZGTlf9c4b6REiMqKL99GubR8",
    authDomain: "sisaude-58311.firebaseapp.com",
    projectId: "sisaude-58311",
    storageBucket: "sisaude-58311.firebasestorage.app",
    messagingSenderId: "558586585256",
    appId: "1:558586585256:web:9f4cf5576d88ee0826a29d",
    measurementId: "G-PGY4RB77P9"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para carregar a equipe médica
async function carregarEquipeMedica() {
    const equipeContainer = document.getElementById("listaEquipe");
    equipeContainer.innerHTML = ""; // Limpa antes de carregar os dados

    try {
        const querySnapshot = await getDocs(collection(db, "EQUIPE"));
        querySnapshot.forEach((doc) => {
            const medico = doc.data();
            
            // Cria a estrutura de exibição
            const medicoDiv = document.createElement("div");
            medicoDiv.classList.add("medico-item");
            medicoDiv.innerHTML = `
                <p><strong>Nome:</strong> ${medico.nome}</p>
                <p><strong>CRM:</strong> ${medico.crm}</p>
                <p><strong>Especialidade:</strong> ${medico.especialidade}</p>
            `;
            
            equipeContainer.appendChild(medicoDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar equipe médica:", error);
    }
}

// Chama a função ao abrir a aba "Equipe Médica"
document.addEventListener("DOMContentLoaded", carregarEquipeMedica);



document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".expand-btn").forEach(button => {
        button.addEventListener("click", function() {
            // Alterna a classe "active" no botão para girar a seta
            this.classList.toggle("active");

            // Encontra o próximo elemento (o conteúdo que deve expandir)
            const content = this.nextElementSibling;

            // Alterna a exibição do conteúdo
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
});