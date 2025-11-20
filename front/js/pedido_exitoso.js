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

        <h3>Productos Comprados</h3>
        <div id="listaProductos"></div>
    `;

    // Mostrar productos
    let htmlProductos = "";

    data.productos.forEach(p => {
        htmlProductos += `
            <p>
                <strong>${p.nombre}</strong>  
                x ${p.cantidad} — $${p.precio * p.cantidad}
            </p>
        `;
    });

    document.getElementById("listaProductos").innerHTML = htmlProductos;
}

cargarPedido();
