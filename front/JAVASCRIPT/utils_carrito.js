// =====================================================
// AGREGAR PRODUCTO AL CARRITO (FUNCIONAL Y GLOBAL)
// =====================================================
function agregarAlCarrito(prod) {

    // Obtengo el carrito actual
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verifico si ya existe
    let existente = carrito.find(item => item.id_producto === prod.id_producto);

    if (existente) {
        // si ya existe → aumentar cantidad
        existente.cantidad += 1;
    } else {
        // si es nuevo → agregarlo
        carrito.push({
            id_producto: prod.id_producto,
            nombre: prod.nombre,
            precio: prod.precio,
            imagen: prod.imagen_producto,  // clave final correcta
            cantidad: prod.cantidad
        });
    }

    // Guardar carrito
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito 🛒");
}
