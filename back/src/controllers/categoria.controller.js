// Importamos la conexión a la BD (pool)
const db = require("../config/db");

// ============================================
// CREAR UNA CATEGORÍA (con validación anti-duplicados)
// ============================================
const crearCategoria = async (req, res) => {

    // 1. Extraemos el nombre enviado por el admin
    const { nombre } = req.body;

    // 2. Validamos que haya nombre
    if (!nombre) {
        return res.status(400).json({ mensaje: "El nombre de la categoría es obligatorio" });
    }

    try {
        // 3. Verificar si ya existe una categoría con ese nombre
        const [existe] = await db.query(
            "SELECT * FROM categoria WHERE nombre = ?",
            [nombre]
        );

        // 4. Si existe, mandamos un error
        if (existe.length > 0) {
            return res.status(400).json({ mensaje: "La categoría ya existe" });
        }

        // 5. Insertar la nueva categoría
        const [resultado] = await db.query(
            "INSERT INTO categoria (nombre) VALUES (?)",
            [nombre]
        );

        // 6. Respuesta si todo sale bien
        return res.status(201).json({
            mensaje: "Categoría creada correctamente",
            id_categoria: resultado.insertId
        });

    } catch (error) {
        console.log("Error al crear categoría:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};



// ============================================
// OBTENER TODAS LAS CATEGORÍAS
// ============================================
const obtenerCategorias = async (req, res) => {
    try {
        const [filas] = await db.query("SELECT * FROM categoria");
        return res.status(200).json(filas);

    } catch (error) {
        console.log("Error al obtener categorías:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};



// ============================================
// ACTUALIZAR UNA CATEGORÍA
// ============================================
const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ mensaje: "El nombre es obligatorio" });
    }

    try {
        // Verificamos si ya existe otra categoría con ese nombre
        const [existe] = await db.query(
            "SELECT * FROM categoria WHERE nombre = ? AND id_categoria != ?",
            [nombre, id]
        );

        if (existe.length > 0) {
            return res.status(400).json({ mensaje: "Ese nombre ya está siendo usado por otra categoría" });
        }

        // Hacemos el update
        await db.query(
            "UPDATE categoria SET nombre = ? WHERE id_categoria = ?",
            [nombre, id]
        );

        return res.status(200).json({ mensaje: "Categoría actualizada correctamente" });

    } catch (error) {
        console.log("Error al actualizar categoría:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};



// ============================================
// ELIMINAR UNA CATEGORÍA
// ============================================
const eliminarCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM categoria WHERE id_categoria = ?", [id]);
        return res.status(200).json({ mensaje: "Categoría eliminada correctamente" });

    } catch (error) {
        console.log("Error al eliminar categoría:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};



// Exportamos las funciones para las rutas
module.exports = {
    crearCategoria,
    obtenerCategorias,
    actualizarCategoria,
    eliminarCategoria
};
