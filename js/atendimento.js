document.addEventListener("DOMContentLoaded", () => {
    let transaction = db.transaction(["pacientes"], "readonly");
    let store = transaction.objectStore("pacientes");
    let request = store.getAll();

    request.onsuccess = function () {
        let lista = document.getElementById("listaAtendimento");
        request.result.forEach(paciente => {
            let item = document.createElement("li");
            item.textContent = `${paciente.nome} - ${paciente.classificacao.toUpperCase()}`;
            let btnFinalizar = document.createElement("button");
            btnFinalizar.textContent = "Finalizar";
            btnFinalizar.onclick = () => {
                paciente.status = "Atendido";
                let tx = db.transaction(["pacientes"], "readwrite");
                let st = tx.objectStore("pacientes");
                st.put(paciente);
                location.reload();
            };
            item.appendChild(btnFinalizar);
            lista.appendChild(item);
        });
    };
});