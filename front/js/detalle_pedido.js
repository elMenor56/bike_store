const token = localStorage.getItem("token_cliente");
const id = localStorage.getItem("pedido_detalle_id");

if (!token || !id) {
  alert("Error: no hay pedido seleccionado.");
  window.location.href = "mis_pedidos.html";
}

async function cargarDetalle() {
  const res = await fetch(`http://localhost:3000/api/pedidos/mis-pedidos`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  const pedido = data.pedidos.find(p => p.id_pedido == id);

  let html = `
    <p><b>ID Pedido:</b> ${pedido.id_pedido}</p>
    <p><b>Fecha:</b> ${pedido.fecha_pedido}</p>
    <p><b>Total:</b> $${pedido.total_pedido}</p>
    <p><b>Estado:</b> ${pedido.estado}</p>

    <h3>Productos:</h3>
  `;

  pedido.detalles.forEach(d => {
    html += `
      <div class="item">
        <p><b>${d.nombre_producto}</b></p>
        <p>Cantidad: ${d.cantidad}</p>
        <p>Precio: $${d.precio}</p>
      </div>
    `;
  });

  document.getElementById("info").innerHTML = html;
}

cargarDetalle();
