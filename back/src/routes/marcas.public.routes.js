const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =====================================
// OBTENER TODAS LAS MARCAS (PÚBLICO)
// =====================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id_marca, nombre FROM marca ORDER BY nombre ASC"
    );
    res.json(rows);
  } catch (error) {
    console.log("Error obteniendo marcas:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

module.exports = router;
