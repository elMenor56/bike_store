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

// obtener un cliente por ID (incluye pedidos)
router.get("/:id", verifyAdminToken, adminClientesController.obtenerClientePorId);

module.exports = router;
