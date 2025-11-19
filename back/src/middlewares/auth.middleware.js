// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_test";

exports.verifyAdminToken = (req, res, next) => {

  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, msg: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ ok: false, msg: "Token inválido" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ ok: false, msg: "Token inválido o expirado" });
      }

      // attach admin info to request
      req.admin = decoded;
      next();
    });
  } catch (error) {
    console.error("verifyAdminToken:", error);
    res.status(500).json({ ok: false, msg: "Error interno en autenticación" });
  }
};
