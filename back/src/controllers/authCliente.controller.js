// importamos la base de datos
const db = require("../config/db");

// importamos bcrypt para encriptar contraseñas
const bcrypt = require("bcrypt");

// importamos jwt para crear el token
const jwt = require("jsonwebtoken");

// obtenemos la clave secreta del .env
const JWT_SECRET = process.env.JWT_SECRET;

// ============================
// REGISTRO DE CLIENTE
// ============================
exports.register = async (req, res) => {
  // sacamos los datos enviados por el frontend
  const { nombre, email, contrasena, telefono, direccion } = req.body;

  // verificamos que vengan los campos obligatorios
  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ mensaje: "Nombre, email y contraseña son obligatorios" });
  }

  try {
    // verificamos si el correo ya existe en la BD
    const [existe] = await db.query(
      "SELECT id_cliente FROM cliente WHERE email = ?",
      [email]
    );

    // si existe → error
    if (existe.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // insertamos el nuevo cliente
    const [resultado] = await db.query(
      `INSERT INTO cliente (nombre, email, contrasena, telefono, direccion)
        VALUES (?, ?, ?, ?, ?)`,
      [nombre, email, hashedPassword, telefono || null, direccion || null]
    );

    return res.status(201).json({
      mensaje: "Cliente registrado correctamente",
      id_cliente: resultado.insertId
    });

  } catch (error) {
    console.log("Error en registerCliente:", error);
    res.status(500).json({ mensaje: "Error interno en el servidor" });
  }
};

// ============================
// LOGIN DE CLIENTE
// ============================
exports.login = async (req, res) => {
  // sacamos email y contraseña del body
  const { email, contrasena } = req.body;

  // validamos que vengan
  if (!email || !contrasena) {
    return res.status(400).json({ mensaje: "Email y contraseña son obligatorios" });
  }

  try {
    // buscamos el cliente en la BD
    const [rows] = await db.query(
      "SELECT * FROM cliente WHERE email = ?",
      [email]
    );

    // si no existe → error
    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // cliente encontrado
    const cliente = rows[0];

    // comparamos contraseña ingresada con la guardada
    const esValida = await bcrypt.compare(contrasena, cliente.contrasena);

    // si no coincide → error
    if (!esValida) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // armamos el payload del token
    const payload = {
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      email: cliente.email,
      role: "cliente"
    };

    // generamos token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "8h"
    });

    return res.json({
      mensaje: "Login exitoso",
      token: token
    });

  } catch (error) {
    console.log("Error en loginCliente:", error);
    res.status(500).json({ mensaje: "Error interno en el servidor" });
  }
};
