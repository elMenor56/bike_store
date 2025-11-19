const express = require("express");
const router = express.Router();

// importamos el controlador del pedido
const pedidoController = require("../controllers/pedido.controller");

// importamos el middleware del cliente
const { verifyClienteToken } = require("../middlewares/authCliente.middleware");

// crear un pedido (funciona porque ya lo tienes)
router.post("/", verifyClienteToken, pedidoController.crearPedido);

// obtener historial del cliente
router.get("/mis-pedidos", verifyClienteToken, pedidoController.obtenerPedidosCliente);

module.exports = router;

