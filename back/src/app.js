// src/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Rutas
app.use("/admin", require("./routes/admin.routes"));

app.get("/", (req, res) => {
  res.send("Servidor Bike Store funcionando correctamente");
});

module.exports = app;
