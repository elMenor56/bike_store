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
