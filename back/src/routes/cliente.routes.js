const express = require("express");
const router = express.Router();

// importamos el controlador del cliente
const clienteController = require("../controllers/authCliente.controller");

// ruta para registrar cliente
router.post("/register", clienteController.register);

// ruta para login cliente
router.post("/login", clienteController.login);

module.exports = router;
