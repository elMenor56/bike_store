const express = require("express");
const router = express.Router();
const db = require("../config/db");

// obtener categorías (público)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categoria ORDER BY nombre ASC");
    res.json(rows);
  } catch (err) {
    console.log("Error obteniendo categorías:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

module.exports = router;
