// ==========================================
// FUNCIÓN PARA CARGAR PEDIDOS
// ==========================================
async function cargarPedidos() {
    try {
        // hacemos petición GET
        const res = await fetch("http://localhost:3000/api/admin/pedidos", {
            headers: { "Authorization": "Bearer " + token }
        });

        const pedidos = await res.json();

        const tbody = document.getElementById("tablaPedidos");

        pedidos.forEach(p => {
            const tr = document.createElement("tr");
            tr.id = "pedido-" + p.id_pedido; //ID único

            tr.innerHTML = `
                <td>${p.id_pedido}</td>
                <td>${p.nombre_cliente}</td>
                <td>${formatearFecha(p.fecha_pedido)}</td>
                <td>${formatearCOP(Number(p.total_pedido))}</td>
                <td class="estado-pedido">${p.estado}</td>
                <td>
                    <button class="btn-detalles" onclick="verPedido(${p.id_pedido})">Ver</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.log("Error:", error);
    }
}

cargarPedidos();

function verPedido(id) {
    cargarPedidoModal(id);
    document.getElementById("modalPedidoContenido").style.display = "flex";
}

function cerrarModalPedido() {
    document.getElementById("modalPedidoContenido").style.display = "none";
}

async function cargarPedidoModal(id) {

    const res = await fetch(`http://localhost:3000/api/admin/pedidos/${id}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    const div = document.getElementById("modalPedidoContenido");

    let html = `
            <div class="modal-content">
                <button class="modal-close" onclick="cerrarModalPedido()">✖</button>

                <div class="card">
                    <p><b>ID:</b> ${data.pedido.id_pedido}</p>
                    <p><b>Cliente:</b> ${data.pedido.nombre_cliente}</p>
                    <p><b>Fecha:</b> ${formatearFecha(data.pedido.fecha_pedido)}</p>
                    <p><b>Total:</b> ${formatearCOP(Number(data.pedido.total_pedido))}</p>

                    <p><b>Estado Actual:</b> ${data.pedido.estado}</p>

                    <label>Nuevo Estado:</label>
                    <select id="estadoNuevoModal">
                        <option>Pendiente</option>
                        <option>Pagado</option>
                        <option>Enviado</option>
                        <option>Entregado</option>
                        <option>Cancelado</option>
                    </select>

                    <button onclick="actualizarEstadoModal(${id})">Guardar</button>

                    <h3>Productos:</h3>
        `;

        // Aquí agregas los productos **dentro del mismo card**
        data.detalles.forEach(d => {
            html += `
                <div class="item" style="margin-bottom: 10px;">
                    <b>${d.nombre}</b><br>
                    Cantidad: ${d.cantidad}<br>
                    Precio: ${formatearCOP(Number(d.precio))}
                </div>
            `;
        });

        // Cierres finales
        html += `
                </div>
            </div>
        `;

        div.innerHTML = html;
}

function actualizarEstadoModal(id) {

    // obtener el nuevo estado del select
    const nuevoEstado = document.getElementById("estadoNuevoModal").value;

    fetch(`http://localhost:3000/api/admin/pedidos/${id}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(res => res.json())
    .then(data => {

        if (data.error) {
            alert("Error: " + data.error);
            return;
        }

        alert("Estado actualizado correctamente");

        // cerrar modal
        cerrarModalPedido();

        // actualizar visualmente la tabla SIN recargar
        const fila = document.getElementById("pedido-" + id);
        if (fila) {
            const celdaEstado = fila.querySelector(".estado-pedido");
            celdaEstado.textContent = nuevoEstado;
        }
    })
    .catch(err => {
        console.error("Error actualizando estado:", err);
    });
}

