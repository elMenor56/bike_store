const express = require("express");
const router = express.Router();

const { 
    obtenerMarcas,
    crearMarca,
    actualizarMarca,
    eliminarMarca
} = require("../controllers/marcas.controller");

const { verifyAdminToken } = require("../middlewares/auth.middleware");

router.get("/", verifyAdminToken, obtenerMarcas);
router.post("/", verifyAdminToken, crearMarca);
router.put("/:id", verifyAdminToken, actualizarMarca);
router.delete("/:id", verifyAdminToken, eliminarMarca);

module.exports = router;
