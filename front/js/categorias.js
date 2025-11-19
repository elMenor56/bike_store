const API = "http://localhost:3000/api/admin/categorias";

// ================================
// OBTENER TOKEN DEL ADMIN
// ================================
function getToken() {
    return localStorage.getItem("token_admin");
}

// ================================
// CARGAR TODAS LAS CATEGORÍAS
// ================================
async function cargarCategorias() {

    const res = await fetch(API, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();

    const tabla = document.getElementById("tablaCategorias");
    tabla.innerHTML = ""; // limpiar tabla

    data.forEach(cat => {
        tabla.innerHTML += `
            <tr>
              <td>${cat.id_categoria}</td>
              <td>
                <input id="input-${cat.id_categoria}" value="${cat.nombre}">
              </td>
              <td>
                <button onclick="actualizarCategoria(${cat.id_categoria})">Actualizar</button>
                <button onclick="eliminarCategoria(${cat.id_categoria})">Eliminar</button>
              </td>
            </tr>
        `;
    });
}

// ================================
// CREAR UNA NUEVA CATEGORÍA
// ================================
async function crearCategoria() {
    const nombre = document.getElementById("nombreCategoria").value;

    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({ nombre })
    });

    const data = await res.json();

    document.getElementById("msg").textContent = data.mensaje;
    
    cargarCategorias(); // refrescar tabla
}

// ================================
// ACTUALIZAR CATEGORÍA
// ================================
async function actualizarCategoria(id) {

    const nuevoNombre = document.getElementById(`input-${id}`).value;

    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({ nombre: nuevoNombre })
    });

    const data = await res.json();

    document.getElementById("msg").textContent = data.mensaje;

    cargarCategorias();
}

// ================================
// ELIMINAR CATEGORÍA
// ================================
async function eliminarCategoria(id) {

    const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();

    document.getElementById("msg").textContent = data.mensaje;

    cargarCategorias();
}
