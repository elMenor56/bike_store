// =============================================
// OBTENER TOKEN DEL ADMIN PARA HACER PETICIONES
// =============================================
const token = localStorage.getItem("token_admin"); // guardamos token del admin

// si no existe token, redirigir al login admin
if (!token) {
  alert("Debes iniciar sesión como administrador");
  window.location.href = "admin_login.html";
}

// =============================================
// FUNCIÓN PARA CARGAR TODOS LOS CLIENTES
// =============================================
async function cargarClientes() {
  try {
    // hacemos petición al backend
    const res = await fetch("http://localhost:3000/api/admin/clientes", {
      headers: {
        "Authorization": "Bearer " + token // enviamos token
      }
    });

    // convertimos respuesta a JSON
    const data = await res.json();

    // buscamos tbody donde insertaremos filas
    const tbody = document.getElementById("tablaClientes");
    tbody.innerHTML = ""; // limpiamos por si hay datos previos

    // recorremos clientes uno por uno
    data.forEach(cliente => {
      // creamos fila con datos
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${cliente.id_cliente}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.email}</td>
        <td>${cliente.telefono || "---"}</td>
        <td>${cliente.direccion || "---"}</td>
        <td>
          <button onclick="verPedidos(${cliente.id_cliente})">Ver pedidos</button>
        </td>
      `;

      // agregamos la fila a la tabla
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.log("Error en cargarClientes:", error);
  }
}

// llamamos a la función al cargar la página
cargarClientes();


// =============================================
// FUNCIÓN PARA IR A LA PANTALLA DE PEDIDOS
// =============================================
function verPedidos(id_cliente) {
  // guardamos id del cliente temporalmente
  localStorage.setItem("cliente_pedidos_id", id_cliente);

  // redirigimos a la página de pedidos del cliente
  window.location.href = "admin_pedidos_cliente.html";
}
