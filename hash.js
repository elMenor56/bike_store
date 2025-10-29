const bcrypt = require('bcrypt');

async function generarHash() {
  const hash = await bcrypt.hash('ana', 10);
  console.log(hash);
}

generarHash();
