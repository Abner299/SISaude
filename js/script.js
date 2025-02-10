document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    // Mostrar/esconder menu no celular
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });

    // Atualizar data e hora automaticamente
    function updateDateTime() {
        const dateTimeElement = document.getElementById("date-time");
        const now = new Date();
        
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        };

        dateTimeElement.innerText = `Hoje é: ${now.toLocaleDateString("pt-BR", options)}`;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Alternar entre as páginas ao clicar no menu
    function showPage(pageId) {
        // Remove "active" de todos os itens do menu
        document.querySelectorAll('.sidebar ul li').forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona "active" no item do menu correspondente
        document.querySelector(`.sidebar ul li[data-page="${pageId}"]`).classList.add('active');

        // Alterna entre as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    // Adicionar evento de clique nos itens do menu
    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function () {
            const pageId = this.getAttribute("data-page");
            if (pageId) {
                showPage(pageId);
            }
            // No mobile, esconde o menu depois de clicar
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("show");
            }
        });
    });
});