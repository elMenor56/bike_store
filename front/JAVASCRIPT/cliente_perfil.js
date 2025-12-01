const API = "http://localhost:3000/api/clientes"; // ruta del backend
const token = localStorage.getItem("tokenCliente");

// si no hay token → redirigir
if (!token) {
  alert("Debes iniciar sesión");
  window.location.href = "/front/HTML/inicio.html";
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
    location.href = "/front/HTML/inicio.html";
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
    alert("Perfil actualizado correctamente");
  } else {
    alert("No se pudo actualizar");
  }
}
