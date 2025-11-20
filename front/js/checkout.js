// =====================================================
// ===============  FUNCIÓN PARA OBTENER CARRITO  ======
// =====================================================

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}



// =====================================================
// =============  MOSTRAR PRODUCTOS EN CHECKOUT  =======
// =====================================================

function mostrarProductos() {

    let carrito = obtenerCarrito();
    let div = document.getElementById("listaProductos");
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



// =====================================================
// ==============  FINALIZAR PEDIDO  ===================
// =====================================================

async function finalizarPedido() {

    const token = localStorage.getItem("token_cliente");

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

    window.location.href = "pedido_exitoso.html";
}
