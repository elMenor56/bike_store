// src/routes/productos.routes.js
const express = require('express');
const router = express.Router();

// Controlador de productos
const productosController = require('../controllers/producto.controller');

// Middleware auth admin (verifica token)
const { verifyAdminToken } = require('../middlewares/auth.middleware');

// Middleware multer (recibe imagen en memoria)
const { uploadSingle } = require('../middlewares/upload.middleware');

/*
  RUTAS PÚBLICAS (CLIENTE)
*/
// Listar productos (opcional filtro ?categorias=1,2,3)
router.get('/', productosController.obtenerProductos);

// Obtener producto por id
router.get('/:id', productosController.obtenerProductoPorId);

/*
  RUTAS PROTEGIDAS (ADMIN)
  - Crear producto (multipart/form-data)
  - Actualizar producto (multipart/form-data, imagen opcional)
  - Eliminar producto
*/
router.post('/', verifyAdminToken, uploadSingle, productosController.crearProducto);
router.put('/:id', verifyAdminToken, uploadSingle, productosController.actualizarProducto);
router.delete('/:id', verifyAdminToken, productosController.eliminarProducto);

module.exports = router;
