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

    // detectar si no hay stock
    const sinStock = prod.stock === 0;

    function actualizarBotones() {
        const btnSumar = document.getElementById("btnSumar");

            // Si ya llegó al stock máximo → desactivar visualmente SUMAR
            if (cantidad >= prod.stock) {
                btnSumar.classList.add("disabled-btn");
            } else {
                btnSumar.classList.remove("disabled-btn");
            }
        }



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

    const cantidadActual = document.getElementById("cantidadActual");

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

// Ejecutar carga inicial
cargarDetalle();
