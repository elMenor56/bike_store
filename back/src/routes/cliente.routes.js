const express = require("express");
const router = express.Router();

// ==============================
// CONTROLADORES
// ==============================

// controlador para register/login
const authClienteController = require("../controllers/authCliente.controller");

// controlador para perfil y edición de perfil
const clienteController = require("../controllers/cliente.controller");

// ==============================
// MIDDLEWARE TOKEN
// ==============================
const { verifyClienteToken } = require("../middlewares/authCliente.middleware");

// ==============================
// RUTAS PÚBLICAS (SIN TOKEN)
// ==============================

// registrar cliente
router.post("/register", authClienteController.register);

// login cliente
router.post("/login", authClienteController.login);

// ==============================
// RUTAS PRIVADAS (CON TOKEN)
// ==============================

// obtener perfil del cliente
router.get("/perfil", verifyClienteToken, clienteController.obtenerPerfil);

// editar perfil del cliente
router.put("/perfil", verifyClienteToken, clienteController.editarPerfil);

module.exports = router;
