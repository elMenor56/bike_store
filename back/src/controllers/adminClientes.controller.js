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
