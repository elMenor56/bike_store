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

// =======================================================
// Función Global para Formatear Fechas
// =======================================================
function formatearFecha(fechaSQL) {
    const fecha = new Date(fechaSQL);
    return fecha.toLocaleString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
    }

    document.addEventListener("DOMContentLoaded", () => {

        const btnHamburguesa = document.getElementById("btnHamburguesa");
        const menuMobile = document.getElementById("menuMobile");

        // nota: si la página no tiene header, no hago nada
        if (!btnHamburguesa || !menuMobile) return;

        btnHamburguesa.addEventListener("click", () => {
            menuMobile.classList.toggle("hidden");
        });

    });
