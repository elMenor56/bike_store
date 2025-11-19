const express = require("express");
const router = express.Router();

// importamos el controlador
const pedidoController = require("../controllers/pedido.controller");

// importamos el middleware que valida token del cliente (lo haremos luego)
const { verifyClienteToken } = require("../middlewares/authCliente.middleware");

// ruta para crear un pedido
router.post("/", verifyClienteToken, pedidoController.crearPedido);

module.exports = router;
