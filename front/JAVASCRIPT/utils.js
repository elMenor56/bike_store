// =======================================================
// Función Global para Formatear Precios en COP
// =======================================================
function formatearCOP(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    }).format(valor);
}

// =======================================================
// Función Global para Mostrar Avisos Emergentes
// =======================================================

function mostrarAviso(mensaje) {
    const aviso = document.createElement("div");
    aviso.className = "aviso-emergente";
    aviso.textContent = mensaje;

    document.body.appendChild(aviso);

    // animación de desvanecimiento
    setTimeout(() => {
        aviso.classList.add("desvanecer");
    }, 1000);

    // quitar el aviso
    setTimeout(() => {
        aviso.remove();
    }, 2000);
}