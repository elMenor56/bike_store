// =========================================
// slider.js – Slider con transición circular
// =========================================

// detectar si es pantalla móvil
const esMobile = window.innerWidth <= 768;


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


    // desktop = 3 productos por slide
    // mobile = 1 producto por slide
    const productosPorSlide = esMobile ? 1 : 3;
    const cantidadSlides = Math.ceil(productos.length / productosPorSlide);


    for (let i = 0; i < cantidadSlides; i++) {

        const slide = document.createElement("div");
        slide.classList.add("slide");

        // Extraemos 3 productos por slide
        const productosSlide = productos.slice(
        i * productosPorSlide,
        i * productosPorSlide + productosPorSlide
        );

        productosSlide.forEach(prod => {

            // RUTA correcta para imágenes
            const imagenUrl = prod.imagen_producto.startsWith("/")
                ? URL_BASE + prod.imagen_producto
                : URL_BASE + "/" + prod.imagen_producto;

            // Card
            const card = document.createElement("div");
            card.classList.add("card");

            // En móvil, toda la card es clickeable
            if (esMobile) {
                card.style.cursor = "pointer";
                card.addEventListener("click", () => {
                    verDetalles(prod.id_producto);
                });
            }


            // En móvil NO se crea el botón
            // En desktop SÍ se crea
                card.innerHTML = `
                <div class="img-container">
                    <img src="${imagenUrl}">
                    ${!esMobile ? `
                    <button class="btn-detalles" onclick="verDetalles(${prod.id_producto})">
                        Ver detalles
                    </button>
                    ` : ``}
                </div>

        <p class="tipo">Categoria: ${prod.nombre_categoria}</p>
        <h3 class="nombre">${prod.nombre}</h3>
        <p class="precio">${formatearCOP(Number(prod.precio))}</p>
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
// 6. Ver detalles
// =============================================
function verDetalles(idProducto) {
    const token = localStorage.getItem("tokenCliente");

    if (token) {
        // Usuario logueado → detalle para clientes
        window.location.href = `/front/HTML/cliente_logueado/producto_detalle_cliente.html?id=${idProducto}`;
    } else {
        // Usuario NO logueado → detalle público
        window.location.href = `/front/HTML/cliente_sin_login/producto_detalle.html?id=${idProducto}`;
    }
}

