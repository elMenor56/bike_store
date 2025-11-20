// leemos token
const token = localStorage.getItem("token_admin");

// leemos el id del pedido guardado
const id = localStorage.getItem("pedido_id");

async function cargarPedido() {
    const res = await fetch(`http://localhost:3000/api/admin/pedidos/${id}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    const div = document.getElementById("infoPedido");

    let html = `
        <div class="card">
          <p><b>ID:</b> ${data.pedido.id_pedido}</p>
          <p><b>Cliente:</b> ${data.pedido.nombre_cliente}</p>
          <p><b>Fecha:</b> ${data.pedido.fecha_pedido}</p>
          <p><b>Total:</b> $${data.pedido.total_pedido}</p>

          <p><b>Estado Actual:</b> ${data.pedido.estado}</p>

          <label>Nuevo Estado:</label>
          <select id="estadoNuevo">
            <option>Pendiente</option>
            <option>Pagado</option>
            <option>Enviado</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>

          <button onclick="actualizarEstado()">Guardar</button>

          <h3>Productos:</h3>
    `;

    data.detalles.forEach(d => {
        html += `
        <div class="item">
          <b>${d.nombre}</b><br>
          Cantidad: ${d.cantidad}<br>
          Precio: $${d.precio}
        </div>`;
    });

    html += "</div>";

    div.innerHTML = html;
}

cargarPedido();

async function actualizarEstado() {
    const estado = document.getElementById("estadoNuevo").value;

    await fetch(`http://localhost:3000/api/admin/pedidos/${id}/estado`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado })
    });

    alert("Estado actualizado");
    cargarPedido();
}
