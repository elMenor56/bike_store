// ======================================================================
// Archivo productos.js (ADMIN) - versión corregida FINAL
// ======================================================================

// Guardamos la URL del backend
const API = "http://localhost:3000/api/productos";


// ======================================================================
// Función para obtener el token guardado en localStorage
// ======================================================================
function getToken() {

    // Traigo el token que se guardó al iniciar sesión
    return localStorage.getItem("token_admin");
}



// ======================================================================
// Cargar categorías en el select del admin
// ======================================================================
async function cargarCategorias() {

    // Pedimos las categorías a la ruta protegida del admin
    const res = await fetch("http://localhost:3000/api/categorias", {
        headers: {
            "Authorization": "Bearer " + getToken()  // mando el token
        }
    });

    // Convertir a JSON
    const data = await res.json();

    // Buscamos el select del HTML
    const select = document.getElementById("categoriaSelect");

    // Lo limpiamos
    select.innerHTML = "";

    // Recorremos todas las categorías que vienen del backend
    data.forEach(cat => {
        select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
    });
}



// ======================================================================
// Cargar marcas en el select del admin
// ======================================================================
async function cargarMarcas() {

    // Pedimos las marcas a la ruta pública
    const res = await fetch("http://localhost:3000/api/marcas");

    // Convertimos respuesta a JSON
    const data = await res.json();

    // Buscamos el select
    const select = document.getElementById("marcaSelect");

    // Lo limpiamos
    select.innerHTML = "";

    // Llenamos con las marcas
    data.forEach(m => {
        select.innerHTML += `<option value="${m.id_marca}">${m.nombre}</option>`;
    });
}



// ======================================================================
// Crear un producto nuevo
// ======================================================================
async function crearProducto() {

    // Traemos los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const id_marca = document.getElementById("marcaSelect").value;
    const id_categoria = document.getElementById("categoriaSelect").value;
    const imagen = document.getElementById("imagen").files[0];

    // Creamos un FormData porque se envía archivo
    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_marca", id_marca);
    form.append("id_categoria", id_categoria);
    form.append("imagen", imagen);

    // Hacemos la petición POST al backend
    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + getToken()  // token obligatorio
        },
        body: form
    });

    const data = await res.json();

    // Mostramos mensaje en pantalla
    document.getElementById("msg").textContent = data.mensaje;

    // Re-carga la lista de productos
    cargarProductos();
}



// ======================================================================
// Cargar productos del admin en pantalla (CORREGIDO)
// ======================================================================
async function cargarProductos() {

    // Pedimos los productos al backend ADMIN
    const res = await fetch(API, {
        headers: {
            "Authorization": "Bearer " + getToken()  // token obligatorio
        }
    });

    // Convertimos la respuesta
    const productos = await res.json();

    // Buscamos el contenedor donde van los productos
    const contenedor = document.getElementById("productos");

    // Limpiamos lo que haya antes
    contenedor.innerHTML = "";

    // Recorremos cada producto
    for (const p of productos) {

        // =============================================
        // CORRECCIÓN DE LA RUTA DE LA IMAGEN
        // =============================================
        let rutaImagen = p.imagen_producto;

        if (rutaImagen.startsWith("/uploads/")) {
            rutaImagen = "http://localhost:3000" + rutaImagen;
        } else {
            rutaImagen = "http://localhost:3000/uploads/" + rutaImagen;
        }

        const imagen = p.imagen_producto
            ? `<img src="${rutaImagen}" width="120">`
            : "<p>(Sin imagen)</p>";

        // =============================================

        contenedor.innerHTML += `
            <div style="border:1px solid #555; margin:10px; padding:10px;">
                <h4>${p.nombre}</h4>
                <p>${p.descripcion}</p>
                <p><b>Precio:</b> $${p.precio}</p>
                <p><b>Marca:</b> ${p.nombre_marca}</p>
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



// ======================================================================
// Crear las opciones de marcas para los selects de edición
// ======================================================================
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



// ======================================================================
// Crear opciones de categorías para edición
// ======================================================================
async function crearOpcionesCategorias(idActual) {

    const res = await fetch("http://localhost:3000/api/admin/categorias", {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const categorias = await res.json();

    let html = "";

    categorias.forEach(c => {
        const selected = c.id_categoria == idActual ? "selected" : "";
        html += `<option ${selected} value="${c.id_categoria}">${c.nombre}</option>`;
    });

    return html;
}



// ======================================================================
// Eliminar un producto
// ======================================================================
async function eliminarProducto(id) {

    const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();
    alert(data.mensaje);

    // Volver a cargar productos
    cargarProductos();
}



// ======================================================================
// Actualizar un producto (marca incluida)
// ======================================================================
async function actualizarProducto(id) {

    // Traigo los datos editados
    const nombre = document.getElementById(`edit-nombre-${id}`).value;
    const descripcion = document.getElementById(`edit-desc-${id}`).value;
    const precio = document.getElementById(`edit-precio-${id}`).value;
    const id_marca = document.getElementById(`edit-marca-${id}`).value;
    const id_categoria = document.getElementById(`edit-cat-${id}`).value;
    const imagen = document.getElementById(`edit-img-${id}`).files[0];

    // Creamos formdata
    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_marca", id_marca);
    form.append("id_categoria", id_categoria);

    // Si seleccionó nueva imagen, la enviamos
    if (imagen) form.append("imagen", imagen);

    // Llamamos al backend
    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + getToken()
        },
        body: form
    });

    const data = await res.json();
    alert(data.mensaje);

    // Volver a cargar los productos
    cargarProductos();
}
