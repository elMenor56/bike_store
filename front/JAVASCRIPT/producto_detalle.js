// ===============================================
// 1. Obtener ID del producto desde la URL
// ===============================================
const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");


// ===============================================
// 2. Cargar detalles del producto desde backend
// ===============================================
async function cargarDetalle() {

    const res = await fetch("http://localhost:3000/api/productos/" + idProducto);
    const prod = await res.json();

    // corregir url de imagen
    const imagenUrl = prod.imagen_producto.startsWith("/")
        ? "http://localhost:3000" + prod.imagen_producto
        : "http://localhost:3000/" + prod.imagen_producto;

    const sinStock = prod.stock === 0;

    // ================================
    // Render de HTML
    // ================================
    document.getElementById("detalle-contenedor").innerHTML = `
        <div class="detalle-contenido">
            <img src="${imagenUrl}" class="img-detalle">
            
            <div class="detalle-acciones">
                <h3>${prod.nombre}</h3>
                <p class="envio">EL PRODUCTO SERÁ ENVIADO EN UN PLAZO DE 3 DÍAS</p>
                <p class="precio">${formatearCOP(Number(prod.precio))}</p>

                <p class="stock-detalle"><b>Stock disponible:</b> ${prod.stock}</p>

                <div class="cantidad-box">
                    <button id="btnRestar" class="btn-cant">-</button>
                    <span id="cantidadActual">1</span>
                    <button id="btnSumar" class="btn-cant">+</button>
                </div>

                <button id="btnAdd" ${sinStock ? "disabled" : ""}>
                    ${sinStock ? "Sin stock" : "Agregar al carrito"}
                </button>
            </div>
        </div>

        <div class="detalle-texto">
            <h3>Especificaciones:</h3>
            <p>${prod.descripcion}</p>
        </div>
    `;

    // ================================
    // MANEJO DE CANTIDAD
    // ================================
    let cantidad = 1;

    const btnSumar = document.getElementById("btnSumar");
    const btnRestar = document.getElementById("btnRestar");
    const cantidadActual = document.getElementById("cantidadActual");

    // ================================
    // Función para actualizar botones
    // ================================
    function actualizarBotones() {
        // Si no hay stock → bloquear sumar
        if (prod.stock === 0 || cantidad >= prod.stock) {
            btnSumar.disabled = true;
            btnSumar.classList.add("disabled-btn");
        } else {
            btnSumar.disabled = false;
            btnSumar.classList.remove("disabled-btn");
        }

        // No permitir bajar de 1
        if (cantidad <= 1) {
            btnRestar.disabled = true;
            btnRestar.classList.add("disabled-btn");
        } else {
            btnRestar.disabled = false;
            btnRestar.classList.remove("disabled-btn");
        }
    }

    // Primera actualización al cargar
    actualizarBotones();

    btnSumar.onclick = () => {
        if (cantidad < prod.stock) {
            cantidad++;
            cantidadActual.textContent = cantidad;
            actualizarBotones();
        }
    };

    btnRestar.onclick = () => {
        if (cantidad > 1) {
            cantidad--;
            cantidadActual.textContent = cantidad;
            actualizarBotones();
        }
    };

    // ================================
    // AGREGAR AL CARRITO
    // ================================
    document.getElementById("btnAdd").onclick = () => {

        if (cantidad > prod.stock) {
            alert("No puedes agregar más del stock disponible");
            return;
        }

        prod.cantidad = cantidad;
        agregarAlCarrito(prod);
    };
}

cargarDetalle();
