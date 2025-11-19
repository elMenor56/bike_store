// importamos la conexión a la base de datos
const db = require("../config/db");

// ========================
// CREAR UN PEDIDO
// ========================
exports.crearPedido = async (req, res) => {

  // sacamos el id del cliente desde el token
  const id_cliente = req.cliente?.id_cliente;

  // si no hay id_cliente significa que no está logueado
  if (!id_cliente) {
    return res.status(401).json({ mensaje: "Debes iniciar sesión para realizar un pedido" });
  }

  // extraemos los items que vienen desde el frontend
  // items = [{ id_producto: 1, cantidad: 2 }, ...]
  const { items } = req.body;

  // validamos que vengan items
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ mensaje: "Debes enviar al menos un producto en el pedido" });
  }

  // abrimos una conexión dedicada para hacer transacción
  const connection = await db.getConnection();

  try {
    // iniciamos transacción
    await connection.beginTransaction();

    let totalPedido = 0; // variable para ir sumando el valor total

    // recorremos cada producto del pedido
    for (const item of items) {

      // consultamos el precio del producto en la BD
      const [prodRows] = await connection.query(
        "SELECT precio FROM producto WHERE id_producto = ?",
        [item.id_producto]
      );

      // si no existe, error
      if (prodRows.length === 0) {
        throw new Error(`El producto con ID ${item.id_producto} no existe`);
      }

      // precio del producto
      const precioUnitario = parseFloat(prodRows[0].precio);

      // sumamos al total del pedido
      totalPedido += precioUnitario * item.cantidad;
    }

    // insertamos el pedido principal
    const [pedidoResult] = await connection.query(
      "INSERT INTO pedido (id_cliente, total_pedido) VALUES (?, ?)",
      [id_cliente, totalPedido]
    );

    // extraemos el ID del pedido recién creado
    const id_pedido = pedidoResult.insertId;

    // insertamos cada detalle (líneas del pedido)
    for (const item of items) {

      // consultamos el precio de nuevo para guardar el valor exacto al momento
      const [prodRows] = await connection.query(
        "SELECT precio FROM producto WHERE id_producto = ?",
        [item.id_producto]
      );

      const precioUnitario = parseFloat(prodRows[0].precio);

      await connection.query(
        `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio)
          VALUES (?, ?, ?, ?)`,
        [id_pedido, item.id_producto, item.cantidad, precioUnitario]
      );
    }

    // si todo está bien, guardamos los cambios
    await connection.commit();

    // respuesta final
    res.status(201).json({
      mensaje: "Pedido creado exitosamente",
      id_pedido,
      total_pedido: totalPedido
    });

  } catch (error) {
    // si ocurre algún error, revertimos la transacción
    await connection.rollback();
    console.log("Error en crearPedido:", error);
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  } finally {
    // liberamos la conexión
    connection.release();
  }
};
