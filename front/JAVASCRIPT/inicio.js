document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
       SELECTORES
  ========================================================== */
  const filtroTrigger = document.getElementById("filtroTrigger");
  const filtroMenu = document.getElementById("filtroMenu");
  const listaCategorias = document.getElementById("listaCategorias");
  const listaMarcas = document.getElementById("listaMarcas");

  const userBtn = document.getElementById("userSesionBtn");
  const sidePanel = document.getElementById("sidePanel");
  const closeSide = document.getElementById("closeSide");

  const panelLogin = document.getElementById("panelLogin");
  const panelRegister = document.getElementById("panelRegister");
  const panelRecover = document.getElementById("panelRecover");

  const goRegister = document.getElementById("goRegister");
  const goRecover = document.getElementById("goRecover");
  const backReg = document.getElementById("backToLoginFromReg");
  const backRec = document.getElementById("backToLoginFromRec");

  const cartBtn = document.getElementById("cartBtn");
  const sideCart = document.getElementById("sideCart");
  const closeCart = document.getElementById("closeCart");

  const searchInput = document.getElementById("searchInput");
  const searchList = document.getElementById("searchList");
  const carritoItems = document.getElementById("carritoItems");
  const totalCarrito = document.getElementById("totalCarrito");

  const API_CATS = "http://localhost:3000/api/categorias";
  const API_MARCAS = "http://localhost:3000/api/marcas";
  const API_PRODUCTOS = "http://localhost:3000/api/productos";

  /* ==========================================================
       MENÚ BICICLETAS
  ========================================================== */
  filtroTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    filtroMenu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!filtroTrigger.contains(e.target)) {
      filtroMenu.classList.remove("show");
    }
  });

  /* ==========================================================
       CARGAR CATEGORÍAS Y MARCAS
  ========================================================== */
  async function cargarFiltros() {
    const r1 = await fetch(API_CATS);
    const r2 = await fetch(API_MARCAS);

    const cats = await r1.json();
    const mar = await r2.json();

    listaCategorias.innerHTML = cats.map(c =>
      `<li data-id="${c.id_categoria}">${c.nombre}</li>`).join("");

    listaMarcas.innerHTML = mar.map(m =>
      `<li data-id="${m.id_marca}">${m.nombre}</li>`).join("");

    listaCategorias.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () =>
        window.location.href = `/front/productos_detalle.html?categoria=${li.dataset.id}`);
    });

    listaMarcas.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () =>
        window.location.href = `/front/productos_detalle.html?marca=${li.dataset.id}`);
    });
  }
  cargarFiltros();

  /* ==========================================================
       SIDE PANEL LOGIN
  ========================================================== */
  function openSide() {
    sidePanel.classList.add("open");
  }

  function closeSidePanel() {
    sidePanel.classList.remove("open");
  }

  userBtn.addEventListener("click", openSide);
  closeSide.addEventListener("click", closeSidePanel);

  /* cerrar si clic afuera */
  document.addEventListener("click", (e) => {
    if (!sidePanel.contains(e.target) && !userBtn.contains(e.target)) {
      closeSidePanel();
    }
  });

  /* ==========================================================
       CAMBIO ENTRE PANEL INTERNO (LOGIN-REGISTER-RECOVER)
  ========================================================== */
  function mostrarPanel(panel) {
    panelLogin.classList.add("hidden");
    panelRegister.classList.add("hidden");
    panelRecover.classList.add("hidden");

    panel.classList.remove("hidden");
  }

  goRegister.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarPanel(panelRegister);
  });

  goRecover.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarPanel(panelRecover);
  });

  backReg.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarPanel(panelLogin);
  });

  backRec.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarPanel(panelLogin);
  });

  /* ==========================================================
       PANEL CARRITO
  ========================================================== */
  function openCart() {
    sideCart.classList.add("open");
    renderCarrito();
  }

  function closeCartPanel() {
    sideCart.classList.remove("open");
  }

  cartBtn.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartPanel);

  function renderCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoItems.innerHTML = "";

    if (carrito.length === 0) {
      carritoItems.innerHTML = "<p>Tu carrito está vacío</p>";
      totalCarrito.textContent = "TOTAL: $0";
      return;
    }

    let total = 0;

    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      carritoItems.innerHTML += `
        <div>
          <strong>${item.nombre}</strong><br>
          Cantidad: ${item.cantidad}<br>
          Subtotal: $${subtotal}
          <hr>
        </div>
      `;
    });

    totalCarrito.textContent = "TOTAL: $" + total;
  }

  /* ==========================================================
       BUSCADOR
  ========================================================== */
  searchInput.addEventListener("input", async () => {
    const q = searchInput.value.trim();

    if (!q) {
      searchList.style.display = "none";
      return;
    }

    const res = await fetch(`${API_PRODUCTOS}?q=${q}`);
    const data = await res.json();

    searchList.innerHTML = data
      .slice(0, 8)
      .map(p => `<li data-id="${p.id_producto}">${p.nombre}</li>`)
      .join("");

    searchList.style.display = "block";

    searchList.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () => {
        window.location.href = `/front/producto_detalle.html?id=${li.dataset.id}`;
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!document.getElementById("searchContainer").contains(e.target)) {
      searchList.style.display = "none";
    }
  });

});
