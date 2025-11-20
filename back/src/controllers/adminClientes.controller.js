// =======================================================
// CONTROLADOR DE CLIENTES PARA EL ADMIN
// =======================================================

// importamos base de datos
const db = require("../config/db");

// ==========================================
// OBTENER TODOS LOS CLIENTES
// ==========================================
exports.obtenerClientes = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id_cliente, nombre, email, telefono, direccion
            FROM cliente
            ORDER BY id_cliente DESC
        `);

        return res.json(rows);

    } catch (error) {
        console.log("Error en obtenerClientes:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// ==========================================
// CUÁNTOS CLIENTES HAY
// ==========================================
exports.contarClientes = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT COUNT(*) AS total_clientes FROM cliente
        `);

        return res.json(rows[0]);

    } catch (error) {
        console.log("Error en contarClientes:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// ==========================================
// INFORMACIÓN COMPLETA DE UN CLIENTE + SUS PEDIDOS
// ==========================================
exports.obtenerClientePorId = async (req, res) => {

    // sacamos id de la URL
    const { id } = req.params;

    try {
        // buscamos al cliente
        const [clienteRows] = await db.query(`
            SELECT id_cliente, nombre, email, telefono, direccion
            FROM cliente
            WHERE id_cliente = ?
        `, [id]);

        if (clienteRows.length === 0) {
            return res.status(404).json({ mensaje: "Cliente no existe" });
        }

        // buscamos sus pedidos
        const [pedidos] = await db.query(`
            SELECT id_pedido, fecha_pedido, total_pedido, estado
            FROM pedido
            WHERE id_cliente = ?
            ORDER BY fecha_pedido DESC
        `, [id]);

        return res.json({
            cliente: clienteRows[0],
            pedidos: pedidos
        });

    } catch (error) {
        console.log("Error en obtenerClientePorId:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// ===============================================
// OBTENER PEDIDOS DE UN CLIENTE (ADMIN)
// ===============================================
exports.obtenerPedidosCliente = async (req, res) => {

    // sacamos id del cliente vía params
    const id_cliente = req.params.id;

    try {
        // buscamos pedidos del cliente
        const [pedidos] = await db.query(`
            SELECT id_pedido, fecha_pedido, total_pedido, estado
            FROM pedido
            WHERE id_cliente = ?
            ORDER BY fecha_pedido DESC
        `, [id_cliente]);

        let respuesta = [];

        // por cada pedido traemos los productos
        for (const p of pedidos) {
            // detalles del pedido
            const [detalles] = await db.query(`
                SELECT dp.cantidad, dp.precio,
                        pr.nombre AS nombre_producto
                FROM detalle_pedido dp
                INNER JOIN producto pr ON pr.id_producto = dp.id_producto
                WHERE dp.id_pedido = ?
            `, [p.id_pedido]);

            // agregamos detalle a la respuesta
            respuesta.push({
                ...p,
                detalles
            });
        }

        // enviamos pedidos al admin
        return res.json(respuesta);

    } catch (error) {
        console.log("Error al obtener pedidos:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};