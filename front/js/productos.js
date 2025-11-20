const API = "http://localhost:3000/api/productos";

// =============================
// Obtener token admin
// =============================
function getToken() {
    return localStorage.getItem("token_admin");
}

// =============================
// Cargar categorías en el select
// =============================
async function cargarCategorias() {

    const res = await fetch("http://localhost:3000/api/admin/categorias", {
        headers: { "Authorization": "Bearer " + getToken() }
    });

    const data = await res.json();

    const select = document.getElementById("categoriaSelect");
    select.innerHTML = "";

    data.forEach(cat => {
        select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
    });
}

// =============================
// Crear un producto
// =============================
async function crearProducto() {

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const id_categoria = document.getElementById("categoriaSelect").value;
    const imagen = document.getElementById("imagen").files[0];

    // usamos FormData porque hay imagen
    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_categoria", id_categoria);
    form.append("imagen", imagen);

    const res = await fetch(API, {
        method: "POST",
        headers: { "Authorization": "Bearer " + getToken() },
        body: form
    });

    const data = await res.json();
    document.getElementById("msg").textContent = data.mensaje;

    cargarProductos();
}

// =============================
// Listar productos
// =============================
async function cargarProductos() {

    const res = await fetch(API);
    const productos = await res.json();

    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    for (const p of productos) {

        // traer imagen base64 por id
        const resImg = await fetch(`${API}/${p.id_producto}`);
        const prodCompleto = await resImg.json();

        const imagen = prodCompleto.imagen_base64 
            ? `<img src="data:image/jpeg;base64,${prodCompleto.imagen_base64}" width="120">`
            : "<p>(Sin imagen)</p>";

        contenedor.innerHTML += `
            <div style="border:1px solid #555; margin:10px; padding:10px;">
                
                <h4>${p.nombre}</h4>
                <p>${p.descripcion}</p>
                <p><b>Precio:</b> ${p.precio}</p>
                <p><b>Categoría:</b> ${p.nombre_categoria}</p>
                ${imagen}

                <br><br>

                <!-- INPUTS PARA EDITAR -->
                <input id="edit-nombre-${p.id_producto}" value="${p.nombre}"><br><br>
                <textarea id="edit-desc-${p.id_producto}">${p.descripcion || ""}</textarea><br><br>
                <input id="edit-precio-${p.id_producto}" type="number" value="${p.precio}"><br><br>

                <select id="edit-cat-${p.id_producto}">
                    ${await crearOpcionesCategorias(p.id_categoria)}
                </select><br><br>

                <label>Nueva Imagen (opcional):</label><br>
                <input id="edit-img-${p.id_producto}" type="file"><br><br>

                <button onclick="actualizarProducto(${p.id_producto})">Actualizar</button>
                <button onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
            </div>
        `;
    }
}

// =============================
// Crear opciones en select (editar producto)
// =============================
async function crearOpcionesCategorias(idActual) {

    const res = await fetch("http://localhost:3000/api/admin/categorias", {
        headers: { "Authorization": "Bearer " + getToken() }
    });

    const categorias = await res.json();

    let html = "";

    categorias.forEach(cat => {
        const selected = cat.id_categoria == idActual ? "selected" : "";
        html += `<option ${selected} value="${cat.id_categoria}">${cat.nombre}</option>`;
    });

    return html;
}

// =============================
// Eliminar producto
// =============================
async function eliminarProducto(id) {

    const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();
    alert(data.mensaje);

    cargarProductos();
}

// =============================
// Actualizar producto
// =============================
async function actualizarProducto(id) {

    const nombre = document.getElementById(`edit-nombre-${id}`).value;
    const descripcion = document.getElementById(`edit-desc-${id}`).value;
    const precio = document.getElementById(`edit-precio-${id}`).value;
    const id_categoria = document.getElementById(`edit-cat-${id}`).value;
    const imagen = document.getElementById(`edit-img-${id}`).files[0];

    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_categoria", id_categoria);

    // solo agregar imagen si el admin subió una nueva
    if (imagen) form.append("imagen", imagen);

    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Authorization": "Bearer " + getToken() },
        body: form
    });

    const data = await res.json();
    alert(data.mensaje);

    cargarProductos();
}
