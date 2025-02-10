document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let transaction = db.transaction(["usuarios"], "readonly");
    let store = transaction.objectStore("usuarios");
    let index = store.index("username");

    let request = index.get(username);

    request.onsuccess = function (event) {
        let user = event.target.result;
        if (user && user.password === password) {
            localStorage.setItem("usuarioLogado", JSON.stringify(user));
            window.location.href = "home.html";
        } else {
            alert("Usuário ou senha inválidos!");
        }
    };
});