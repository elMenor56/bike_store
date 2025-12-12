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
    return localStorage.getItem("tokenAdmin");
}



// ======================================================================
// Cargar categorías en el select del admin
// ======================================================================
async function cargarCategoriasTabla() {

    const res = await fetch("http://localhost:3000/api/admin/categorias", {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();

    const select = document.getElementById("categoriaSelect");
    select.innerHTML = "";

    data.forEach(cat => {
        select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
    });
}




// ======================================================================
// Cargar marcas en el select del admin
// ======================================================================
async function cargarMarcasTabla() {

    const res = await fetch("http://localhost:3000/api/admin/marcas", {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();

    const select = document.getElementById("marcaSelect");
    select.innerHTML = "";

    data.forEach(m => {
        select.innerHTML += `<option value="${m.id_marca}">${m.nombre}</option>`;
    });
}




async function crearProducto() {

    // ========== traer datos ==========
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = Number(document.getElementById("precio").value); // convertir a número
    const id_marca = document.getElementById("marcaSelect").value;
    const id_categoria = document.getElementById("categoriaSelect").value;
    const stock = Number(document.getElementById("stock").value);   // convertir a número
    const imagen = document.getElementById("imagen").files[0];

    // ========== validación precio negativo ==========
    // nota: si el usuario deja vacío, Number("") = 0, así que funciona bien
    if (precio < 0) {
        mostrarAviso("El precio no puede ser negativo");
        return; // parar la función
    }

    // ========== validación stock negativo ==========
    if (stock < 0) {
        mostrarAviso("El stock no puede ser negativo");
        return;
    }

    // ========== validación campos vacíos básicos ==========
    if (!nombre || !descripcion || !precio || !id_marca || !id_categoria || !stock) {
        mostrarAviso("Todos los campos son obligatorios");
        return;
    }

    // ========== crear FormData ==========
    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_marca", id_marca);
    form.append("id_categoria", id_categoria);
    form.append("stock", stock);
    form.append("imagen", imagen);

    // ========== enviar al backend ==========
    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + getToken()
        },
        body: form
    });

    const data = await res.json();

    mostrarAviso(data.mensaje);

    // recargar lista
    cargarProductos();
}




// ======================================================================
// Cargar productos del admin en pantalla (CORREGIDO)
// ======================================================================
async function cargarProductos() {

    const res = await fetch(API, {
        headers: { "Authorization": "Bearer " + getToken() }
    });

    const productos = await res.json();

    const tbody = document.getElementById("tablaProductos");

    tbody.innerHTML = ""; // limpiar tabla

    for (const p of productos) {

        // ===============================
        // ARREGLAR RUTA DE LA IMAGEN
        // ===============================
        let rutaImagen = p.imagen_producto;

        if (rutaImagen.startsWith("/uploads/")) {
            rutaImagen = "http://localhost:3000" + rutaImagen;
        } else {
            rutaImagen = "http://localhost:3000/uploads/" + rutaImagen;
        }

        const imagen = p.imagen_producto
            ? `<img src="${rutaImagen}" style="width:60px; height:60px; object-fit: contain; border-radius:6px;">`
            : "(Sin imagen)";

        // ===============================
        // AGREGAR FILA A LA TABLA
        // ===============================
        const tr = document.createElement("tr");

// nota: guardo los datos del producto dentro de la fila pa usarlos en el modal
        tr.dataset.id = p.id_producto;
        tr.dataset.nombre = p.nombre;
        tr.dataset.descripcion = p.descripcion;
        tr.dataset.precio = p.precio;
        tr.dataset.stock = p.stock;
        tr.dataset.marca = p.nombre_marca;
        tr.dataset.categoria = p.nombre_categoria;

        tr.innerHTML = `
            <td>${p.id_producto}</td>
            <td>${imagen}</td>
            <td><p>${p.nombre}</p></td>
            <td><p class="texto-limitado">${p.descripcion}</p></td>
            <td><p>${formatearCOP(Number(p.precio))}</p></td>
            <td><p>${p.nombre_marca}</p></td>
            <td><p>${p.nombre_categoria}</p></td>
            <td><p>${p.stock}</p></td>

            <td class="td-acciones">
                <button class="btn-productos" onclick="abrirModalEditar(${p.id_producto})">Actualizar</button>
                <button class="btn-productos" onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    }
}

async function abrirModalEditar(id) {

    // nota: busco la fila que tiene el producto
    const tr = [...document.querySelectorAll("#tablaProductos tr")]
        .find(row => row.dataset.id == id);

    // nota: lleno los campos del modal con lo que guardé en los data
    document.getElementById("modal-id").value = id;
    document.getElementById("modal-nombre").value = tr.dataset.nombre;
    document.getElementById("modal-desc").value = tr.dataset.descripcion;
    document.getElementById("modal-precio").value = tr.dataset.precio;
    document.getElementById("modal-stock").value = tr.dataset.stock;

    // nota: lleno los selects usando los valores guardados
    document.getElementById("modal-marca").innerHTML =
        await crearOpcionesMarcas(tr.dataset.marca);

    document.getElementById("modal-cat").innerHTML =
        await crearOpcionesCategorias(tr.dataset.categoria);

    // nota: muestro el modal
    document.getElementById("modalEditar").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalEditar").style.display = "none";
}

// ======================================================================
// Crear las opciones de marcas para los selects de edición
// ======================================================================
async function crearOpcionesMarcas(idActual) {

    const res = await fetch("http://localhost:3000/api/admin/marcas", {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

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

    categorias.forEach(cat => {
        const selected = cat.id_categoria == idActual ? "selected" : "";
        html += `<option ${selected} value="${cat.id_categoria}">${cat.nombre}</option>`;
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
    mostrarAviso(data.mensaje);

    // Volver a cargar productos
    cargarProductos();
}



// ======================================================================
// Actualizar un producto (marca incluida)
// ======================================================================
async function actualizarProducto(id) {

    // nota: traigo valores del formulario
    const nombre = document.getElementById(`edit-nombre-${id}`).value;
    const descripcion = document.getElementById(`edit-desc-${id}`).value;
    const precio = Number(document.getElementById(`edit-precio-${id}`).value); // convertir a número
    const id_marca = document.getElementById(`edit-marca-${id}`).value;
    const id_categoria = document.getElementById(`edit-cat-${id}`).value;
    const imagen = document.getElementById(`edit-img-${id}`).files[0];
    const stock = Number(document.getElementById(`edit-stock-${id}`).value);

    // ======== validaciones básicas =========
    // nota: evitar precio negativo
    if (precio < 0) {
        mostrarAviso("El precio no puede ser negativo");
        return;
    }

    // nota: evitar stock negativo
    if (stock < 0) {
        mostrarAviso("El stock no puede ser negativo");
        return;
    }

    // nota: evitar campos vacíos
    if (!nombre || !descripcion || !precio || !stock) {
        mostrarAviso("Todos los campos son obligatorios");
        return;
    }

    // nota: crear formdata
    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_marca", id_marca);
    form.append("id_categoria", id_categoria);
    form.append("stock", stock);

    // nota: enviar imagen solo si puso una nueva
    if (imagen) form.append("imagen", imagen);

    // nota: enviar datos al backend
    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + getToken()
        },
        body: form
    });

    const data = await res.json();
    mostrarAviso(data.mensaje);

    cargarProductos();
}


async function guardarCambios() {

    const id = document.getElementById("modal-id").value;

    // nota: traigo los datos del modal
    const nombre = document.getElementById("modal-nombre").value;
    const descripcion = document.getElementById("modal-desc").value;
    const precio = Number(document.getElementById("modal-precio").value); 
    const id_marca = document.getElementById("modal-marca").value;
    const id_categoria = document.getElementById("modal-cat").value;
    const stock = Number(document.getElementById("modal-stock").value);
    const img = document.getElementById("modal-img").files[0];

    // ========== validaciones ==========
    if (precio < 0) {
        mostrarAviso("El precio no puede ser negativo");
        return;
    }

    if (stock < 0) {
        mostrarAviso("El stock no puede ser negativo");
        return;
    }

    if (!nombre || !descripcion || !precio || !stock) {
        mostrarAviso("Todos los campos son obligatorios");
        return;
    }

    // ========== crear formdata ==========
    const form = new FormData();
    form.append("nombre", nombre);
    form.append("descripcion", descripcion);
    form.append("precio", precio);
    form.append("id_marca", id_marca);
    form.append("id_categoria", id_categoria);
    form.append("stock", stock);

    if (img) form.append("imagen", img);

    // ========== enviar al backend ==========
    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Authorization": "Bearer " + getToken() },
        body: form
    });

    const data = await res.json();
    mostrarAviso(data.mensaje);

    cerrarModal();
    cargarProductos();
}

document.getElementById("modalEditar").addEventListener("click", function (e) {

    // nota: cierro solo si el clic fue en el fondo y no en el contenido
    if (e.target === this) {
        cerrarModal();
    }
});

