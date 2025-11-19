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
const crearProducto = async (req, res) => {

  try {
    // Extraemos campos del body (multer deja texto en req.body)
    const { nombre, descripcion, precio, id_categoria } = req.body;

    // Validaciones simples
    if (!nombre || !precio || !id_categoria) {
      return res.status(400).json({ mensaje: 'nombre, precio e id_categoria son obligatorios' });
    }

    // Validamos que precio sea número y mayor a 0
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      return res.status(400).json({ mensaje: 'El precio debe ser un número mayor a 0' });
    }

    // Validamos que la categoría exista
    const [catRows] = await db.query('SELECT id_categoria FROM categoria WHERE id_categoria = ?', [id_categoria]);
    if (catRows.length === 0) {
      return res.status(400).json({ mensaje: 'La categoría indicada no existe' });
    }

    // Verificamos que multer haya traído el archivo en req.file
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ mensaje: 'La imagen del producto es obligatoria' });
    }

    // Obtenemos el buffer de la imagen (tipo Buffer)
    const imagenBuffer = req.file.buffer;

    // Insertamos el producto en la BD (imagen como BLOB)
    const sql = `INSERT INTO producto (id_categoria, nombre, descripcion, precio, imagen_producto)
                  VALUES (?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [id_categoria, nombre, descripcion || null, precioNum, imagenBuffer]);

    return res.status(201).json({
      mensaje: 'Producto creado correctamente',
      id_producto: result.insertId
    });

  } catch (error) {
    console.log('Error en crearProducto:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
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
    // Leemos el query param 'categorias'
    const categoriasParam = req.query.categorias; // ejemplo: "1,2,3"

    // Si se enviaron categorias, creamos placeholders y params
    if (categoriasParam) {
      // Convertir en array y eliminar espacios
      const categoriasArr = categoriasParam.split(',').map(s => s.trim()).filter(Boolean);

      // Validar que haya al menos un id válido
      if (categoriasArr.length === 0) {
        return res.status(400).json({ mensaje: 'Categorias inválidas' });
      }

      // Construimos placeholders para IN (?, ?, ?)
      const placeholders = categoriasArr.map(() => '?').join(',');

      // Consulta que trae productos cuya id_categoria esté en la lista
      const sql = `SELECT id_producto, id_categoria, nombre, descripcion, precio FROM producto
                    WHERE id_categoria IN (${placeholders})`;

      // Ejecutamos con los ids como parámetros
      const [filas] = await db.query(sql, categoriasArr);
      return res.status(200).json(filas);
    }

    // Si no hay filtro, devolvemos todos los productos (sin el BLOB para ahorrar datos)
    const [filas] = await db.query('SELECT id_producto, id_categoria, nombre, descripcion, precio FROM producto');
    return res.status(200).json(filas);

  } catch (error) {
    console.log('Error en obtenerProductos:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


/*
  ====== OBTENER PRODUCTO POR ID ======
  Devuelve también la imagen en base64 para facilitar el frontend (opcional)
  GET /api/productos/:id
*/
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Traemos todo incluido el blob
    const [filas] = await db.query('SELECT * FROM producto WHERE id_producto = ?', [id]);

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const producto = filas[0];

    // Convertimos la imagen (Buffer) a base64 para que el frontend la pueda mostrar fácilmente
    let imagenBase64 = null;
    if (producto.imagen_producto) {
      imagenBase64 = producto.imagen_producto.toString('base64');
    }

    // Retornamos datos importantes y la imagen en base64
    return res.status(200).json({
      id_producto: producto.id_producto,
      id_categoria: producto.id_categoria,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen_base64: imagenBase64
    });

  } catch (error) {
    console.log('Error en obtenerProductoPorId:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
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

    // Si multer trajo una nueva imagen, la guardamos en BLOB
    if (req.file && req.file.buffer) {
      campos.push('imagen_producto = ?');
      params.push(req.file.buffer);
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
