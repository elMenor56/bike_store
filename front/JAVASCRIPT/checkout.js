// =====================================================
// ===============  FUNCIÓN PARA OBTENER CARRITO  ======
// =====================================================

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

localStorage.removeItem("pedido_exitoso");

// =====================================================
// =============  MOSTRAR PRODUCTOS EN CHECKOUT  =======
// =====================================================

function mostrarProductos() {

    let carrito = obtenerCarrito();
    let div = document.getElementById("listaProductosExito");
    let totalGeneral = 0;

    div.innerHTML = "";

    carrito.forEach(item => {

        let totalProducto = item.precio * item.cantidad;
        totalGeneral += totalProducto;

        div.innerHTML += `
            <p>
                <strong>${item.nombre}</strong> x ${item.cantidad}  
                - $${totalProducto}
            </p>
        `;
    });

    document.getElementById("total").textContent =
        "TOTAL A PAGAR: $" + totalGeneral;
}

mostrarProductos();

// =====================================================
// ========== VALIDACIONES EN TIEMPO REAL ==============
// =====================================================

// ---- Funciones de estilo ----
function marcarError(input, msgElement, mensaje) {
    msgElement.textContent = mensaje;
    msgElement.classList.remove("hidden");
    input.classList.add("error");
    input.classList.remove("valido");
}

function marcarValido(input, msgElement) {
    msgElement.textContent = "";
    msgElement.classList.add("hidden");
    input.classList.remove("error");
    input.classList.add("valido");
}


// =====================================================
// VALIDAR NOMBRE
// =====================================================
document.getElementById("nombre").addEventListener("input", function () {
    const msg = document.getElementById("error-nombre");
    const valor = this.value.trim();

    if (valor.length < 3) {
        return marcarError(this, msg, "El nombre debe tener al menos 3 caracteres.");
    }

    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(valor)) {
        return marcarError(this, msg, "El nombre solo puede contener letras.");
    }

    marcarValido(this, msg);
});


// =====================================================
// VALIDAR CORREO
// =====================================================
document.getElementById("correo").addEventListener("input", function () {
    const msg = document.getElementById("error-correo");
    const valor = this.value.trim();

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dominio = valor.split("@")[1] || "";
    const dominiosValidos = [
        "gmail.com", "hotmail.com", "outlook.com",
        "yahoo.com", "email.com"
    ];

    if (!regexCorreo.test(valor)) {
        return marcarError(this, msg, "Correo electrónico no válido.");
    }

    if (!dominiosValidos.includes(dominio)) {
        return marcarError(this, msg, "Dominio no válido. Ej: gmail.com, hotmail.com");
    }

    marcarValido(this, msg);
});


// =====================================================
// VALIDAR TELÉFONO
// =====================================================
document.getElementById("telefono").addEventListener("input", function () {
    const msg = document.getElementById("error-telefono");
    const valor = this.value.trim();

    const regexTel = /^3\d{9}$/;

    if (!regexTel.test(valor)) {
        return marcarError(this, msg, "Debe ser un número colombiano (10 dígitos y empieza en 3).");
    }

    marcarValido(this, msg);
});


// =====================================================
// VALIDAR DIRECCIÓN
// =====================================================
document.getElementById("direccion").addEventListener("input", function () {
    const msg = document.getElementById("error-direccion");
    const valor = this.value.trim();

    const regexDireccion = /^(Calle|Carrera|Transversal|Avenida)\s\d+\s#\d+-\d+$/;

    if (valor.length < 5) {
        return marcarError(this, msg, "La dirección debe tener al menos 5 caracteres.");
    }

    if (!regexDireccion.test(valor)) {
        return marcarError(this, msg, "Formato inválido. Ej: Calle 14 #10-20");
    }

    marcarValido(this, msg);
});


// =====================================================
// VALIDAR TARJETA – MISMO FORMATO QUE LOS OTROS
// =====================================================

// Número de tarjeta (16 dígitos)
document.getElementById("tarjeta").addEventListener("input", function () {
    const msg = document.getElementById("error-tarjeta");
    const valor = this.value.trim();

    if (!/^\d{16}$/.test(valor)) {
        this.classList.add("error");
        this.classList.remove("valido");
        return marcarError(this, msg, "Número de tarjeta inválido. Debe tener 16 dígitos.");
    }

    marcarValido(this, msg);
});

// CVV
document.getElementById("cvv").addEventListener("input", function () {
    const msg = document.getElementById("error-cvv");
    const valor = this.value.trim();

    if (!/^\d{3}$/.test(valor)) {
        this.classList.add("error");
        this.classList.remove("valido");
        return marcarError(this, msg, "CVV inválido. Debe tener 3 dígitos.");
    }

    marcarValido(this, msg);
});

// Nombre en tarjeta
document.getElementById("nombreTarjeta").addEventListener("input", function () {
    const msg = document.getElementById("error-nombreTarjeta");
    const valor = this.value.trim();

    if (valor.length < 3) {
        this.classList.add("error");
        this.classList.remove("valido");
        return marcarError(this, msg, "El nombre debe tener al menos 3 caracteres.");
    }

    marcarValido(this, msg);
});

// Fecha de expiración
document.getElementById("exp").addEventListener("input", function () {
    const msg = document.getElementById("error-exp");
    const valor = this.value;
    const fechaActual = new Date();
    const fechaIngresada = new Date(valor + "-01");

    if (!valor || fechaIngresada <= fechaActual) {
        this.classList.add("error");
        this.classList.remove("valido");
        return marcarError(this, msg, "La fecha debe ser futura.");
    }

    marcarValido(this, msg);
});

// =====================================================
// ========== VALIDAR DATOS DEL CLIENTE (FUNCIÓN NUEVA)
// =====================================================

function validarDatosClienteCheckout() {

    const campos = [
        { id: "nombre", errorId: "error-nombre" },
        { id: "correo", errorId: "error-correo" },
        { id: "telefono", errorId: "error-telefono" },
        { id: "direccion", errorId: "error-direccion" }
    ];

    let valido = true;

    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const msg = document.getElementById(campo.errorId);

        if (input.value.trim() === "") {
            marcarError(input, msg, "Este campo es obligatorio.");
            valido = false;
        }

        if (input.classList.contains("error")) {
            valido = false;
        }
    });

    return valido;
}

// =====================================================
// ========== VALIDAR TARJETA COMPLETA =================
// =====================================================

function validarTarjeta() {
    const campos = [
        { id: "tarjeta", errorId: "error-tarjeta" },
        { id: "cvv", errorId: "error-cvv" },
        { id: "nombreTarjeta", errorId: "error-nombreTarjeta" },
        { id: "exp", errorId: "error-exp" }
    ];

    let valido = true;

    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const msg = document.getElementById(campo.errorId);

        // Campo vacío
        if (input.value.trim() === "") {
            marcarError(input, msg, "Este campo es obligatorio.");
            valido = false;
            return;
        }

        // Si ya tiene error por validación en tiempo real
        if (input.classList.contains("error")) {
            valido = false;
        }
    });

    return valido;
}

// =====================================================
// ==============  FINALIZAR PEDIDO  ===================
// =====================================================

async function finalizarPedido() {

    // Validar datos del cliente
    if (!validarDatosClienteCheckout()) {
        return; // no continuar si algo falla
    }

    const token = localStorage.getItem("tokenCliente");

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productos = carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad
    }));

    const total_pagar = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // =====================================================
    // VALIDAR TARJETA ANTES DE ENVIAR EL PEDIDO
    // =====================================================

    if (!validarTarjeta()) {
        return; // no se envía al backend si la tarjeta no es válida
    }

    // =====================================================
    // ENVIAR PETICIÓN AL BACKEND
    // =====================================================

    const res = await fetch("http://localhost:3000/api/pedidos", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            correo,
            telefono,
            direccion,
            total_pagar,
            productos
        })
    });

    const data = await res.json();

    if (!res.ok) {
        alert("Error: " + (data.mensaje || "No se pudo procesar el pedido"));
        return;
    }

    // ======================================================
    // GUARDAR INFORMACIÓN DEL PEDIDO PARA PEDIDO_EXITOSO 
    // ======================================================

    localStorage.setItem(
        "pedido_exitoso",
        JSON.stringify({
            id_pedido: data.id_pedido,
            total: total_pagar,
            fecha: new Date().toLocaleString(),
            nombre,
            correo,
            telefono,
            direccion,
            productos: carrito
        })
    );

    localStorage.removeItem("carrito");

    // Cerrar modal checkout
    cerrarCheckoutModal();

    // Mostrar modal pedido exitoso
    mostrarModalExitoso();
}

function cerrarCheckoutModal() {
    document.getElementById("overlay-checkout").classList.add("hidden");
    document.getElementById("modal-checkout").classList.add("hidden");
}


function mostrarModalExitoso() {
    document.getElementById("overlay-exitoso").classList.remove("hidden");
    document.getElementById("modal-exitoso").classList.remove("hidden");

    cargarPedido();
}

function cargarPedido() {

    const data = JSON.parse(localStorage.getItem("pedido_exitoso"));

    if (!data) {
        document.getElementById("infoPedido").innerHTML =
            "<p>No hay información del pedido.</p>";
        return;
    }

    // Mostrar datos del cliente
    document.getElementById("infoPedido").innerHTML = `
        <h2>Pedido realizado con éxito 🎉</h2>
        <div class="card">
            <p><strong>ID del pedido:</strong> ${data.id_pedido}</p>
            <p><strong>Fecha:</strong> ${data.fecha}</p>
            <p><strong>Total pagado:</strong> $${data.total}</p>
        </div>

        <h3>Datos del cliente</h3>
        <div class="card">
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Correo:</strong> ${data.correo}</p>
            <p><strong>Teléfono:</strong> ${data.telefono}</p>
            <p><strong>Dirección:</strong> ${data.direccion}</p>
        </div>
    `;
}

function cerrarCheckoutModal() {
    const overlay = document.getElementById("overlay-checkout");
    const modal = document.getElementById("modal-checkout");

    // Desvanecer ambos al mismo tiempo
    overlay.classList.remove("show");
    modal.classList.remove("show");

    // Esconder ambos al mismo tiempo cuando termina la animación
    setTimeout(() => {
        overlay.classList.add("hidden");
        modal.classList.add("hidden");
    }, 350); // Igual al transition del CSS
}


document.getElementById("overlay-checkout").addEventListener("click", function (e) {
    const modal = document.getElementById("modal-checkout");

    // Si hace clic directamente en el overlay (no dentro del modal)
    if (e.target === this) {
        cerrarCheckoutModal();
    }
});
