const express = require("express");
const router = express.Router();

// controlador admin
const adminClientesController = require("../controllers/adminClientes.controller");

// middleware admin
const { verifyAdminToken } = require("../middlewares/auth.middleware");

// obtener todos los clientes
router.get("/", verifyAdminToken, adminClientesController.obtenerClientes);

// contar clientes
router.get("/count", verifyAdminToken, adminClientesController.contarClientes);

// obtener pedidos de un cliente (DEBE IR ANTES QUE :id)
router.get("/:id/pedidos", verifyAdminToken, adminClientesController.obtenerPedidosCliente);

// obtener un cliente por ID
router.get("/:id", verifyAdminToken, adminClientesController.obtenerClientePorId);

module.exports = router;
