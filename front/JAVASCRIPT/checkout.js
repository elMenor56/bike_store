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
// ============== VALIDAR TARJETA (SIMULADO) ===========
// =====================================================

function validarTarjeta() {

    const numero = document.getElementById("tarjeta").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    const nombreTarjeta = document.getElementById("nombreTarjeta")?.value || "";
    const exp = document.getElementById("exp")?.value || "";

    // Validar número de tarjeta
    if (numero.length !== 16 || isNaN(numero)) {
        alert("El número de tarjeta es inválido. Debe tener 16 dígitos numéricos.");
        return false;
    }

    // Validar CVV
    if (cvv.length !== 3 || isNaN(cvv)) {
        alert("El CVV debe tener 3 dígitos numéricos.");
        return false;
    }

    // Validar nombre en la tarjeta
    if (nombreTarjeta && nombreTarjeta.trim().length < 3) {
        alert("Ingrese un nombre válido tal como aparece en la tarjeta.");
        return false;
    }

    // Validar expiración
    if (exp) {
        const fechaActual = new Date();
        const fechaIngresada = new Date(exp + "-01");

        if (fechaIngresada < fechaActual) {
            alert("La tarjeta está expirada.");
            return false;
        }
    }

    return true; // todo OK
}

function validarDatosClienteCheckout() {

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    // ======== VALIDAR NOMBRE ========
    if (nombre.length < 3 || !/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(nombre)) {
        alert("Ingresa un nombre válido (solo letras, mínimo 3 caracteres).");
        return false;
    }

    // ======== VALIDAR CORREO ========
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {
        alert("Ingresa un correo electrónico válido.");
        return false;
    }

    // Validar que tenga dominio conocido (ejemplo simple)
    const dominiosValidos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "email.com"];
    const dominioCorreo = correo.split("@")[1];

    if (!dominiosValidos.includes(dominioCorreo)) {
        alert("El correo debe tener un dominio válido como @gmail.com o @hotmail.com");
        return false;
    }

    // ======== VALIDAR TELÉFONO COLOMBIANO ========
    const regexTelefonoColombia = /^3\d{9}$/;

    if (!regexTelefonoColombia.test(telefono)) {
        alert("Ingresa un teléfono colombiano válido (10 dígitos y empieza con 3).");
        return false;
    }

    // ======== VALIDAR DIRECCIÓN ========
    if (direccion.length < 5) {
        alert("Ingresa una dirección válida (mínimo 5 caracteres).");
        return false;
    }

    return true;
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