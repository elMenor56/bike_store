// =========================================
// slider.js – Slider con transición circular
// =========================================

// URL base del backend
const URL_BASE = "http://localhost:3000";

// Track donde van los slides
const sliderTrack = document.getElementById("sliderTrack");

// Arreglo donde se guardan los productos del backend
let productos = [];

// Contador del slide actual
let slideActual = 0;

// =============================================
// 1. Cargar productos desde el backend
// =============================================
async function cargarProductos() {
    try {
        const respuesta = await fetch(`${URL_BASE}/api/productos`);
        productos = await respuesta.json();

        // IDs de productos que quieres mostrar
        const productosDestacados = [7, 2, 9, 8, 3, 1, 4, 10, 14];

        // Se filtran SOLO esos
        productos = productos.filter(prod =>
            productosDestacados.includes(prod.id_producto)
        );

        construirSlider();
    } catch (error) {
        console.log("Error cargando productos:", error);
    }
}

// ==================================================
// 2. Construcción del slider (3 cards por slide)
// ==================================================
function construirSlider() {

    // Limpiamos el track
    sliderTrack.innerHTML = "";

    // Cantidad de slides (3 productos por slide)
    const cantidadSlides = Math.ceil(productos.length / 3);

    for (let i = 0; i < cantidadSlides; i++) {

        const slide = document.createElement("div");
        slide.classList.add("slide");

        // Extraemos 3 productos por slide
        const productosSlide = productos.slice(i * 3, i * 3 + 3);

        productosSlide.forEach(prod => {

            // RUTA correcta para imágenes
            const imagenUrl = prod.imagen_producto.startsWith("/")
                ? URL_BASE + prod.imagen_producto
                : URL_BASE + "/" + prod.imagen_producto;

            // Card
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <div class="img-container">
                    <img src="${imagenUrl}">
                    <button class="btn-detalles" onclick="verDetalles(${prod.id_producto})">
                        Ver detalles
                    </button>
                </div>

                <p class="tipo">Categoria: ${prod.nombre_categoria}</p>
                <h3 class="nombre">${prod.nombre}</h3>
                <p class="precio">$${prod.precio}</p>

                
            `;

            slide.appendChild(card);
        });

        sliderTrack.appendChild(slide);
    }
}

// ==================================================
// 3. Slider: navegación circular (loop)
// ==================================================
function siguienteSlide() {
    const totalSlides = sliderTrack.children.length;

    // Si está en el último → vuelve al primero
    slideActual = (slideActual + 1) % totalSlides;

    actualizarMovimiento();
}

function anteriorSlide() {
    const totalSlides = sliderTrack.children.length;

    // Si está en el primero → va al último
    slideActual = (slideActual - 1 + totalSlides) % totalSlides;

    actualizarMovimiento();
}

// Mueve el track visualmente
function actualizarMovimiento() {
    const tamañoSlide = sliderTrack.children[0].offsetWidth;
    sliderTrack.style.transform = `translateX(-${slideActual * tamañoSlide}px)`;
}

// ==================================================
// 4. Eventos de las flechas
// ==================================================
document.querySelector(".btn-next").addEventListener("click", siguienteSlide);
document.querySelector(".btn-prev").addEventListener("click", anteriorSlide);

// ==================================================
// 5. Cargar el slider al iniciar
// ==================================================
cargarProductos();

// =============================================
// 6. Ver detalles (temporal)
// =============================================
function verDetalles(idProducto) {
    window.location.href = `/front/producto_detalle.html?id=${idProducto}`;
}
