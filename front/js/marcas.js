const API_MARCAS = "http://localhost:3000/api/admin/marcas";

// ================================
// OBTENER TOKEN DEL ADMIN
// ================================
function getToken() {
    return localStorage.getItem("tokenAdmin");
}

// ================================
// CARGAR TODAS LAS MARCAS
// ================================
async function cargarMarcas() {

    const res = await fetch(API_MARCAS, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();

    const tabla = document.getElementById("tablaMarcas");
    tabla.innerHTML = "";

    data.forEach(marca => {
        tabla.innerHTML += `
            <tr>
              <td>${marca.id_marca}</td>
              <td>
                <input id="marca-${marca.id_marca}" value="${marca.nombre}">
              </td>
              <td>
                <button onclick="actualizarMarca(${marca.id_marca})">Actualizar</button>
                <button onclick="eliminarMarca(${marca.id_marca})">Eliminar</button>
              </td>
            </tr>
        `;
    });
}

// ================================
// CREAR UNA MARCA
// ================================
async function crearMarca() {

    const nombre = document.getElementById("nombreMarca").value;

    // Validación
    if (nombre.trim() === "") {
        document.getElementById("msgMarcas").textContent = "El nombre no puede estar vacío";
        return;
    }

    const res = await fetch(API_MARCAS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({ nombre })
    });

    const data = await res.json();

    if (!res.ok) {
        document.getElementById("msgMarcas").textContent = data.mensaje || "Error al crear marca";
        return;
    }

    document.getElementById("msgMarcas").textContent = data.mensaje;

    document.getElementById("nombreMarca").value = ""; // limpiar input

    cargarMarcas();
}

// ================================
// ACTUALIZAR MARCA
// ================================
async function actualizarMarca(id) {

    const nuevoNombre = document.getElementById(`marca-${id}`).value;

    if (nuevoNombre.trim() === "") {
        document.getElementById("msgMarcas").textContent = "El nombre no puede ir vacío";
        return;
    }

    const res = await fetch(`${API_MARCAS}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({ nombre: nuevoNombre })
    });

    const data = await res.json();

    if (!res.ok) {
        document.getElementById("msgMarcas").textContent = data.mensaje || "Error al actualizar marca";
        return;
    }

    document.getElementById("msgMarcas").textContent = data.mensaje;

    cargarMarcas();
}

// ================================
// ELIMINAR MARCA
// ================================
async function eliminarMarca(id) {

    const res = await fetch(`${API_MARCAS}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();

    if (!res.ok) {
        document.getElementById("msgMarcas").textContent = data.mensaje || "Error al eliminar";
        return;
    }

    document.getElementById("msgMarcas").textContent = data.mensaje;

    cargarMarcas();
}
