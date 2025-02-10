document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".expand-btn").forEach(button => {
        button.addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            content.classList.toggle("active");
        });
    });
});