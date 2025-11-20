const API = "http://localhost:3000/api/productos";

// ================================
// Cargar categorías
// ================================
async function cargarCategorias() {

    const res = await fetch("http://localhost:3000/api/categorias");
    const categorias = await res.json();

    const select = document.getElementById("filtroCategoria");

    select.innerHTML = `<option value="0">Todas las categorías</option>`;

    categorias.forEach(cat => {
        select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
    });
}

// ================================
// Cargar productos en cards
// ================================
async function cargarProductos() {

    const res = await fetch(API);
    const productos = await res.json();

    mostrarProductos(productos);
}

// ================================
// Filtrar por categoría
// ================================
async function filtrarPorCategoria() {

    const id_categoria = document.getElementById("filtroCategoria").value;

    const res = await fetch(API);
    const productos = await res.json();

    if (id_categoria == 0) {
        mostrarProductos(productos);
    } else {
        const filtrados = productos.filter(p => p.id_categoria == id_categoria);
        mostrarProductos(filtrados);
    }
}

// ================================
// Mostrar cards de productos
// ================================
async function mostrarProductos(lista) {

    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    for (const p of lista) {

        // Obtener imagen base64
        const resImg = await fetch(`${API}/${p.id_producto}`);
        const prod = await resImg.json();

        const img = prod.imagen_base64
            ? `<img src="data:image/jpeg;base64,${prod.imagen_base64}" width="180">`
            : "<div style='width:180px; height:180px; background:#eee;'></div>";

        contenedor.innerHTML += `
            <div style="border:1px solid #ccc; padding:10px; width:220px; border-radius:8px;">
                
                ${img}

                <h3>${p.nombre}</h3>
                <p><b>Precio:</b> $${p.precio}</p>
                <p><b>Categoría:</b> ${prod.nombre_categoria}</p>

                <button onclick="verDetalle(${p.id_producto})">
                    Ver detalles
                </button>
            </div>
        `;
    }
}

// ================================
// Ir a pantalla de detalle
// ================================
function verDetalle(id) {
    window.location.href = `producto_detalle.html?id=${id}`;
}
