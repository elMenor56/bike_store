// src/routes/admin.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authAdmin.controller");
const { verifyAdminToken } = require("../middlewares/auth.middleware");

// Rutas públicas
router.post("/register", authController.register);
router.post("/login", authController.login);

// Rutas protegidas de ejemplo (puedes añadir CRUD productos aquí)
router.get("/me", verifyAdminToken, (req, res) => {
  // req.admin viene del middleware
  res.json({ ok: true, admin: req.admin });
});

module.exports = router;
