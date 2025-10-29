const app = require('./src/app');
const dotenv = require('dotenv');
const PORT = process.env.DB_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server corriendo en el puerto ${PORT}`);
});