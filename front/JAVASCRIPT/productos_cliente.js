// Leer parámetros enviados desde inicio.html
const params = new URLSearchParams(window.location.search);
const filtroCategoriaURL = params.get("categoria");
const filtroMarcaURL = params.get("marca");


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

    // aplicar filtro si venía por URL
    if (filtroCategoriaURL) {
        select.value = filtroCategoriaURL;
    }
}


// ======================================================================
// CARGAR MARCAS
// ======================================================================
async function cargarMarcas() {
    const res = await fetch("http://localhost:3000/api/marcas");
    const marcas = await res.json();

    const select = document.getElementById("filtroMarcas");

    marcas.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id_marca;     // ✔ ahora es id_marca
        opt.textContent = m.nombre;
        select.appendChild(opt);
    });

    if (filtroMarcaURL) {
        select.value = filtroMarcaURL;
    }
}


// ======================================================================
// CARGAR PRODUCTOS (con filtros)
// ======================================================================
async function cargarProductos() {

    const categoria = document.getElementById("filtroCategorias").value;
    const marca = document.getElementById("filtroMarcas").value;
    const precio = document.getElementById("filtroPrecio").value;

    let url = "http://localhost:3000/api/productos?";

    if (categoria) url += `categorias=${categoria}&`;
    if (marca) url += `marcas=${marca}&`; // ✔ ahora coincide con backend
    if (precio) url += `precio=${precio}&`;

    const res = await fetch(url);
    const productos = await res.json();

    const div = document.getElementById("productos");
    div.innerHTML = "";

    productos.forEach(prod => {

        const imagenUrl = prod.imagen_producto.startsWith("/")
            ? "http://localhost:3000" + prod.imagen_producto
            : "http://localhost:3000/" + prod.imagen_producto;

        div.innerHTML += `
            <div class="card">
                <div class="img-container">
                    <img src="${imagenUrl}">
                    <button class="btn-detalles" onclick="verDetalles(${prod.id_producto})">
                        Ver detalles
                    </button>
                </div>

                <p class="tipo">Categoría:</strong> ${prod.nombre_categoria}</p>
                <h3>${prod.nombre}</h3>
                <p class="precio">${formatearCOP(Number(prod.precio))}</p>
            </div>
        `;
    });
}


// ======================================================================
// IR AL DETALLE
// ======================================================================
function verDetalles(id) {
    window.location.href = "producto_detalle.html?id=" + id;
}


// ======================================================================
// EJECUTAR TODO AL INICIO
// ======================================================================
window.onload = async () => {
    await cargarCategorias();
    await cargarMarcas();
    cargarProductos();
};

// ======================================================================
// IR AL DETALLE
// ======================================================================
function verDetalles(id) {
    window.location.href = "producto_detalle.html?id=" + id;
}

// ======================================================================
// LIMPIAR EL FILTRO
// ======================================================================
function limpiarFiltros() {

    // Reiniciar selects
    document.getElementById("filtroCategorias").value = "";
    document.getElementById("filtroMarcas").value = "";
    document.getElementById("filtroPrecio").value = "";

    // Quitar parámetros de la URL (muy importante)
    window.history.replaceState({}, document.title, "productos_cliente.html");

    // Recargar todos los productos SIN filtros
    cargarProductos();
}
