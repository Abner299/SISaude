document.getElementById("btnAdicionar").addEventListener("click", function () {
    document.getElementById("formPaciente").style.display = "block";
});

document.getElementById("formPaciente").addEventListener("submit", function (e) {
    e.preventDefault();

    let paciente = {
        nome: document.getElementById("nomePaciente").value,
        cartao_sus: document.getElementById("cartaoSus").value,
        classificacao: document.getElementById("classificacao").value,
        status: "Deu Entrada"
    };

    let transaction = db.transaction(["pacientes"], "readwrite");
    let store = transaction.objectStore("pacientes");
    store.add(paciente);

    transaction.oncomplete = () => {
        alert("Paciente registrado!");
        location.reload();
    };
});