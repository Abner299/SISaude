document.addEventListener("DOMContentLoaded", function () {
    showPage('home'); // Página inicial padrão

    // Evento de clique para itens do menu
    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Evento para abrir pop-up de cadastro de usuário
    document.getElementById("btn-add-user").addEventListener("click", function () {
        document.getElementById("popup-cadastro").style.display = "block";
    });

    // Evento para fechar pop-up
    document.getElementById("close-popup").addEventListener("click", function () {
        document.getElementById("popup-cadastro").style.display = "none";
    });

    // Evento para salvar usuário
    document.getElementById("btn-save-user").addEventListener("click", function () {
        const username = document.getElementById("user").value.trim();
        const password = document.getElementById("password").value.trim();
        const nome = document.getElementById("nome").value.trim();
        const especialidade = document.getElementById("especialidade").value.trim();

        if (username && password && nome && especialidade) {
            const crm = "20" + Math.floor(10 + Math.random() * 90); // CRM aleatório

            const novoUsuario = {
                username: username.toUpperCase(),
                password: password,
                nome: nome.toUpperCase(),
                especialidade: especialidade.toUpperCase(),
                crm: crm + " SISaúde"
            };

            console.log("Usuário cadastrado:", novoUsuario);
            alert("Usuário cadastrado com sucesso!");

            document.getElementById("popup-cadastro").style.display = "none";
        } else {
            alert("Preencha todos os campos!");
        }
    });
});

// Função para trocar páginas
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}