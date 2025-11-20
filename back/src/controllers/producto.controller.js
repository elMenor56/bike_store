// Importamos la conexión (pool con promesas)
const db = require('../config/db');

/*
  ====== CREAR PRODUCTO ======
  Recibe multipart/form-data con campos:
    - nombre (string)
    - descripcion (string)
    - precio (number)
    - id_categoria (int)
    - imagen (file)
*/
/*
  CREA UN PRODUCTO GUARDANDO LA IMAGEN EN LA CARPETA /uploads
*/
const crearProducto = async (req, res) => {

  try {
      // sacamos datos del body
      const { nombre, descripcion, precio, id_categoria } = req.body;

      // validaciones básicas
      if (!nombre || !precio || !id_categoria) {
          return res.status(400).json({ mensaje: "nombre, precio e id_categoria son obligatorios" });
      }

      // validamos precio
      const precioNum = parseFloat(precio);
      if (isNaN(precioNum) || precioNum <= 0) {
          return res.status(400).json({ mensaje: "El precio debe ser mayor que 0" });
      }

      // validamos categoría
      const [catRows] = await db.query("SELECT id_categoria FROM categoria WHERE id_categoria = ?", [id_categoria]);
      if (catRows.length === 0) {
          return res.status(400).json({ mensaje: "La categoría no existe" });
      }

      // validamos que venga imagen
      if (!req.file) {
          return res.status(400).json({ mensaje: "Debes subir una imagen" });
      }

      // creamos la ruta que guardaremos en la base de datos
      const rutaImagen = "/uploads/" + req.file.filename;

      // insertamos en BD
      const sql = `
          INSERT INTO producto (id_categoria, nombre, descripcion, precio, imagen_producto)
          VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(sql, [
          id_categoria,
          nombre,
          descripcion || null,
          precioNum,
          rutaImagen
      ]);

      // devolvemos respuesta
      return res.status(201).json({
          mensaje: "Producto creado correctamente",
          id_producto: result.insertId
      });

  } catch (error) {
      console.log("Error en crearProducto:", error);
      return res.status(500).json({ mensaje: "Error en el servidor" });
  }
};


/*
  ====== OBTENER PRODUCTOS ======
  Soporta filtro por múltiples categorías:
    GET /api/productos?categorias=1,2,3
  Si no hay query 'categorias' devuelve todos los productos.
*/
const obtenerProductos = async (req, res) => {
  try {
      const categoriasParam = req.query.categorias;

      // ===========================================
      // SELECT con JOIN para traer también el nombre de la categoría
      // ===========================================
      let sql = `
          SELECT 
              p.id_producto,
              p.id_categoria,
              p.nombre,
              p.descripcion,
              p.precio,
              p.imagen_producto,
              c.nombre AS nombre_categoria   -- acá traemos el nombre real
          FROM producto p
          LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      `;

      let params = [];

      // si vienen filtros por categoría
      if (categoriasParam) {
          const categoriasArr = categoriasParam.split(",").map(s => s.trim());
          const placeholders = categoriasArr.map(() => "?").join(",");

          sql += ` WHERE p.id_categoria IN (${placeholders})`;
          params = categoriasArr;
      }

      const [filas] = await db.query(sql, params);

      return res.status(200).json(filas);
  } catch (error) {
      console.log("Error en obtenerProductos:", error);
      return res.status(500).json({ mensaje: "Error en el servidor" });
  }
};



/*
  ====== OBTENER PRODUCTO POR ID ======
  Devuelve también la imagen en base64 para facilitar el frontend (opcional)
  GET /api/productos/:id
*/
// ===========================================
// OBTENER PRODUCTO POR ID (detalle)
// ===========================================
const obtenerProductoPorId = async (req, res) => {

    try {
        const { id } = req.params;  // sacamos el id que viene por URL

        // hacemos un JOIN para también traer el nombre de la categoría
        const sql = `
            SELECT 
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen_producto,
                p.id_categoria,
                c.nombre AS nombre_categoria   -- nombre bonito de categoría
            FROM producto p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = ?
        `;

        const [filas] = await db.query(sql, [id]);

        // si no existe ese producto
        if (filas.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // devolvemos el único producto encontrado
        return res.status(200).json(filas[0]);

    } catch (error) {
        console.log("Error en obtenerProductoPorId:", error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};


/*
  ====== ACTUALIZAR PRODUCTO ======
  PUT /api/productos/:id
  Se aceptan multipart/form-data; la imagen es opcional.
*/
const actualizarProducto = async (req, res) => {
  console.log('↪ Entré al controlador actualizarProducto');

  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, id_categoria } = req.body;

    // Validar que el producto exista
    const [prodRows] = await db.query('SELECT * FROM producto WHERE id_producto = ?', [id]);
    if (prodRows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Si viene id_categoria, validar que exista
    if (id_categoria) {
      const [catRows] = await db.query('SELECT id_categoria FROM categoria WHERE id_categoria = ?', [id_categoria]);
      if (catRows.length === 0) {
        return res.status(400).json({ mensaje: 'La categoría indicada no existe' });
      }
    }

    // Preparar partes de la consulta según campos recibidos
    const campos = [];
    const params = [];

    if (nombre) {
      campos.push('nombre = ?');
      params.push(nombre);
    }
    if (descripcion !== undefined) {
      campos.push('descripcion = ?');
      params.push(descripcion || null);
    }
    if (precio !== undefined) {
      const precioNum = parseFloat(precio);
      if (isNaN(precioNum) || precioNum <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número mayor a 0' });
      }
      campos.push('precio = ?');
      params.push(precioNum);
    }
    if (id_categoria) {
      campos.push('id_categoria = ?');
      params.push(id_categoria);
    }

  // si viene una nueva imagen, actualizamos su ruta
  if (req.file) {
      campos.push("imagen_producto = ?");
      params.push("/uploads/" + req.file.filename);
  }


    // Si no hay campos para actualizar
    if (campos.length === 0) {
      return res.status(400).json({ mensaje: 'No hay campos para actualizar' });
    }

    // Construimos la consulta final
    const sql = `UPDATE producto SET ${campos.join(', ')} WHERE id_producto = ?`;
    params.push(id);

    // Ejecutamos la actualización
    await db.query(sql, params);

    return res.status(200).json({ mensaje: 'Producto actualizado correctamente' });

  } catch (error) {
    console.log('Error en actualizarProducto:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


/*
  ====== ELIMINAR PRODUCTO ======
  DELETE /api/productos/:id
*/
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos que exista
    const [prodRows] = await db.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id]);
    if (prodRows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Borramos (cascade en detalle_pedido maneja los detalles)
    await db.query('DELETE FROM producto WHERE id_producto = ?', [id]);

    return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });

  } catch (error) {
    console.log('Error en eliminarProducto:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


// Exportamos todas las funciones
module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
};
