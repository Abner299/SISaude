// Alterna entre as páginas
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Abrir e fechar formulário na recepção
function abrirFormulario() {
    document.getElementById("formulario-recepcao").style.display = "flex";
}

function fecharFormulario() {
    document.getElementById("formulario-recepcao").style.display = "none";
}