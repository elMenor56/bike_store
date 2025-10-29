const soloAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
  }
  next();
};

module.exports = soloAdmin;
