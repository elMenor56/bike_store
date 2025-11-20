// ===============================================================
// Archivo productos.js (ADMIN) - versión corregida con marcas
// ===============================================================

// guardamos la URL del backend
const API = "http://localhost:3000/api/productos";

// ===============================================================
// Función que obtiene el token guardado en localStorage
// ===============================================================
function getToken() {
    return localStorage.getItem("token_admin");
}

// ===============================================================
// Cargar las categorías en el select
// ===============================================================
async function cargarCategorias() {

    // pedimos las categorías al backend (ruta admin protegida)
    const res = await fetch("http://localhost:3000/api/admin/categorias", {
        headers: { "Authorization": "Bearer " + getToken() }
    });

    // convertimos respuesta a JSON
    const data = await res.json();

    // buscamos el select de categorías
    const select = document.getElementById("categoriaSelect");

    // limpiamos el select
    select.innerHTML = "";

    // llenamos el select opción por opción
    data.forEach(cat => {
        select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
    });
}

// ===============================================================
// Cargar las marcas en el select
// ===============================================================
async function cargarMarcas() {

    // pedimos las marcas a la ruta pública del backend
    const res = await fetch("http://localhost:3000/api/marcas");

    // convertimos en JSON
    const data = await res.json();

    // buscamos el select de marcas
    const select = document.getElementById("marcaSelect");

    // limpiamos el select
    select.innerHTML = "";

    // llenamos con las marcas recibidas
    data.forEach(m => {
        select.innerHTML += `<option value="${m.id_marca}">${m.nombre}</option>`;
    });
}

// ===============================================================
// Crear un producto (envía imagen, marca y categoría)
// ===============================================================
async function crearProducto() {

    // obtenemos los valores escritos por el admin
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const id_marca = document.getElementById("marcaSelect").value;  // corregido
    const id_categoria = document.getElementById("categoriaSelect").value;
    const imagen = document.getElementById("imagen").files[0];

    // usamos FormData porque se envía archivo
    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_marca", id_marca);  // corregido
    form.append("id_categoria", id_categoria);
    form.append("imagen", imagen);

    // enviamos la petición al backend
    const res = await fetch(API, {
        method: "POST",
        headers: { "Authorization": "Bearer " + getToken() },
        body: form
    });

    const data = await res.json();

    // mostramos mensaje en pantalla
    document.getElementById("msg").textContent = data.mensaje;

    // recargamos la lista
    cargarProductos();
}

// ===============================================================
// Cargar productos en pantalla
// ===============================================================
async function cargarProductos() {

    const res = await fetch(API);
    const productos = await res.json();

    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    // ciclo para cada producto
    for (const p of productos) {

        // pedimos la imagen en base64
        const resImg = await fetch(`${API}/${p.id_producto}`);
        const prodCompleto = await resImg.json();

        // imagen lista
        const imagen = prodCompleto.imagen_base64
            ? `<img src="data:image/jpeg;base64,${prodCompleto.imagen_base64}" width="120">`
            : "<p>(Sin imagen)</p>";

        // pintamos el producto
        contenedor.innerHTML += `
            <div style="border:1px solid #555; margin:10px; padding:10px;">

                <h4>${p.nombre}</h4>
                <p>${p.descripcion}</p>
                <p><b>Precio:</b> ${p.precio}</p>
                <p><b>Marca:</b> ${p.nombre_marca || "(Sin marca)"}</p>
                <p><b>Categoría:</b> ${p.nombre_categoria}</p>
                ${imagen}

                <br><br>

                <input id="edit-nombre-${p.id_producto}" value="${p.nombre}">
                <br><br>

                <textarea id="edit-desc-${p.id_producto}">${p.descripcion || ""}</textarea>
                <br><br>

                <input id="edit-precio-${p.id_producto}" type="number" value="${p.precio}">
                <br><br>

                <select id="edit-marca-${p.id_producto}">
                    ${await crearOpcionesMarcas(p.id_marca)}
                </select>
                <br><br>

                <select id="edit-cat-${p.id_producto}">
                    ${await crearOpcionesCategorias(p.id_categoria)}
                </select>
                <br><br>

                <label>Nueva Imagen (opcional):</label>
                <input id="edit-img-${p.id_producto}" type="file">
                <br><br>

                <button onclick="actualizarProducto(${p.id_producto})">Actualizar</button>
                <button onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
            </div>
        `;
    }
}

// ===============================================================
// Crear opciones de marcas para los selects de edición
// ===============================================================
async function crearOpcionesMarcas(idActual) {

    const res = await fetch("http://localhost:3000/api/marcas");
    const marcas = await res.json();

    let html = "";

    marcas.forEach(m => {
        const selected = m.id_marca == idActual ? "selected" : "";
        html += `<option ${selected} value="${m.id_marca}">${m.nombre}</option>`;
    });

    return html;
}

// ===============================================================
// Eliminar un producto
// ===============================================================
async function eliminarProducto(id) {
    const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + getToken() }
    });

    const data = await res.json();
    alert(data.mensaje);

    cargarProductos();
}

// ===============================================================
// Actualizar producto (incluye marca)
// ===============================================================
async function actualizarProducto(id) {

    const nombre = document.getElementById(`edit-nombre-${id}`).value;
    const descripcion = document.getElementById(`edit-desc-${id}`).value;
    const precio = document.getElementById(`edit-precio-${id}`).value;
    const id_marca = document.getElementById(`edit-marca-${id}`).value; // corregido
    const id_categoria = document.getElementById(`edit-cat-${id}`).value;
    const imagen = document.getElementById(`edit-img-${id}`).files[0];

    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_marca", id_marca);
    form.append("id_categoria", id_categoria);

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
