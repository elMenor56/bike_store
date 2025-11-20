const express = require("express");
const router = express.Router();

// controlador de pedidos admin
const adminPedidosController = require("../controllers/adminPedidos.controller");

// middleware admin
const { verifyAdminToken } = require("../middlewares/auth.middleware");

// obtener todos los pedidos
router.get("/", verifyAdminToken, adminPedidosController.obtenerTodosLosPedidos);

// obtener un pedido por ID (con detalles)
router.get("/:id", verifyAdminToken, adminPedidosController.obtenerPedidoPorId);

// cambiar estado del pedido
router.put("/:id/estado", verifyAdminToken, adminPedidosController.cambiarEstadoPedido);

module.exports = router;
