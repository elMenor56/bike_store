// ============================
// CERRAR SESIÓN (GENÉRICO)
// ============================
const btnLogout = document.getElementById("btnLogout");

btnLogout?.addEventListener("click", () => {

    // Borrar ambos tokens por si existen
    localStorage.removeItem("tokenCliente");
    localStorage.removeItem("cliente");
    localStorage.removeItem("tokenAdmin");
    localStorage.removeItem("admin");

    // Detectar si estamos en el panel admin
    const esAdmin = window.location.pathname.includes("admin");

    // Redirigir según el tipo
    if (esAdmin) {
        window.location.href = "/front/HTML/admin/login_admin.html";
    } else {
        window.location.href = "/front/HTML/cliente_sin_login/inicio.html";
    }
});
