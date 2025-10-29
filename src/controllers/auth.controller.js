const db = require('../config/conexion_db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Iniciar sesión de cliente
 */
const loginCliente = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ message: 'Debe ingresar correo y contraseña.' });
    }

    // Buscar cliente en la base de datos
    const [rows] = await db.promise().query(
      'SELECT * FROM cliente WHERE correo = ?',
      [correo]
    );
    const cliente = rows[0];

    if (!cliente) {
      return res.status(401).json({ message: 'Cliente no existe.' });
    }

    // Comparar contraseñas
    const esValida = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!esValida) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    // Generar token JWT válido por 2 horas
    const token = jwt.sign(
      { id_cliente: cliente.id_cliente, correo: cliente.correo, rol: 'cliente' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      cliente: {
        id_cliente: cliente.id_cliente,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        correo: cliente.correo,
      },
    });
  } catch (error) {
    console.error('Error en loginCliente:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// ========================================
// Login de ADMINISTRADOR
// ========================================
const loginAdmin = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const [rows] = await db.promise().query(
      'SELECT * FROM administrador WHERE correo = ?',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Administrador no encontrado.' });
    }

    const admin = rows[0];
    const bcrypt = require('bcrypt');

    const esValida = await bcrypt.compare(contrasena, admin.contrasena);
    if (!esValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id_admin: admin.id_admin, correo: admin.correo, rol: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso como administrador.',
      token,
      admin: {
        id_admin: admin.id_admin,
        nombre: admin.nombre,
        correo: admin.correo
      }
    });
  } catch (error) {
    console.error('Error en loginAdmin:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};


/**
 * Registrar cliente
 */
const registrarCliente = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, telefono, direccion } = req.body;

    if (!nombre || !apellido || !correo || !contrasena ||! telefono || !direccion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const [existe] = await db.promise().query('SELECT * FROM cliente WHERE correo = ?', [correo]);
    if (existe.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await db.promise().query(
      `INSERT INTO cliente (nombre, apellido, correo, contrasena, telefono, direccion)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, direccion, telefono, hashedPassword]
    );

    res.status(201).json({ message: 'Cliente registrado correctamente.' });
  } catch (error) {
    console.error('Error en registrarCliente:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

module.exports = {
  registrarCliente,
  loginCliente,
  loginAdmin
};
