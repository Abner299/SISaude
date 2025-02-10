import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Inicializa Firebase evitando duplicações
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Abrir pop-up de Dar Entrada
window.abrirDarEntrada = function () {
    document.getElementById("darEntradaPopup").style.display = "flex";
    document.getElementById("entradaDataHora").value = new Date().toLocaleString("pt-BR");

    // Preencher automaticamente o nome do médico
    const nomeMedico = document.querySelector(".user-info p strong").nextSibling.nodeValue.trim();
    document.getElementById("entradaMedico").value = nomeMedico;
};

// Fechar pop-ups
window.fecharDarEntrada = () => document.getElementById("darEntradaPopup").style.display = "none";
window.fecharBuscaRec = () => document.getElementById("buscaRec").style.display = "none";

// Abrir pop-up de busca
window.abrirBuscaRec = function () {
    document.getElementById("buscaRec").style.display = "flex";
    document.getElementById("buscaRecInput").value = "";
    document.getElementById("buscaRecResultados").innerHTML = "";
};

// Buscar pacientes no Firestore
window.buscarPacientes = async function () {
    const termo = document.getElementById("buscaRecInput").value.trim().toUpperCase();
    const resultadosContainer = document.getElementById("buscaRecResultados");
    resultadosContainer.innerHTML = "";

    if (!termo) return;

    try {
        const consultas = [
            query(collection(db, "PACIENTES"), where("nome", ">=", termo), where("nome", "<=", termo + "\uf8ff"))
        ];

        const numero = parseInt(termo);
        if (!isNaN(numero)) {
            consultas.push(query(collection(db, "PACIENTES"), where("cartao_n", "==", numero)));
        }

        const resultados = new Map();
        for (const q of consultas) {
            const snap = await getDocs(q);
            snap.forEach((doc) => resultados.set(doc.id, doc.data()));
        }

        if (resultados.size === 0) {
            resultadosContainer.innerHTML = "<p>Nenhum paciente encontrado.</p>";
            return;
        }

        resultados.forEach((paciente) => {
            const div = document.createElement("div");
            div.classList.add("buscaRec-item");
            div.innerHTML = `
                <p><strong>${paciente.nome}</strong> - Cartão: ${paciente.cartao_n} - Idade: ${paciente.idade}</p>
                <button onclick="selecionarPaciente('${paciente.nome}', '${paciente.cartao_n}')">✔</button>
            `;
            resultadosContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        resultadosContainer.innerHTML = "<p>Erro na busca.</p>";
    }
};

// Preencher dados no pop-up de Dar Entrada e bloquear os campos
window.selecionarPaciente = function (nome, cartao) {
    document.getElementById("entradaNome").value = nome;
    document.getElementById("entradaCartao").value = cartao;

    document.getElementById("entradaNome").setAttribute("readonly", true);
    document.getElementById("entradaCartao").setAttribute("readonly", true);

    fecharBuscaRec();
};

// Registrar entrada do paciente no Firestore
window.confirmarEntrada = async function () {
    const nome = document.getElementById("entradaNome").value.trim();
    const cartao = document.getElementById("entradaCartao").value.trim();
    const queixa = document.getElementById("entradaQueixa").value.trim();
    const temperatura = document.getElementById("entradaTemp").value.trim();
    const pressao = document.getElementById("entradaPressao").value.trim();
    const dataHora = document.getElementById("entradaDataHora").value;
    const medico = document.getElementById("entradaMedico").value.trim();

    const classificacao = document.querySelector("input[name='entradaClassificacao']:checked");
    const risco = classificacao ? classificacao.value : "";

    if (!nome || !cartao || !dataHora || !medico || !risco) {
        alert("Preencha todos os campos obrigatórios antes de confirmar.");
        return;
    }

    try {
        await addDoc(collection(db, "ENTRADAS"), {
            nome,
            cartao_n: cartao,
            queixa,
            temperatura,
            pressao,
            classificacao_risco: risco,
            data_hora: dataHora,
            medico_responsavel: medico
        });

        alert("Entrada registrada com sucesso!");
        fecharDarEntrada();
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        alert("Erro ao registrar entrada.");
    }
};

// Atualizar tabela de entradas automaticamente
function atualizarTabelaEntradas() {
    const tabela = document.getElementById("tabelaPacientes");
    const tbody = tabela.querySelector("tbody");
    tbody.innerHTML = ""; // Limpar a tabela

    const q = query(collection(db, "ENTRADAS"), orderBy("data_hora", "desc"));

    onSnapshot(q, (snapshot) => {
        tbody.innerHTML = ""; // Evita duplicação

        snapshot.forEach((doc) => {
            const entrada = doc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${entrada.nome}</td>
                <td>${entrada.data_hora}</td>
                <td>${entrada.classificacao_risco || "N/A"}</td>
            `;

            tbody.appendChild(row);
        });
    });
}

// Iniciar atualização automática da tabela
atualizarTabelaEntradas();

// Fechar pop-ups ao clicar fora
window.onclick = function (event) {
    const modais = {
        darEntradaPopup: fecharDarEntrada,
        buscaRec: fecharBuscaRec
    };

    for (const [id, fechar] of Object.entries(modais)) {
        const modal = document.getElementById(id);
        if (event.target === modal) fechar();
    }
};