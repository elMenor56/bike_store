// ============================
// ELEMENTOS
// ============================
const abrirCarrito = document.querySelector(".icono-carrito");
const overlayCarrito = document.getElementById("overlay-carrito");
const menuCarrito = document.getElementById("menu-carrito");
const cerrarCarrito = document.getElementById("cerrarCarrito");

const carritoLista = document.getElementById("carritoLista");
const subtotalCarrito = document.getElementById("subtotalCarrito");
const btnVerCarrito = document.getElementById("btnVerCarrito");

// ============================
// ABRIR MENU CARRITO
// ============================
abrirCarrito.addEventListener("click", () => {
    actualizarMenuCarrito();
    menuCarrito.classList.remove("hidden");
    overlayCarrito.classList.remove("hidden");
});

// ============================
// CERRAR MENU
// ============================
function cerrarMenuCarrito() {
    menuCarrito.classList.add("hidden");
    overlayCarrito.classList.add("hidden");
}

cerrarCarrito.addEventListener("click", cerrarMenuCarrito);
overlayCarrito.addEventListener("click", cerrarMenuCarrito);

// ============================
// ACTUALIZAR MENU
// ============================
function actualizarMenuCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carritoLista.innerHTML = "";

    if (carrito.length === 0) {
        carritoLista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío</p>`;
        subtotalCarrito.textContent = "$0";
        return;
    }

    let subtotal = 0;

    carrito.forEach(prod => {
        subtotal += prod.precio * prod.cantidad;

        const itemHTML = `
            <div class="carrito-item">
                <img src="http://localhost:3000${prod.imagen}" alt="${prod.nombre}">
                
                <div class="info">
                    <p class="nombre">${prod.nombre}</p>
                    <p class="precio">${formatearCOP(Number(prod.precio))}</p>

                    <div class="cantidad">
                        <button onclick="cambiarCantidad(${prod.id_producto}, -1)">-</button>
                        <span>${prod.cantidad}</span>
                        <button onclick="cambiarCantidad(${prod.id_producto}, 1)">+</button>
                    </div>

                    <i class="fa-solid fa-trash eliminar" onclick="eliminarProducto(${prod.id_producto})"></i>
                </div>
            </div>
        `;

        carritoLista.innerHTML += itemHTML;
    });

    subtotalCarrito.textContent = formatearCOP(Number(subtotal));
}

// ============================
// CAMBIAR CANTIDAD (sumar/restar)
// ============================
window.cambiarCantidad = function(id, valor) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let producto = carrito.find(p => p.id_producto === id);

    if (!producto) return;

    producto.cantidad += valor;

    if (producto.cantidad <= 0) {
        carrito = carrito.filter(p => p.id_producto !== id);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarMenuCarrito();
};

// ============================
// ELIMINAR PRODUCTO
// ============================
window.eliminarProducto = function(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(p => p.id_producto !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarMenuCarrito();
};

// ============================
// IR AL CARRITO COMPLETO
// ============================
btnVerCarrito.addEventListener("click", () => {
    window.location.href = "/front/carrito.html";
});
