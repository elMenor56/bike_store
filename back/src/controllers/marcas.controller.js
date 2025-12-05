const db = require("../config/db");

// Obtener todas las marcas
exports.obtenerMarcas = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM marca");
    res.json(rows);
};

// Crear marca
exports.crearMarca = async (req, res) => {
    const { nombre } = req.body;

    await db.query("INSERT INTO marca (nombre) VALUES (?)", [nombre]);

    res.json({ mensaje: "Marca creada correctamente" });
};

// Actualizar marca
exports.actualizarMarca = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    await db.query("UPDATE marca SET nombre = ? WHERE id_marca = ?", [nombre, id]);

    res.json({ mensaje: "Marca actualizada correctamente" });
};

// Eliminar marca
exports.eliminarMarca = async (req, res) => {
    const { id } = req.params;

    await db.query("DELETE FROM marca WHERE id_marca = ?", [id]);

    res.json({ mensaje: "Marca eliminada correctamente" });
};
