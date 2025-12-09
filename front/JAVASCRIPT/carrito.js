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
    let totalUnidades = 0;

    div.innerHTML = "";

    if (carrito.length === 0) {

        let rutaProductos;
        
        const token = localStorage.getItem("tokenCliente");
        if (token) {
            rutaProductos = "/front/HTML/cliente_logueado/todos_los_productos_cliente.html";
        } else {
            rutaProductos = "/front/HTML/cliente_sin_login/todos_los_productos.html";
        }

        div.innerHTML =
        "<div class='carrito-vacio'>" +
            "<img class='carrito-vacio-img' src='/front/ASSETS/ICONS/shopping_cart.png' alt='Carrito vacío'>" +
            "<h3>Tu carrito está vacío</h3>" +
            `<a href='${rutaProductos}' class='btn-volver-productos'>Ver productos</a>` +
        "</div>";
        
        document.getElementById("totalCarrito").textContent = "TOTAL A PAGAR: $0";

        document.getElementById("contadorProductos").style.display = "none";

        actualizarBotonFinalizar(); // 🔥 se desactiva al estar vacío
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
        totalUnidades += item.cantidad;

        div.innerHTML += `
            <div class="item">
                <img src="${imagenUrl}">
                <div class="item-contenido">
                    <h3 class="item-nombre" >${item.nombre}</h3>

                    <p>Precio: ${formatearCOP(Number(item.precio))}</p>

                    <div class="cantidad">
                        <button class="btnRestar" onclick="cambiarCantidad(${item.id_producto}, ${item.cantidad - 1})">-</button>
                        <span class="cantidadActual">${item.cantidad}</span>
                        <button class="btnSumar" ${item.cantidad >= item.stock ? "disabled" : ""} onclick="cambiarCantidad(${item.id_producto}, ${item.cantidad + 1})">+</button>

                    </div>

                    <p><strong>Total:</strong> ${formatearCOP(Number(totalProducto))}</p>

                    <button class="btn-eliminar"onclick="eliminarDelCarrito(${item.id_producto})">Eliminar</button>
                </div>
            </div>
        `;
    });

    document.getElementById("contadorProductos").style.display = "block";

    document.getElementById("contadorProductos").textContent =
        "Productos en el carrito: " + totalUnidades;

    document.getElementById("totalCarrito").textContent =
        "TOTAL A PAGAR: " + formatearCOP(Number(totalGeneral));
}

// =====================================================
// Cambiar cantidad (+ / -)
// =====================================================
function cambiarCantidad(id_producto, nuevaCantidad) {

    let carrito = obtenerCarrito();

    carrito = carrito.map(item => {
        if (item.id_producto === id_producto) {

            // 🛑 No permitir pasar del stock disponible
            if (nuevaCantidad > item.stock) {
                nuevaCantidad = item.stock;
            }

            // 🛑 Si es menor o igual a 0, eliminarlo
            if (nuevaCantidad <= 0) return null;

            item.cantidad = nuevaCantidad;
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

// =====================================================
// HABILITAR / DESHABILITAR BOTÓN FINALIZAR COMPRA
// =====================================================
function actualizarBotonFinalizar() {
    const carrito = obtenerCarrito();
    const btnFinalizar = document.querySelector(".btn-finalizar-pedido");

    if (!btnFinalizar) return; // seguridad

    if (carrito.length === 0) {
        btnFinalizar.disabled = true;
        btnFinalizar.classList.add("disabled-btn");
    } else {
        btnFinalizar.disabled = false;
        btnFinalizar.classList.remove("disabled-btn");
    }
}

// =====================================================
// FINALIZAR COMPRA
// =====================================================
function finalizarPedido() {
    const carrito = obtenerCarrito();

    // 🛑 1. Si el carrito está vacío, no debe permitir continuar
    if (carrito.length === 0) {
        alert("Tu carrito está vacío ❌");
        return;
    }

    // 🛑 2. Verificar si el usuario ha iniciado sesión
    const token = localStorage.getItem("tokenCliente");

    if (!token) {
        mostrarPopupLogin();
        return;
    }

    // ✅ 3. Si hay sesión → enviar a checkout
    abrirCheckout();
}

function abrirCheckout() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        mostrarPopupLogin();
        return;
    }

    const token = localStorage.getItem("tokenCliente");
    if (!token) {
        mostrarPopupLogin();
        return;
    }

    const overlay = document.getElementById("overlay-checkout");
    const modal = document.getElementById("modal-checkout");

    // 👇 LO QUE TE FALTABA
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");

    // 👇 Activamos animación
    setTimeout(() => {
        overlay.classList.add("show");
        modal.classList.add("show");
    }, 10);
}

function mostrarPopupLogin() {
    const popup = document.getElementById("popup-login");
    popup.classList.remove("hidden");

    event.stopPropagation(); // evita cierre inmediato

    setTimeout(() => {
        popup.classList.add("show");
    }, 10);
}

function cerrarPopupLogin() {
    const popup = document.getElementById("popup-login");

    // Restaurar el botón del popup
    const btn = document.getElementById("btnLoginPopup");
    if (btn) btn.style.display = "block";

    popup.classList.remove("show");
    setTimeout(() => {
        popup.classList.add("hidden");
    }, 300);
}

const btnCerrarPopup = document.getElementById("btnCerrarPopup");
if (btnCerrarPopup) {
    btnCerrarPopup.addEventListener("click", cerrarPopupLogin);
}

// ===============================
// Cerrar popup al hacer clic fuera
// ===============================
document.addEventListener("click", function (e) {
    const popup = document.getElementById("popup-login");
    if (!popup) return;

    const popupBox = document.querySelector("#popup-login .popup-box");

    // Si el popup está oculto → no hacer nada
    if (popup.classList.contains("hidden")) return;

    // Si se hace clic FUERA de .popup-box → cerrar popup
    if (!popupBox.contains(e.target)) {
        cerrarPopupLogin();
    }
});