// ELEMENTO DEL BOTÓN
const btn = document.getElementById("btnBicicletas");
const panel = document.getElementById("panelFiltros");

// Mostrar panel cuando el mouse entra al texto "Bicicletas"
btn.addEventListener("mouseenter", () => {
    panel.classList.add("panel-visible");
});

// Mantener visible mientras el mouse esté sobre el panel
panel.addEventListener("mouseenter", () => {
    panel.classList.add("panel-visible");
});

// Ocultar cuando salga del botón y del panel
btn.addEventListener("mouseleave", () => {
    setTimeout(() => {
        if (!panel.matches(":hover")) {
            panel.classList.remove("panel-visible");
        }
    }, 150);
});

panel.addEventListener("mouseleave", () => {
    panel.classList.remove("panel-visible");
});

// ========================================
// CARGAR CATEGORÍAS DESDE BACKEND
// ========================================
async function cargarCategorias() {
    const res = await fetch("http://localhost:3000/api/categorias");
    const categorias = await res.json();
    const ul = document.getElementById("listaCategorias");

    categorias.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat.nombre;
        li.style.cursor = "pointer";

        li.onclick = () => {
            window.location.href = `../productos_cliente.html?categoria=${cat.id_categoria}`;
        };

        ul.appendChild(li);
    });
}

// ========================================
// CARGAR MARCAS DESDE BACKEND
// ========================================
async function cargarMarcas() {
    const res = await fetch("http://localhost:3000/api/marcas");
    const marcas = await res.json();
    const ul = document.getElementById("listaMarcas");

    marcas.forEach(m => {
        const li = document.createElement("li");
        li.textContent = m.nombre;
        li.style.cursor = "pointer";

        li.onclick = () => {
            window.location.href = `../productos_cliente.html?marca=${m.id_marca}`;
        };

        ul.appendChild(li);
    });
}

cargarCategorias();
cargarMarcas();
