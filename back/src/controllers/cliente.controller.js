// ================================================
// CONTROLADOR DE CLIENTE (CLIENTE NORMAL)
// ================================================

// importamos la base de datos
const db = require("../config/db");

// ================================================
// OBTENER PERFIL DEL CLIENTE LOGUEADO
// ================================================
exports.obtenerPerfil = async (req, res) => {
    
    // sacamos el id_cliente del token
    const id_cliente = req.cliente?.id_cliente;

    // si no existe, no está autenticado
    if (!id_cliente) {
        return res.status(401).json({ mensaje: "Debes iniciar sesión" });
    }

    try {
        // buscamos al cliente en la base de datos
        const [rows] = await db.query(`
            SELECT id_cliente, nombre, email, telefono, direccion
            FROM cliente
            WHERE id_cliente = ?
        `, [id_cliente]);

        // si no existe, error
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        // devolvemos su información
        return res.json(rows[0]);

    } catch (error) {
        console.log("Error en obtenerPerfil:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// ================================================
// EDITAR PERFIL DEL CLIENTE (SIN MODIFICAR EMAIL)
// ================================================
exports.editarPerfil = async (req, res) => {

    // sacamos id del token
    const id_cliente = req.cliente?.id_cliente;

    // si no está autenticado
    if (!id_cliente) {
        return res.status(401).json({ mensaje: "Debes iniciar sesión" });
    }

    // recibimos campos del body
    const { nombre, telefono, direccion } = req.body;

    try {
        // validación básica
        if (!nombre) {
            return res.status(400).json({ mensaje: "El nombre es obligatorio" });
        }

        // actualizamos solo valores permitidos
        await db.query(`
            UPDATE cliente
            SET nombre = ?, telefono = ?, direccion = ?
            WHERE id_cliente = ?
        `, [nombre, telefono || null, direccion || null, id_cliente]);

        return res.json({ ok: true, mensaje: "Perfil actualizado correctamente" });

    } catch (error) {
        console.log("Error en editarPerfil:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};