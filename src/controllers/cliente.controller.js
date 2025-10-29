const db = require('../config/conexion_db');

/**
 * Obtener perfil del cliente autenticado
 */
const obtenerPerfil = async (req, res) => {
  try {
    const id = req.user.id_cliente; // viene del token

    const [rows] = await db.promise().query(
      'SELECT id_cliente, nombre, apellido, correo, telefono, direccion, estado FROM cliente WHERE id_cliente = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error en obtenerPerfil:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

/**
 * Actualizar datos del cliente autenticado
 */
const actualizarPerfil = async (req, res) => {
  try {
    const id = req.user.id_cliente; // viene del token
    const { nombre, apellido, telefono, direccion } = req.body;

    await db.promise().query(
      `UPDATE cliente 
        SET nombre = ?, apellido = ?, telefono = ?, direccion = ? 
        WHERE id_cliente = ?`,
      [nombre, apellido, telefono, direccion, id]
    );

    res.status(200).json({ message: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error('Error en actualizarPerfil:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

/**
 * Obtener todos los clientes (solo admin)
 */
const obtenerClientes = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT id_cliente, nombre, apellido, correo, telefono, direccion, estado FROM cliente'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error en obtenerClientes:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

/**
 * Desactivar cliente (solo admin)
 */
const desactivarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query('UPDATE cliente SET estado = "inactivo" WHERE id_cliente = ?', [id]);
    res.status(200).json({ message: 'Cliente desactivado correctamente.' });
  } catch (error) {
    console.error('Error en desactivarCliente:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

/**
 * Activar cliente (solo admin)
 */
const activarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await db.promise().query(
      'UPDATE cliente SET estado = "activo" WHERE id_cliente = ?',
      [id]
    );

    res.status(200).json({ message: 'Cliente activado correctamente.' });
  } catch (error) {
    console.error('Error en activarCliente:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};


module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  obtenerClientes,
  activarCliente,
  desactivarCliente
};
