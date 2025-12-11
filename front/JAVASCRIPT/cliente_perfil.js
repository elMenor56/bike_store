const API = "http://localhost:3000/api/clientes"; // ruta del backend
const token = localStorage.getItem("tokenCliente");

// si no hay token → redirigir
if (!token) {
  alert("Debes iniciar sesión");
  window.location.href = "/front/HTML/cliente_sin_login/inicio.html";
}

// =============================================
// 1. CARGAR DATOS DEL CLIENTE
// =============================================
async function cargarPerfil() {
  const res = await fetch(`${API}/perfil`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  if (data.mensaje === "Token inválido o expirado") {
    alert("Sesión expirada, vuelve a iniciar sesión");
    localStorage.removeItem("tokenCliente");
    location.href = "/front/HTML/cliente_sin_login/inicio.html";
    return;
  }

  document.querySelector(".texto").textContent = `Hola, ${data.nombre} 👋`;

  // rellenamos los inputs
  document.getElementById("nombre").value = data.nombre;
  document.getElementById("email").value = data.email;
  document.getElementById("telefono").value = data.telefono || "";
  document.getElementById("direccion").value = data.direccion || "";
}

cargarPerfil();


// =============================================
// 2. GUARDAR CAMBIOS
// =============================================
async function guardarCambios() {
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const direccion = document.getElementById("direccion").value;

  const res = await fetch(`${API}/perfil`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      nombre,
      telefono,
      direccion
    })
  });

  const data = await res.json();

  if (data.ok) {
    mostrarAviso("Perfil actualizado correctamente");
  } else {
    mostrarAviso("No se pudo actualizar");
  }
}


// =============================================
// Modal de confirmación para cancelar pedidos
// =============================================
let pedidoAConfirmar = null;

function abrirModalConfirm(id) {
  pedidoAConfirmar = id;
  document.getElementById("modalConfirmCancel").classList.add("activo");
}

function cerrarModalConfirm() {
  pedidoAConfirmar = null;
  document.getElementById("modalConfirmCancel").classList.remove("activo");
}

async function confirmarCancelacion() {
  if (!pedidoAConfirmar) return;

  const id = pedidoAConfirmar;
  cerrarModalConfirm();

  const res = await fetch(`http://localhost:3000/api/pedidos/cancelar/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();

  if (data.ok) {
    mostrarAviso("Pedido cancelado correctamente");
    cargarPedidosModal();
  } else {
    mostrarAviso(data.mensaje || "No se pudo cancelar el pedido");
  }
}


// =============================================
// Aviso emergente (fade + autodestrucción)
// =============================================
function mostrarAviso(texto) {
  const aviso = document.createElement("div");
  aviso.className = "avisoEmergente";
  aviso.textContent = texto;

  document.body.appendChild(aviso);

  setTimeout(() => {
    aviso.classList.add("oculto");
    setTimeout(() => aviso.remove(), 500);
  }, 1200);
}


// =============================================
//  MODALES DE PEDIDOS
// =============================================
function abrirModal(id) {
  document.getElementById(id).classList.add("activo");
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove("activo");
}

window.addEventListener("click", function (e) {
  const modales = ["modalPedidos", "modalDetalle", "modalConfirmCancel"];

  modales.forEach(id => {
    const modal = document.getElementById(id);
    if (modal && e.target === modal) {
      modal.classList.remove("activo");
    }
  });
});


async function cargarPedidosModal() {
  const res = await fetch("http://localhost:3000/api/pedidos/mis-pedidos", {
    headers: { "Authorization": "Bearer " + token }
  });

  const data = await res.json();
  const cont = document.getElementById("listaPedidos");
  cont.innerHTML = "";

  if (data.pedidos.length === 0) {
    cont.innerHTML = "<p>No tienes pedidos.</p>";
    return;
  }

data.pedidos.forEach(p => {

    // si está cancelado → botón deshabilitado
    const botonCancelar = p.estado.toLowerCase() === "cancelado"
        ? `<button class="btn-cancelar disabled" disabled>Cancelado</button>`
        : `<button onclick="abrirModalConfirm(${p.id_pedido})" class="btn-cancelar">Cancelar Pedido</button>`;

    cont.innerHTML += `
      <div class="pedido">
        <p><b>ID Pedido:</b> ${p.id_pedido}</p>
        <p><b>Fecha:</b> ${p.fecha_pedido}</p>
        <p><b>Total:</b> $${p.total_pedido}</p>
        <p><b>Estado:</b> ${p.estado}</p>

        <button onclick="verDetallePedido(${p.id_pedido})" class="btn-detalles">Ver Detalles</button>
        ${botonCancelar}
      </div>
    `;
});
}


async function verDetallePedido(id) {
  const res = await fetch("http://localhost:3000/api/pedidos/mis-pedidos", {
    headers: { "Authorization": "Bearer " + token }
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
      </div>`;
  });

  document.getElementById("detalleInfo").innerHTML = html;

  cerrarModal("modalPedidos");
  abrirModal("modalDetalle");
}

function abrirMisPedidos() {
  cargarPedidosModal();
  abrirModal("modalPedidos");
}

function volverALista() {
  cerrarModal("modalDetalle");
  abrirModal("modalPedidos");
}
