const API = "http://localhost:3000/api/productos";

// ==============================
// Cargar detalle del producto
// ==============================
async function cargarDetalle() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(`${API}/${id}`);
    const prod = await res.json();

    const img = prod.imagen_base64
        ? `<img src="data:image/jpeg;base64,${prod.imagen_base64}" width="300">`
        : "<div style='width:300px; height:300px; background:#eee;'></div>";

    document.getElementById("detalle").innerHTML = `
        <div style="border:1px solid #ccc; padding:20px; border-radius:8px;">
            ${img}

            <h2>${prod.nombre}</h2>
            <p><b>Precio:</b> $${prod.precio}</p>
            <p><b>Categoría:</b> ${prod.nombre_categoria}</p>
            <p><b>Descripción:</b> ${prod.descripcion}</p>

            <button onclick="agregarCarrito(${prod.id_producto})">
                Añadir al carrito
            </button>
        </div>
    `;
}

// ==============================
// Añadir al carrito
// ==============================
function agregarCarrito(id_producto) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.push({
        id_producto,
        cantidad: 1
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto añadido al carrito");
}
