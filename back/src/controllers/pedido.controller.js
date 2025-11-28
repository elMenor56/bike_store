// Importamos la conexión a la BD (pool)
const db = require("../config/db");

exports.crearPedido = async (req, res) => {
  try {
    const id_cliente = req.cliente?.id_cliente;

    if (!id_cliente) {
      return res.status(401).json({ mensaje: "Debes iniciar sesión" });
    }

    const {
      nombre,
      correo,
      telefono,
      direccion,
      total_pagar,
      productos
    } = req.body;

    if (!nombre || !correo || !telefono || !direccion) {
      return res.status(400).json({ mensaje: "Faltan datos del cliente" });
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: "Debes enviar productos" });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    let totalBackend = 0;

    for (const item of productos) {
      const [prodRows] = await connection.query(
        "SELECT precio, stock FROM producto WHERE id_producto = ? FOR UPDATE",
        [item.id_producto]
      );

      if (prodRows.length === 0) throw new Error(`Producto ID ${item.id_producto} no existe`);

      const { precio, stock } = prodRows[0];

      if (stock < item.cantidad) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          mensaje: `Stock insuficiente para el producto ID ${item.id_producto}. Solo quedan ${stock}`
        });
      }

      totalBackend += precio * item.cantidad;
    }

    // validar total del frontend (opcional pero recomendado)
    if (total_pagar != null && Number(total_pagar) !== totalBackend) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ mensaje: "El total enviado no coincide con el calculado" });
    }

    const [pedidoResult] = await connection.query(
      `INSERT INTO pedido (
        id_cliente, nombre, correo, telefono, direccion, total_pedido
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [id_cliente, nombre, correo, telefono, direccion, totalBackend]
    );

    const id_pedido = pedidoResult.insertId;

    for (const item of productos) {
      const [prodRows] = await connection.query(
        "SELECT precio, stock FROM producto WHERE id_producto = ?",
        [item.id_producto]
      );

      const precioUnit = prodRows[0].precio;

      await connection.query(
        `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio)
         VALUES (?, ?, ?, ?)`,
        [id_pedido, item.id_producto, item.cantidad, precioUnit]
      );

      // descontar stock
      await connection.query(
        "UPDATE producto SET stock = stock - ? WHERE id_producto = ?",
        [item.cantidad, item.id_producto]
      );
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      mensaje: "Pedido creado correctamente",
      id_pedido,
      total_confirmado: totalBackend
    });

  } catch (error) {
    console.log("Error en crearPedido:", error);
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
};



// ========================================
//    OBTENER HISTORIAL DEL CLIENTE
// ========================================
exports.obtenerPedidosCliente = async (req, res) => {
  try {
    const id_cliente = req.cliente?.id_cliente;

    if (!id_cliente) {
      return res.status(401).json({ mensaje: "Debes iniciar sesión" });
    }

    // obtener pedidos del cliente
    const [pedidos] = await db.query(
      `SELECT id_pedido, fecha_pedido, total_pedido, estado,
              nombre, correo, telefono, direccion
       FROM pedido
       WHERE id_cliente = ?
       ORDER BY fecha_pedido DESC`,
      [id_cliente]
    );

    // si no hay pedidos → devolver vacío
    if (pedidos.length === 0) {
      return res.json({ pedidos: [] });
    }

    const resultado = [];

    // recorremos pedidos y obtenemos sus detalles
    for (const p of pedidos) {
      const [detalles] = await db.query(
        `SELECT dp.id_detalle_pedido, dp.cantidad, dp.precio,
                pr.nombre AS nombre_producto, pr.imagen_producto
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

