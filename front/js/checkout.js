// =====================================================
// ===============  FUNCIÓN PARA OBTENER CARRITO  ======
// =====================================================

// Esta función busca en el localStorage un item llamado "carrito"
// Si existe lo convierte de texto a objeto con JSON.parse
// Si no existe devuelve un arreglo vacío
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}



// =====================================================
// =============  MOSTRAR PRODUCTOS EN CHECKOUT  =======
// =====================================================

// Esta función dibuja en pantalla los productos del carrito
// y también calcula el total del pedido
function mostrarProductos() {

    let carrito = obtenerCarrito();       // aquí obtenemos el carrito desde localStorage
    let div = document.getElementById("listaProductos"); // este es el contenedor donde se muestran
    let totalGeneral = 0;                 // aquí guardamos el total de todo el pedido

    div.innerHTML = "";                   // limpiamos el div para no duplicar productos

    // Recorremos cada producto del carrito
    carrito.forEach(item => {

        let totalProducto = item.precio * item.cantidad;  // total por cada producto
        totalGeneral += totalProducto;                     // lo sumamos al total general

        // Aquí agregamos al HTML el nombre, cantidad y total del producto
        div.innerHTML += `
            <p>
                <strong>${item.nombre}</strong> x ${item.cantidad}  
                - $${totalProducto}
            </p>
        `;
    });

    // Aquí mostramos el total final en un elemento que tiene el id "total"
    document.getElementById("total").textContent =
        "TOTAL A PAGAR: $" + totalGeneral;
}

// Llamamos la función para que se ejecute apenas abra el checkout
mostrarProductos();



// =====================================================
// ==============  FINALIZAR PEDIDO  ===================
// =====================================================

// Esta función se ejecuta cuando el usuario hace clic en "Finalizar pedido"
async function finalizarPedido() {

    const token = localStorage.getItem("token_cliente"); // aquí obtenemos el token del cliente para autorizar el pedido

    // ==============================
    // DATOS del FORMULARIO Checkout
    // ==============================

    const nombre = document.getElementById("nombre").value;       // nombre del usuario
    const correo = document.getElementById("correo").value;       // correo del usuario
    const telefono = document.getElementById("telefono").value;   // teléfono del usuario
    const direccion = document.getElementById("direccion").value; // dirección del usuario

    // ==============================
    // CARRITO de productos
    // ==============================

    const carrito = JSON.parse(localStorage.getItem("carrito")) || []; // obtenemos el carrito

    // Convertimos el carrito al formato que necesita el backend
    // Solo enviamos id y cantidad
    const productos = carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad
    }));

    // Calculamos el total sumando (precio * cantidad)
    const total_pagar = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // ======================================
    // ENVIAR PETICIÓN AL BACKEND (API)
    // ======================================

    const res = await fetch("http://localhost:3000/api/pedidos", {
        method: "POST",                           // método POST para crear pedido
        headers: {
            "Authorization": "Bearer " + token,   // enviamos el token para verificar usuario
            "Content-Type": "application/json"    // indicamos que enviamos JSON
        },
        body: JSON.stringify({                    // construimos el cuerpo en JSON
            nombre,
            correo,
            telefono,
            direccion,
            total_pagar,
            productos
        })
    });

    const data = await res.json();                // aquí convertimos la respuesta a JSON

    // Si hubo un error en la petición, avisamos
    if (!res.ok) {
        alert("Error: " + (data.mensaje || "No se pudo procesar el pedido"));
        return;
    }

    // ======================================================
    // GUARDAR INFORMACIÓN DEL PEDIDO PARA PEDIDO_EXITOSO 
    // ======================================================

    // Aquí almacenamos los datos del pedido en el localStorage
    // para mostrarlos en la página "pedido_exitoso.html"
    localStorage.setItem(
        "pedido_exitoso",
        JSON.stringify({
            id_pedido: data.id_pedido,              // ID que devuelve el backend
            total: total_pagar,                     // total calculado
            fecha: new Date().toLocaleString(),     // fecha en formato bonito
            nombre,                                 // nombre del cliente
            correo,                                 // correo del cliente
            telefono,                               // teléfono del cliente
            direccion,                              // dirección del cliente
            productos: carrito                      // enviamos también los productos comprados
        })
    );

    // Limpiamos el carrito
    localStorage.removeItem("carrito");

    // Redirigimos a la página de éxito
    window.location.href = "pedido_exitoso.html";
}
