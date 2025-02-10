function showPage(pageId) {
    // Remove a classe "active" de todos os itens do menu
    document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.classList.remove('active');
    });

    // Adiciona a classe "active" no item do menu correspondente
    document.querySelector(`.sidebar ul li[onclick="showPage('${pageId}')"]`).classList.add('active');

    // Alterna entre as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}
// Atualizar data e hora
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

// Atualizar a cada segundo
setInterval(updateDateTime, 1000);
updateDateTime();
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });
});