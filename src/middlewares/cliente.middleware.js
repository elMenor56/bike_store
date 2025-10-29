const soloCliente = (req, res, next) => {
  if (req.user.rol !== 'cliente') {
    return res.status(403).json({ message: 'Acceso denegado. Solo clientes pueden realizar esta acción.' });
  }
  next();
};

module.exports = soloCliente;
