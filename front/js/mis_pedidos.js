const API = "http://localhost:3000/api/pedidos/mis-pedidos";
const token = localStorage.getItem("token_cliente");

if (!token) {
  alert("Debes iniciar sesión");
  window.location.href = "cliente_login.html";
}

async function cargarPedidos() {
  const res = await fetch(API, {
    headers: { "Authorization": "Bearer " + token }
  });

  const data = await res.json();

  const cont = document.getElementById("lista");
  cont.innerHTML = "";

  if (data.pedidos.length === 0) {
    cont.innerHTML = "<p>No tienes pedidos.</p>";
    return;
  }

  data.pedidos.forEach(p => {
    cont.innerHTML += `
      <div class="pedido">
        <p><b>ID Pedido:</b> ${p.id_pedido}</p>
        <p><b>Fecha:</b> ${p.fecha_pedido}</p>
        <p><b>Total:</b> $${p.total_pedido}</p>
        <p><b>Estado:</b> ${p.estado}</p>

        <button onclick="verDetalle(${p.id_pedido})">Ver Detalles</button>
      </div>
    `;
  });
}

function verDetalle(id) {
  localStorage.setItem("pedido_detalle_id", id);
  window.location.href = "detalle_pedido.html";
}

cargarPedidos();
