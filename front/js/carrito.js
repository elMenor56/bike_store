// =====================================================
// Obtener carrito desde LocalStorage
// =====================================================
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// =====================================================
// Guardar carrito
// =====================================================
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// =====================================================
// Mostrar carrito en pantalla
// =====================================================
function mostrarCarrito() {

    let carrito = obtenerCarrito();
    let div = document.getElementById("carrito");
    let totalGeneral = 0;

    div.innerHTML = "";

    if (carrito.length === 0) {
        div.innerHTML = "<h3>🛒 Tu carrito está vacío</h3>";
        document.getElementById("totalCarrito").textContent = "TOTAL A PAGAR: $0";
        return;
    }

    carrito.forEach(item => {

        // corrección clave imagen
        const rutaImagen = item.imagen || item.imagen_producto || "";

        const imagenUrl = rutaImagen.startsWith("/")
            ? "http://localhost:3000" + rutaImagen
            : "http://localhost:3000/" + rutaImagen;

        let totalProducto = item.precio * item.cantidad;
        totalGeneral += totalProducto;

        div.innerHTML += `
            <div class="item" style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
                <img src="${imagenUrl}" width="120">
                <h3>${item.nombre}</h3>

                <p>Precio: $${item.precio}</p>

                <div class="cantidad">
                    <button onclick="cambiarCantidad(${item.id_producto}, ${item.cantidad - 1})">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${item.id_producto}, ${item.cantidad + 1})">+</button>
                </div>

                <p><strong>Total:</strong> $${totalProducto}</p>

                <button onclick="eliminarDelCarrito(${item.id_producto})">Eliminar</button>
            </div>
        `;
    });

    document.getElementById("totalCarrito").textContent =
        "TOTAL A PAGAR: $" + totalGeneral;
}

// =====================================================
// Cambiar cantidad (+ / -)
// =====================================================
function cambiarCantidad(id_producto, nuevaCantidad) {

    let carrito = obtenerCarrito();

    carrito = carrito.map(item => {
        if (item.id_producto === id_producto) {
            item.cantidad = nuevaCantidad;
            if (item.cantidad <= 0) return null;
        }
        return item;
    }).filter(x => x !== null);

    guardarCarrito(carrito);
    mostrarCarrito();
}

// =====================================================
// Eliminar un producto
// =====================================================
function eliminarDelCarrito(id_producto) {
    let carrito = obtenerCarrito().filter(
        item => item.id_producto !== id_producto
    );

    guardarCarrito(carrito);
    mostrarCarrito();
}
