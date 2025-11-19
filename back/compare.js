// ==========================================
// COMPARAR CONTRASEÑA VS HASH GUARDADO
// ==========================================

const bcrypt = require("bcrypt");

const passwordIngresada = "admin";  // lo que el usuario escribe
const hashGuardado = "$2b$10$by8gzgrw0pb5jiXnY6jeCOwYgD2M7KZp8qjaGVWrsqhiIlOZFvKQ2"; // de la BD

async function comparar() {
  const esCorrecta = await bcrypt.compare(passwordIngresada, hashGuardado);

  if (esCorrecta) {
    console.log("Contraseña correcta ✔");
  } else {
    console.log("Contraseña incorrecta ❌");
  }
}

comparar();
