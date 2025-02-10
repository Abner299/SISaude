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