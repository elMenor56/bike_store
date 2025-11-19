const express = require('express');
const router = express.Router();

// Importamos el controlador
const categoriaController = require('../controllers/categoria.controller');

// Importamos el middleware para verificar si es administrador
const { verifyAdminToken } = require('../middlewares/auth.middleware');

// =============================
// RUTAS PROTEGIDAS DEL ADMIN
// =============================

// Crear categoría
router.post('/categorias', verifyAdminToken, categoriaController.crearCategoria);

// Obtener todas las categorías (solo admin)
router.get('/categorias', verifyAdminToken, categoriaController.obtenerCategorias);

// Actualizar una categoría
router.put('/categorias/:id', verifyAdminToken, categoriaController.actualizarCategoria);

// Eliminar una categoría
router.delete('/categorias/:id', verifyAdminToken, categoriaController.eliminarCategoria);

// Exportamos las rutas
module.exports = router;
