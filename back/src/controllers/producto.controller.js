// ============================================================================
// Importamos la conexión a la base de datos (pool con promesas)
// ============================================================================
const db = require('../config/db');


// ============================================================================
// =========================   CREAR PRODUCTO   ================================
// ============================================================================
// Este método crea un producto nuevo y guarda la imagen en /uploads
// También valida precio, categoría e imagen
// ============================================================================
const crearProducto = async (req, res) => {

    try {
        // Sacamos los datos enviados desde el formulario
        const { nombre, descripcion, precio, id_categoria, marca } = req.body;

        // Validamos que los datos obligatorios existan
        if (!nombre || !precio || !id_categoria || !marca) {
            return res.status(400).json({ mensaje: "nombre, precio, marca e id_categoria son obligatorios" });
        }

        // Convertimos el precio a número para validar que sea válido
        const precioNum = parseFloat(precio);

        // Revisamos si el precio es incorrecto
        if (isNaN(precioNum) || precioNum <= 0) {
            return res.status(400).json({ mensaje: "El precio debe ser mayor que 0" });
        }

        // Validamos que la categoría exista
        const [catRows] = await db.query(
            "SELECT id_categoria FROM categoria WHERE id_categoria = ?",
            [id_categoria]
        );

        if (catRows.length === 0) {
            return res.status(400).json({ mensaje: "La categoría no existe" });
        }

        // Validamos que haya una imagen subida
        if (!req.file) {
            return res.status(400).json({ mensaje: "Debes subir una imagen del producto" });
        }

        // Creamos la ruta que se guardará en la base de datos
        const rutaImagen = "/uploads/" + req.file.filename;

        // Armamos el SQL para insertar un nuevo producto
        const sql = `
            INSERT INTO producto (id_categoria, nombre, descripcion, precio, marca, imagen_producto)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Ejecutamos el query
        const [result] = await db.query(sql, [
            id_categoria,
            nombre,
            descripcion || null,
            precioNum,
            marca,
            rutaImagen
        ]);

        // Si todo salió bien enviamos la respuesta
        return res.status(201).json({
            mensaje: "Producto creado correctamente",
            id_producto: result.insertId
        });

    } catch (error) {
        console.log("Error en crearProducto:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};




// ============================================================================
// ======================   OBTENER LISTA DE PRODUCTOS   =======================
// ============================================================================
// Este método permite filtrar por:
// - Categorías
// - Marcas
// - Rangos de precio
// ============================================================================
const obtenerProductos = async (req, res) => {

    try {
        const { categorias, marcas, precio, busqueda } = req.query;

        let sql = `
            SELECT 
                p.id_producto,
                p.id_categoria,
                p.nombre,
                p.descripcion,
                p.precio,
                p.marca,
                p.imagen_producto,
                c.nombre AS nombre_categoria
            FROM producto p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
        `;

        let condiciones = [];
        let params = [];

        // Filtro por categorías
        if (categorias) {
            const lista = categorias.split(",").map(x => x.trim());
            const placeholders = lista.map(() => "?").join(",");
            condiciones.push(`p.id_categoria IN (${placeholders})`);
            params.push(...lista);
        }

        // Filtro por marcas
        if (marcas) {
            const lista = marcas.split(",").map(x => x.trim());
            const placeholders = lista.map(() => "?").join(",");
            condiciones.push(`p.marca IN (${placeholders})`);
            params.push(...lista);
        }

        // Filtro por rangos de precio
        if (precio) {
            if (precio === "1") condiciones.push("p.precio <= 5000000");
            if (precio === "2") condiciones.push("p.precio BETWEEN 6000000 AND 14000000");
            if (precio === "3") condiciones.push("p.precio >= 15000000");
        }

        // ✅ Filtro de búsqueda
        if (busqueda) {
            condiciones.push("(p.nombre LIKE ? OR p.descripcion LIKE ? OR c.nombre LIKE ?)");
            const texto = `%${busqueda}%`;
            params.push(texto, texto, texto);
        }

        if (condiciones.length > 0) {
            sql += " WHERE " + condiciones.join(" AND ");
        }

        const [rows] = await db.query(sql, params);
        return res.status(200).json(rows);

    } catch (error) {
        console.log("Error en obtenerProductos:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};





// ============================================================================
// ======================   OBTENER PRODUCTO POR ID   ==========================
// ============================================================================
const obtenerProductoPorId = async (req, res) => {

    try {
        // Sacamos el ID enviado por la URL
        const { id } = req.params;

        // Query con JOIN para traer mas datos
        const sql = `
            SELECT 
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.precio,
                p.marca,
                p.imagen_producto,
                p.id_categoria,
                c.nombre AS nombre_categoria
            FROM producto p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = ?
        `;

        const [filas] = await db.query(sql, [id]);

        // Validamos si existe ese producto
        if (filas.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // Devolvemos el producto encontrado
        return res.status(200).json(filas[0]);

    } catch (error) {
        console.log("Error en obtenerProductoPorId:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};




// ============================================================================
// =========================   ACTUALIZAR PRODUCTO   ===========================
// ============================================================================
const actualizarProducto = async (req, res) => {

    try {
        const { id } = req.params;

        const { nombre, descripcion, precio, id_categoria, marca } = req.body;

        // Verificamos que el producto exista
        const [prodRows] = await db.query(
            "SELECT * FROM producto WHERE id_producto = ?",
            [id]
        );

        if (prodRows.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // Si viene categoría verificamos que exista
        if (id_categoria) {
            const [catRows] = await db.query(
                "SELECT * FROM categoria WHERE id_categoria = ?",
                [id_categoria]
            );

            if (catRows.length === 0) {
                return res.status(400).json({ mensaje: "La categoría no existe" });
            }
        }

        // Creamos un arreglo para ir construyendo el UPDATE
        const campos = [];
        const params = [];

        if (nombre) {
            campos.push("nombre = ?");
            params.push(nombre);
        }

        if (descripcion !== undefined) {
            campos.push("descripcion = ?");
            params.push(descripcion || null);
        }

        if (precio) {
            const precioNum = parseFloat(precio);
            if (isNaN(precioNum) || precioNum <= 0) {
                return res.status(400).json({ mensaje: "Precio inválido" });
            }
            campos.push("precio = ?");
            params.push(precioNum);
        }

        if (marca) {
            campos.push("marca = ?");
            params.push(marca);
        }

        if (id_categoria) {
            campos.push("id_categoria = ?");
            params.push(id_categoria);
        }

        // Si viene imagen nueva la actualizamos
        if (req.file) {
            campos.push("imagen_producto = ?");
            params.push("/uploads/" + req.file.filename);
        }

        // Verificamos que haya algo para actualizar
        if (campos.length === 0) {
            return res.status(400).json({ mensaje: "No hay campos para actualizar" });
        }

        // Construimos el SQL final
        const sql = `
            UPDATE producto
            SET ${campos.join(", ")}
            WHERE id_producto = ?
        `;

        params.push(id);

        // Ejecutamos el Update
        await db.query(sql, params);

        return res.status(200).json({ mensaje: "Producto actualizado correctamente" });

    } catch (error) {
        console.log("Error en actualizarProducto:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};




// ============================================================================
// =========================   ELIMINAR PRODUCTO   ==============================
// ============================================================================
const eliminarProducto = async (req, res) => {

    try {
        const { id } = req.params;

        // Validamos que exista
        const [prodRows] = await db.query(
            "SELECT id_producto FROM producto WHERE id_producto = ?",
            [id]
        );

        if (prodRows.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // Ejecutamos la eliminación
        await db.query(
            "DELETE FROM producto WHERE id_producto = ?",
            [id]
        );

        return res.status(200).json({ mensaje: "Producto eliminado correctamente" });

    } catch (error) {
        console.log("Error en eliminarProducto:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};




// ============================================================================
// Exportamos todas las funciones
// ============================================================================
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
