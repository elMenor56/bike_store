const express = require('express');
const router = express.Router();
const { registrarCliente, loginCliente, loginAdmin } = require('../controllers/auth.controller');

router.post('/register', registrarCliente);
router.post('/login', loginCliente);
router.post('/admin/login', loginAdmin);


module.exports = router;
