// cargo express para crear el servidor
const express = require("express");

// cargo cors para permitir peticiones desde el frontend
const cors = require("cors");

// cargo dotenv para variables secretas
require("dotenv").config();

// creo la app del servidor
const app = express();

// activo cors en todas las rutas
app.use(cors());

// permito recibir json grandes
app.use(express.json({ limit: "10mb" }));

// sirve la carpeta uploads para imágenes
app.use("/uploads", express.static("uploads"));

// ======================
// RUTAS DEL ADMIN
// ======================
app.use("/admin", require("./routes/admin.routes")); // login del admin

app.use("/api/admin", require("./routes/categoria.routes")); // admin maneja categorías

app.use("/api/admin/clientes", require("./routes/adminClientes.routes")); // admin gestiona clientes

app.use("/api/admin/pedidos", require("./routes/adminPedidos.routes")); // admin maneja pedidos

app.use("/api/admin/marcas", require("./routes/marcas.routes")); // admin maneja marcas

// ======================
// RUTAS DEL CLIENTE NORMAL
// ======================
app.use('/api/productos', require('./routes/producto.routes')); // ver productos
app.use("/api/pedidos", require("./routes/pedido.routes")); // pedidos del cliente
app.use("/api/clientes", require("./routes/cliente.routes")); // login cliente
app.use("/cliente", require("./routes/cliente.routes")); // mismo cliente

app.use("/api/categorias", require("./routes/categorias.public.routes")); // categorías públicas
app.use("/api/marcas", require("./routes/marcas.public.routes")); // marcas públicas

// ruta simple para verificar servidor
app.get("/", (req, res) => {
  res.send("Servidor Bike Store funcionando correctamente");
});

// exporto la app
module.exports = app;
