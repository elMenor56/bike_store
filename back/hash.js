// ==========================================
// SCRIPT PARA GENERAR HASH DE UNA CONTRASEÑA
// ==========================================

const bcrypt = require("bcrypt");

// cantidad de rondas
const SALT_ROUNDS = 10;

//pon la contraseña que quieras hashear
const password = "admin";

async function generarHash() {
  // generamos el hash
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  console.log("Contraseña original:", password);
  console.log("Hash generado:", hash);
}

generarHash();
