// ===============================================
// 1. Obtener ID del producto desde la URL
// ===============================================
const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");


// ===============================================
// 2. Cargar detalles del producto desde backend
// ===============================================
async function cargarDetalle() {

    const res = await fetch("http://localhost:3000/api/productos/" + idProducto);
    const prod = await res.json();

    // corregir url de imagen
    const imagenUrl = prod.imagen_producto.startsWith("/")
        ? "http://localhost:3000" + prod.imagen_producto
        : "http://localhost:3000/" + prod.imagen_producto;

    document.getElementById("detalle").innerHTML = `
        <img src="${imagenUrl}" class="img-detalle">
        <h3>${prod.nombre}</h3>
        <p>Bicicleta de <strong>${prod.nombre_categoria}</strong></p>
        <p>${prod.descripcion}</p>
        <p><strong>Precio:</strong> $${prod.precio}</p>

        <button id="btnAdd">Añadir al carrito</button>
    `;

    // Conectar botón al carrito (usando función global)
    document.getElementById("btnAdd").onclick = () => agregarAlCarrito(prod);
}

// Ejecutar carga inicial
cargarDetalle();
