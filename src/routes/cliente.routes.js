const express = require('express');
const router = express.Router();

const {
  obtenerPerfil,
  actualizarPerfil,
  obtenerClientes,
  desactivarCliente,
  activarCliente
} = require('../controllers/cliente.controller');

const verificarToken = require('../middlewares/auth.middleware');
const soloCliente = require('../middlewares/cliente.middleware');
const soloAdmin = require('../middlewares/admin.middleware');

// CLIENTE
router.get('/perfil', verificarToken, soloCliente, obtenerPerfil);
router.put('/perfil', verificarToken, soloCliente, actualizarPerfil);

// ADMIN
router.get('/', verificarToken, soloAdmin, obtenerClientes);
router.put('/:id/desactivar', verificarToken, soloAdmin, desactivarCliente);
router.put('/:id/activar', verificarToken, soloAdmin, activarCliente);

module.exports = router;
