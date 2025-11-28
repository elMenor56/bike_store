// ============================================================================
// Importamos la conexión a la base de datos
// ============================================================================
const db = require('../config/db');


// ============================================================================
// ========================   CREAR PRODUCTO   ================================
// ============================================================================
// Ahora funciona con id_marca en vez de marca
// ============================================================================
const crearProducto = async (req, res) => {

    try {

        // sacamos datos del formulario
        const { nombre, descripcion, precio, id_categoria, id_marca, stock } = req.body;

        // validamos campos obligatorios
        if (!nombre || !precio || !id_categoria || !id_marca) {
            return res.status(400).json({ mensaje: "nombre, precio, id_categoria e id_marca son obligatorios" });
        }

        // convertimos precio a número
        const precioNum = parseFloat(precio);

        // validamos precio
        if (isNaN(precioNum) || precioNum <= 0) {
            return res.status(400).json({ mensaje: "El precio debe ser mayor que 0" });
        }

        // verificamos categoría
        const [catRows] = await db.query("SELECT id_categoria FROM categoria WHERE id_categoria = ?", [id_categoria]);
        if (catRows.length === 0) {
            return res.status(400).json({ mensaje: "La categoría no existe" });
        }

        // verificamos marca
        const [marcaRows] = await db.query("SELECT id_marca FROM marca WHERE id_marca = ?", [id_marca]);
        if (marcaRows.length === 0) {
            return res.status(400).json({ mensaje: "La marca no existe" });
        }

        // verificamos que venga imagen
        if (!req.file) {
            return res.status(400).json({ mensaje: "Debes subir una imagen" });
        }

        //Verificador del stock
        const stockNum = parseInt(stock);
        if (isNaN(stockNum) || stockNum < 0) {
            return res.status(400).json({ mensaje: "El stock debe estar entre 0 y 3" });
        }


        // guardamos ruta
        const rutaImagen = "/uploads/" + req.file.filename;

        // insertamos en BD
        const sql = `
            INSERT INTO producto (id_categoria, id_marca, nombre, descripcion, precio, stock, imagen_producto)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            id_categoria,
            id_marca,
            nombre,
            descripcion || null,
            precioNum,
            stockNum,
            rutaImagen
        ]);

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
// Ahora incluye filtro por marca (nombre_marca)
// ============================================================================
const obtenerProductos = async (req, res) => {

    try {
        const { categorias, precio, marcas, busqueda } = req.query;

        // base del query
        let sql = `
            SELECT 
                p.id_producto,
                p.id_categoria,
                p.id_marca,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen_producto,
                p.stock,
                c.nombre AS nombre_categoria,
                m.nombre AS nombre_marca
            FROM producto p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN marca m ON p.id_marca = m.id_marca
        `;

        // arreglo de condiciones
        let condiciones = [];
        let params = [];

        // filtro categorías
        if (categorias) {
            const lista = categorias.split(",").map(x => x.trim());
            const placeholders = lista.map(() => "?").join(",");
            condiciones.push(`p.id_categoria IN (${placeholders})`);
            params.push(...lista);
        }

        // filtro marca por ID
        if (marcas) {
            const listaMarcas = marcas.split(",").map(x => x.trim());
            const placeholders = listaMarcas.map(() => "?").join(",");
            condiciones.push(`p.id_marca IN (${placeholders})`);
            params.push(...listaMarcas);
        }

        // filtro rango de precios
        if (precio) {
            if (precio === "1") condiciones.push("p.precio <= 5000000");
            if (precio === "2") condiciones.push("p.precio BETWEEN 6000000 AND 14000000");
            if (precio === "3") condiciones.push("p.precio >= 15000000");
        }

        // búsqueda general
        if (busqueda) {
            const txt = `%${busqueda}%`;
            condiciones.push("(p.nombre LIKE ? OR p.descripcion LIKE ? OR m.nombre LIKE ? OR c.nombre LIKE ?)");
            params.push(txt, txt, txt, txt);
        }

        // aplicamos condiciones si existen
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
        const { id } = req.params;
        const esAdmin = req.user && req.user.rol === "admin";  // si tienes auth

        let sql = `
            SELECT 
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen_producto,
                p.id_categoria,
                p.id_marca,
                p.stock,
                c.nombre AS nombre_categoria,
                m.nombre AS nombre_marca
            FROM producto p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN marca m ON p.id_marca = m.id_marca
            WHERE p.id_producto = ?
        `;

        const [filas] = await db.query(sql, [id]);

        if (filas.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // si NO es admin → no mostrar productos sin stock
        if (!esAdmin && filas[0].stock <= 0) {
            return res.status(404).json({ mensaje: "Producto no disponible" });
        }

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
        const { nombre, descripcion, precio, id_categoria, id_marca, stock } = req.body;

        const [prodRows] = await db.query(
            "SELECT * FROM producto WHERE id_producto = ?",
            [id]
        );

        if (prodRows.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // Validación de categoría
        if (id_categoria) {
            const [catRows] = await db.query(
                "SELECT * FROM categoria WHERE id_categoria = ?",
                [id_categoria]
            );
            if (catRows.length === 0) {
                return res.status(400).json({ mensaje: "La categoría no existe" });
            }
        }

        // Validación de marca
        if (id_marca) {
            const [marcaRows] = await db.query(
                "SELECT * FROM marca WHERE id_marca = ?",
                [id_marca]
            );
            if (marcaRows.length === 0) {
                return res.status(400).json({ mensaje: "La marca no existe" });
            }
        }

        // Construcción dinámica
        const campos = [];
        const params = [];

        if (nombre) { campos.push("nombre = ?"); params.push(nombre); }
        if (descripcion !== undefined) { campos.push("descripcion = ?"); params.push(descripcion || null); }

        if (precio) {
            const precioNum = parseFloat(precio);
            if (isNaN(precioNum) || precioNum <= 0) {
                return res.status(400).json({ mensaje: "Precio inválido" });
            }
            campos.push("precio = ?");
            params.push(precioNum);
        }

        if (id_categoria) {
            campos.push("id_categoria = ?");
            params.push(id_categoria);
        }

        if (id_marca) {
            campos.push("id_marca = ?");
            params.push(id_marca);
        }

        if (req.file) {
            campos.push("imagen_producto = ?");
            params.push("/uploads/" + req.file.filename);
        }

        if (stock !== undefined && stock !== "") {
            const stockNum = parseInt(stock);
            if (isNaN(stockNum) || stockNum < 0 || stockNum > 3) {
                return res.status(400).json({ mensaje: "Stock inválido (0–3)" });
            }
            campos.push("stock = ?");
            params.push(stockNum);
        }

        if (campos.length === 0) {
            return res.status(400).json({ mensaje: "No hay campos para actualizar" });
        }

        const sql = `
            UPDATE producto
            SET ${campos.join(", ")}
            WHERE id_producto = ?
        `;

        params.push(id);

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

        const [prodRows] = await db.query(
            "SELECT id_producto FROM producto WHERE id_producto = ?",
            [id]
        );

        if (prodRows.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        await db.query("DELETE FROM producto WHERE id_producto = ?", [id]);

        return res.status(200).json({ mensaje: "Producto eliminado correctamente" });

    } catch (error) {
        console.log("Error en eliminarProducto:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};




// ============================================================================
// Exportamos funciones
// ============================================================================
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
