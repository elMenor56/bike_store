const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// middleware para verificar token de cliente
exports.verifyClienteToken = (req, res, next) => {
  // sacamos encabezado de autorización
  const authHeader = req.headers.authorization || "";

  // verificamos el formato Bearer token
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  // sacamos el token real
  const token = authHeader.split(" ")[1];

  // verificamos el token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }

    // guardamos los datos del cliente dentro del request
    req.cliente = decoded;

    // pasamos al siguiente middleware
    next();
  });
};
