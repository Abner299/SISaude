document.addEventListener("DOMContentLoaded", function () {
    // Define a primeira página ativa
    showPage('home');

    // Adiciona evento de clique nos itens do menu
    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function () {
            // Remove a classe 'active' de todos os itens do menu
            document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
            
            // Adiciona a classe 'active' ao item clicado
            this.classList.add("active");
        });
    });
});

// Função para exibir a página correspondente
function showPage(pageId) {
    // Esconde todas as seções
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    // Exibe a página selecionada
    document.getElementById(pageId).style.display = "block";

    // Marca o menu correspondente como ativo
    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.classList.remove("active");
    });

    let menuItem = [...document.querySelectorAll(".sidebar ul li")].find(li => 
        li.getAttribute("onclick") === `showPage('${pageId}')`
    );

    if (menuItem) {
        menuItem.classList.add("active");
    }
}