const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);

module.exports = app;
