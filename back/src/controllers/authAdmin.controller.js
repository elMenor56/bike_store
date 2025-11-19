// src/controllers/authAdmin.controller.js
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET

// Registrar administrador
exports.register = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
    }

    const [rows] = await db.query("SELECT id_admin FROM administrador WHERE email = ?", [email]);

    if (rows.length > 0) {
      return res.status(400).json({ ok: false, msg: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const result = await db.query(
      "INSERT INTO administrador (nombre, email, contrasena) VALUES (?, ?, ?)",
      [nombre, email, hashed]
    );
    res.status(201).json({ ok: true, msg: "Administrador registrado exitosamente"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error en el servidor" });
  }
};

// Login administrador
exports.login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ ok: false, msg: "Email y contraseña son requeridos" });
    }

    const [rows] = await db.query("SELECT id_admin, nombre, email, contrasena FROM administrador WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(contrasena, admin.contrasena);
    if (!isMatch) {
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    }

    // Payload: datos mínimos no sensibles que irán dentro del JWT para identificar al usuario y manejar permisos.
    const payload = {
      id_admin: admin.id_admin,
      email: admin.email,
      nombre: admin.nombre,
      role: "admin"
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    res.json({ ok: true, msg: "Login exitoso", token, admin: { id_admin: admin.id_admin, nombre: admin.nombre, email: admin.email } });
  } catch (error) {
    console.error("authAdmin.login:", error);
    res.status(500).json({ ok: false, msg: "Error interno" });
  }
};