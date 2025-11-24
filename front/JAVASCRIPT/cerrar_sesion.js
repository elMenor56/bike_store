// ============================
// CERRAR SESIÓN
// ============================
const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", () => {
    // Eliminar datos de sesión
    localStorage.removeItem("tokenCliente");
    localStorage.removeItem("cliente");

    // Redirigir al inicio público
    window.location.href = "/front/HTML/inicio.html";
});

const token = localStorage.getItem("tokenCliente");
    if (!token) {
        alert("Debes iniciar sesión");
        window.location.href = "/front/HTML/inicio.html";
    }