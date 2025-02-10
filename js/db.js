let db;
const request = indexedDB.open("SISaudeDB", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;

    if (!db.objectStoreNames.contains("usuarios")) {
        let userStore = db.createObjectStore("usuarios", { keyPath: "id", autoIncrement: true });
        userStore.createIndex("username", "username", { unique: true });
    }

    if (!db.objectStoreNames.contains("pacientes")) {
        let pacienteStore = db.createObjectStore("pacientes", { keyPath: "cartao_sus" });
        pacienteStore.createIndex("nome", "nome", { unique: false });
    }

    if (!db.objectStoreNames.contains("atendimentos")) {
        let atendimentoStore = db.createObjectStore("atendimentos", { keyPath: "id", autoIncrement: true });
        atendimentoStore.createIndex("cartao_sus", "cartao_sus", { unique: false });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
};

request.onerror = (event) => {
    console.error("Erro ao abrir o banco de dados", event.target.errorCode);
};