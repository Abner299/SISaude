document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".expand-btn").forEach(button => {
        button.addEventListener("click", function() {
            // Alterna a classe "active" no botão para girar a seta
            this.classList.toggle("active");

            // Encontra o próximo elemento (o conteúdo que deve expandir)
            const content = this.nextElementSibling;

            // Alterna a exibição do conteúdo
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
});