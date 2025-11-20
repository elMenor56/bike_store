// obtenemos el ID del producto
const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

// cargar detalle del producto
async function cargarDetalle() {

    const res = await fetch("http://localhost:3000/api/productos/" + idProducto);
    const prod = await res.json();

    // corregimos ruta de imagen
    const imagenUrl = prod.imagen_producto.startsWith("/")
        ? "http://localhost:3000" + prod.imagen_producto
        : "http://localhost:3000/" + prod.imagen_producto;

    document.getElementById("detalle").innerHTML = `
        <img src="${imagenUrl}">
        <h3>${prod.nombre}</h3>
        <p>Bicicleta de ${prod.nombre_categoria}</p>
        <p>${prod.descripcion}</p>
        <p><strong>Precio:</strong> $${prod.precio}</p>
        <button onclick="agregarAlCarrito(${prod.id_producto})">Añadir al carrito</button>
    `;
}

function agregarAlCarrito(id) {
    alert("Carrito todavía en desarrollo 😎");
}

cargarDetalle();
