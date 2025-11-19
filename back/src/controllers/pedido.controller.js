// importamos la conexión a la BD
const db = require("../config/db");

// ======================================
//    CREAR UN PEDIDO
// ======================================
exports.crearPedido = async (req, res) => {

  // sacamos el id del cliente desde el token
  const id_cliente = req.cliente?.id_cliente;

  // si no existe, entonces no está logueado
  if (!id_cliente) {
    return res.status(401).json({ mensaje: "Debes iniciar sesión para realizar un pedido" });
  }

  // items = [{ id_producto: 1, cantidad: 2 }, ...]
  const { items } = req.body;

  // verificamos que items exista
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ mensaje: "Debes enviar productos en el pedido" });
  }

  // obtenemos conexión para comenzar transacción
  const connection = await db.getConnection();

  try {
    // iniciamos la transacción
    await connection.beginTransaction();

    let totalPedido = 0; // acumulador del total

    // recorremos los productos enviados
    for (const item of items) {

      // obtenemos el precio real desde la BD
      const [prod] = await connection.query(
        "SELECT precio FROM producto WHERE id_producto = ?",
        [item.id_producto]
      );

      // si no existe el producto → error
      if (prod.length === 0) {
        throw new Error(`El producto con ID ${item.id_producto} no existe`);
      }

      const precioUnit = parseFloat(prod[0].precio);

      // sumamos al total
      totalPedido += precioUnit * item.cantidad;
    }

    // creamos el registro del pedido
    const [pedido] = await connection.query(
      "INSERT INTO pedido (id_cliente, total_pedido) VALUES (?, ?)",
      [id_cliente, totalPedido]
    );

    const id_pedido = pedido.insertId;

    // guardamos los detalles del pedido
    for (const item of items) {

      // obtenemos precio actualizado del producto
      const [prod] = await connection.query(
        "SELECT precio FROM producto WHERE id_producto = ?",
        [item.id_producto]
      );

      const precioUnit = parseFloat(prod[0].precio);

      // insertamos el detalle
      await connection.query(
        `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio)
         VALUES (?, ?, ?, ?)`,
        [id_pedido, item.id_producto, item.cantidad, precioUnit]
      );
    }

    // confirmamos cambios
    await connection.commit();

    return res.status(201).json({
      mensaje: "Pedido creado exitosamente",
      id_pedido,
      total_pedido: totalPedido
    });

  } catch (error) {

    await connection.rollback();
    console.log("Error en crearPedido:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor",
      error: error.message
    });

  } finally {
    connection.release();
  }
};



// ========================================
//    OBTENER HISTORIAL DEL CLIENTE
// ========================================
exports.obtenerPedidosCliente = async (req, res) => {
  try {
    // id del cliente desde el token
    const id_cliente = req.cliente?.id_cliente;

    if (!id_cliente) {
      return res.status(401).json({ mensaje: "Debes iniciar sesión" });
    }

    // obtenemos los pedidos del cliente
    const [pedidos] = await db.query(
      `SELECT id_pedido, fecha_pedido, total_pedido, estado
       FROM pedido
       WHERE id_cliente = ?
       ORDER BY fecha_pedido DESC`,
      [id_cliente]
    );

    // si no tiene pedidos devolvemos una lista vacía
    if (pedidos.length === 0) {
      return res.json({ pedidos: [] });
    }

    // aquí guardaremos la respuesta final
    const resultado = [];

    for (const p of pedidos) {

      // obtenemos los detalles
      const [detalles] = await db.query(
        `SELECT dp.id_detalle_pedido, dp.cantidad, dp.precio,
                pr.nombre AS nombre_producto
          FROM detalle_pedido dp
          INNER JOIN producto pr ON pr.id_producto = dp.id_producto
          WHERE dp.id_pedido = ?`,
        [p.id_pedido]
      );

      resultado.push({
        ...p,
        detalles
      });
    }

    return res.json({ pedidos: resultado });

  } catch (error) {
    console.log("Error en obtenerPedidosCliente:", error);
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
