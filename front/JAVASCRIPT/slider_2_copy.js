// =========================================
// slider2.js – Segundo slider (2 slides x 3 cards)
// =========================================

// URL base del backend
const URL_BASE_2 = "http://localhost:3000";

// Track del segundo slider
const sliderTrack2 = document.getElementById("sliderTrack2");

// Arreglo de productos del segundo slider
let productos2 = [];

// Contador del slide actual
let slideActual2 = 0;

// =============================================
// 1. Cargar productos desde el backend
// =============================================
async function cargarProductosSlider2() {
    try {
        const respuesta = await fetch(`${URL_BASE}/api/productos`);
        const productosBackend = await respuesta.json();

        // IDs de accesorios o productos que quieres mostrar EN EL SEGUNDO SLIDER
        // Aquí pon los 6 productos que deben aparecer
        const productosAccesorios = [12, 5, 6, 13, 15, 11]; // <-- AJUSTA ESTOS IDs

        // Filtrar SOLO esos
        productos2 = productosBackend.filter(prod =>
            productosAccesorios.includes(prod.id_producto)
        );

        // Limitar a 6 para crear 2 slides de 3 tarjetas
        productos2 = productos2.slice(0, 6);

        construirSlider2();
    } catch (error) {
        console.log("Error cargando productos slider 2:", error);
    }
}

// ==================================================
// 2. Construcción del segundo slider (3 cards por slide)
// ==================================================
function construirSlider2() {

    sliderTrack2.innerHTML = "";

    const cantidadSlides = Math.ceil(productos2.length / 3); // Debe dar 2

    for (let i = 0; i < cantidadSlides; i++) {

        const slide = document.createElement("div");
        slide.classList.add("slide");

        const productosSlide = productos2.slice(i * 3, i * 3 + 3);

        productosSlide.forEach(prod => {

            const imagenUrl = prod.imagen_producto.startsWith("/")
                ? URL_BASE + prod.imagen_producto
                : URL_BASE + "/" + prod.imagen_producto;

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
                <p class="precio">${formatearCOP(Number(prod.precio))}</p>

            `;

            slide.appendChild(card);
        });

        sliderTrack2.appendChild(slide);
    }
}

// ==================================================
// 3. Navegación circular del segundo slider
// ==================================================
function siguienteSlide2() {
    const totalSlides = sliderTrack2.children.length;
    slideActual2 = (slideActual2 + 1) % totalSlides;
    actualizarMovimiento2();
}

function anteriorSlide2() {
    const totalSlides = sliderTrack2.children.length;
    slideActual2 = (slideActual2 - 1 + totalSlides) % totalSlides;
    actualizarMovimiento2();
}

function actualizarMovimiento2() {
    const tamañoSlide = sliderTrack2.children[0].offsetWidth;
    sliderTrack2.style.transform = `translateX(-${slideActual2 * tamañoSlide}px)`;
}

// ==================================================
// 4. Eventos del segundo slider
// ==================================================
document.querySelector(".btn-next-2").addEventListener("click", siguienteSlide2);
document.querySelector(".btn-prev-2").addEventListener("click", anteriorSlide2);

// ==================================================
// 5. Cargar el segundo slider al iniciar
// ==================================================
cargarProductosSlider2();