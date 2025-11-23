// ======================================================================
// CARGAR CATEGORÍAS (Público)
// ======================================================================
async function cargarCategorias() {

    const res = await fetch("http://localhost:3000/api/categorias");
    const categorias = await res.json();

    const select = document.getElementById("filtroCategorias");

    categorias.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.id_categoria;
        opt.textContent = cat.nombre;
        select.appendChild(opt);
    });
}


// ======================================================================
// CARGAR MARCAS (nuevo)
// ======================================================================
async function cargarMarcas() {

    const res = await fetch("http://localhost:3000/api/marcas");
    const marcas = await res.json();

    const select = document.getElementById("filtroMarcas");

    marcas.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.nombre;
        opt.textContent = m.nombre;
        select.appendChild(opt);
    });
}


// ======================================================================
// CARGAR PRODUCTOS (con filtros y búsqueda)
// ======================================================================
async function cargarProductos() {

    // capturamos todos los filtros
    const categoria = document.getElementById("filtroCategorias").value;
    const marca = document.getElementById("filtroMarcas").value;
    const precio = document.getElementById("filtroPrecio").value;
    const busqueda = document.getElementById("busqueda").value.trim();

    // armamos la URL con parámetros
    let url = "http://localhost:3000/api/productos?";

    if (categoria) url += "categorias=" + categoria + "&";
    if (marca) url += "marcas=" + marca + "&";
    if (precio) url += "precio=" + precio + "&";
    if (busqueda) url += "busqueda=" + encodeURIComponent(busqueda) + "&";

    // hacemos la petición al backend
    const res = await fetch(url);
    const productos = await res.json();

    const div = document.getElementById("productos");
    div.innerHTML = ""; // limpiamos

    productos.forEach(prod => {

        const imagenUrl = prod.imagen_producto.startsWith("/")
            ? "http://localhost:3000" + prod.imagen_producto
            : "http://localhost:3000/" + prod.imagen_producto;

        div.innerHTML += `
            <div class="card">
                <div class="img-container"><img src="${imagenUrl}"></div>
                <p>Categoria: ${prod.nombre_categoria}</p>
                <h3>${prod.nombre}</h3>
                <p><strong>Marca:</strong> ${prod.marca}</p>
                <p>$${prod.precio}</p>
                <button onclick="verDetalles(${prod.id_producto})">Ver detalles</button>
            </div>
        `;
    });
}


// ======================================================================
// IR AL DETALLE DEL PRODUCTO
// ======================================================================
function verDetalles(id) {
    window.location.href = "producto_detalle.html?id=" + id;
}


// ======================================================================
// CARGAR TODO AL INICIO
// ======================================================================
cargarCategorias();
cargarMarcas();
cargarProductos();
