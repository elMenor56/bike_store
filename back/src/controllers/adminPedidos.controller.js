// importamos base de datos
const db = require("../config/db");

// ===============================================
// OBTENER TODOS LOS PEDIDOS
// ===============================================
exports.obtenerTodosLosPedidos = async (req, res) => {
    try {
        // sacamos todos los pedidos
        const [rows] = await db.query(`
            SELECT p.id_pedido, p.fecha_pedido, p.total_pedido, p.estado,
                   c.nombre AS nombre_cliente, c.email
            FROM pedido p
            INNER JOIN cliente c ON c.id_cliente = p.id_cliente
            ORDER BY p.fecha_pedido DESC
        `);

        return res.json(rows);

    } catch (error) {
        console.log("Error obtenerTodosLosPedidos:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// ===============================================
// OBTENER UN PEDIDO POR ID + PRODUCTOS
// ===============================================
exports.obtenerPedidoPorId = async (req, res) => {

    // obtenemos id de la URL
    const { id } = req.params;

    try {
        // buscar el pedido principal
        const [pedidoRows] = await db.query(`
            SELECT p.*, c.nombre AS nombre_cliente
            FROM pedido p
            INNER JOIN cliente c ON c.id_cliente = p.id_cliente
            WHERE id_pedido = ?
        `, [id]);

        if (pedidoRows.length === 0) {
            return res.status(404).json({ mensaje: "Pedido no existe" });
        }

        // buscar productos dentro del pedido
        const [detalles] = await db.query(`
            SELECT dp.cantidad, dp.precio,
                   pr.nombre, pr.descripcion
            FROM detalle_pedido dp
            INNER JOIN producto pr ON pr.id_producto = dp.id_producto
            WHERE dp.id_pedido = ?
        `, [id]);

        return res.json({
            pedido: pedidoRows[0],
            detalles: detalles
        });

    } catch (error) {
        console.log("Error obtenerPedidoPorId:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// ===============================================
// CAMBIAR ESTADO DE UN PEDIDO
// ===============================================
exports.cambiarEstadoPedido = async (req, res) => {

    // id del pedido
    const { id } = req.params;

    // nuevo estado enviado por el admin
    const { estado } = req.body;

    try {
        // validamos estado permitido
        const validos = ["Pendiente", "Pagado", "Enviado", "Entregado", "Cancelado"];

        if (!validos.includes(estado)) {
            return res.status(400).json({ mensaje: "Estado inválido" });
        }

        // actualizamos estado
        await db.query(`
            UPDATE pedido SET estado = ?
            WHERE id_pedido = ?
        `, [estado, id]);

        return res.json({ mensaje: "Estado actualizado correctamente" });

    } catch (error) {
        console.log("Error cambiarEstadoPedido:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};
