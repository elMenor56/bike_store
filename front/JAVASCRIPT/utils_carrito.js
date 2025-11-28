// =====================================================
// AGREGAR PRODUCTO AL CARRITO
// =====================================================
function agregarAlCarrito(prod) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let existente = carrito.find(item => item.id_producto === prod.id_producto);

    if (existente) {

        // Evitar superar el stock
        if (existente.cantidad < prod.stock) {
            existente.cantidad += 1;
        } else {
            alert("No puedes agregar más unidades. Stock máximo alcanzado.");
            return;
        }

    } else {

        carrito.push({
            id_producto: prod.id_producto,
            nombre: prod.nombre,
            precio: prod.precio,
            imagen: prod.imagen_producto,
            cantidad: prod.cantidad,
            stock: prod.stock     //Guardamos el stock EN EL CARRITO
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito 🛒");
}
