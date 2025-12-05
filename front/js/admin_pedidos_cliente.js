// =============================================
// OBTENER TOKEN DEL ADMIN
// =============================================
const token = localStorage.getItem("tokenAdmin");

// si no hay token → redirigir
if (!token) {
  alert("Debes iniciar sesión");
  window.location.href = "inicio.html";
}

// obtenemos ID del cliente desde localStorage
const id_cliente = localStorage.getItem("cliente_pedidos_id");

// si no existe id → error
if (!id_cliente) {
  alert("No se seleccionó cliente");
  window.location.href = "admin_clientes.html";
}

// =============================================
// FUNCIÓN PARA CARGAR LOS PEDIDOS DEL CLIENTE
// =============================================
async function cargarPedidos() {
  try {
    // petición GET al backend
    const res = await fetch(`http://localhost:3000/api/admin/clientes/${id_cliente}/pedidos`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    const cont = document.getElementById("listaPedidos");
    cont.innerHTML = "";

    // recorrer pedidos uno por uno
    data.forEach(p => {
      let html = `
        <div class="pedido">
          <p><b>ID Pedido:</b> ${p.id_pedido}</p>
          <p><b>Fecha:</b> ${p.fecha_pedido}</p>
          <p><b>Total:</b> $${p.total_pedido}</p>
          <p><b>Estado:</b> ${p.estado}</p>

          <h4>Productos:</h4>
      `;

      // recorrer productos dentro del pedido
      p.detalles.forEach(d => {
        html += `
          <div class="item">
            <b>${d.nombre_producto}</b><br>
            Cantidad: ${d.cantidad}<br>
            Precio: $${d.precio}
          </div>
        `;
      });

      html += "</div>";

      // insertar en el contenedor
      cont.innerHTML += html;
    });

  } catch (error) {
    console.log("Error cargando pedidos:", error);
  }
}

cargarPedidos();
