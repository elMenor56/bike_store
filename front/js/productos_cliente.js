// ===========================================
// CARGAR CATEGORÍAS (Ruta pública)
// ===========================================

async function cargarCategorias() {

    // Hacemos la petición a la ruta pública
    const res = await fetch("http://localhost:3000/api/categorias");

    // Convertimos la respuesta a JSON
    const categorias = await res.json();

    // Seleccionamos el <select>
    const select = document.getElementById("filtroCategorias");

    // Agregamos cada categoría al select
    categorias.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.id_categoria;
        opt.textContent = cat.nombre;
        select.appendChild(opt);
    });
}


// ===========================================
// CARGAR PRODUCTOS
// ===========================================
async function cargarProductos() {

    // Obtenemos categoría seleccionada
    const categoria = document.getElementById("filtroCategorias").value;

    let url = "http://localhost:3000/api/productos";

    // si eligieron categoría, la agregamos como filtro
    if (categoria) {
        url += "?categorias=" + categoria;
    }

    // Pedimos los productos al backend
    const res = await fetch(url);
    const productos = await res.json();

    const div = document.getElementById("productos");
    div.innerHTML = ""; // limpiamos

    productos.forEach(prod => {

        // corregimos la URL de la imagen
        const imagenUrl = prod.imagen_producto.startsWith("/")
            ? "http://localhost:3000" + prod.imagen_producto
            : "http://localhost:3000/" + prod.imagen_producto;

        div.innerHTML += `
            <div class="card">
                <img src="${imagenUrl}">
                <h3>${prod.nombre}</h3>
                <p>Bicicleta de ${prod.nombre_categoria}</p>
                <p><strong>Precio:</strong> $${prod.precio}</p>
                <button onclick="verDetalles(${prod.id_producto})">Ver detalles</button>
            </div>
        `;
    });
}


// ===========================================
// Ir al detalle del producto
// ===========================================
function verDetalles(id) {
    window.location.href = "producto_detalle.html?id=" + id;
}


// Cargar todo al inicio
cargarCategorias();
cargarProductos();
