// =====================================================
// BUSCADOR 
// =====================================================

// Referencias
const inputBusqueda = document.getElementById("busqueda");
const divResultados = document.getElementById("resultados-busqueda");

let timer = null;

// Escuchar mientras el usuario escribe
inputBusqueda.addEventListener("input", () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        ejecutarBusqueda(inputBusqueda.value.trim());
    }, 250); // delay para evitar spam de requests
});


// =====================================================
// FUNCION PRINCIPAL DE BUSQUEDA
// =====================================================
async function ejecutarBusqueda(texto) {

    // Si está vacío, limpiamos resultados
    if (texto.length === 0) {
        divResultados.innerHTML = "";
        return;
    }

    // Llamada al backend
    const res = await fetch(`http://localhost:3000/api/productos?busqueda=${encodeURIComponent(texto)}`);
    const productos = await res.json();

    // Limpiar antes de renderizar
    divResultados.innerHTML = "";

    if (productos.length === 0) {
        divResultados.innerHTML = `<p style="padding:10px;">No se encontraron resultados</p>`;
        return;
    }

    // Renderizar productos tipo Google
    productos.forEach(prod => {

        const imagenUrl = prod.imagen_producto.startsWith("/")
            ? "http://localhost:3000" + prod.imagen_producto
            : "http://localhost:3000/" + prod.imagen_producto;

        const item = document.createElement("div");
        item.classList.add("resultado-item");

        item.innerHTML = `
            <img src="${imagenUrl}" alt="${prod.nombre}">
            <div>
                <p><strong>${prod.nombre}</strong></p>
                <p style="font-size:12px;color:#666;">${prod.nombre_categoria}</p>
            </div>
        `;

        // Cuando haga clic → abrir detalles
        item.addEventListener("click", () => {
            window.location.href = `/front/producto_detalle.html?id=${prod.id_producto}`;
        });

        divResultados.appendChild(item);
    });
}
