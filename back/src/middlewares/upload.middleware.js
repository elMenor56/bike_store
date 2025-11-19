// Importamos multer
const multer = require('multer');

// Configuramos multer para almacenar en memoria (no en disco)
// así obtenemos la imagen como Buffer en req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Exportamos un middleware para recibir un solo archivo con campo "imagen"
// En el formulario multipart/form-data el campo de la imagen debe llamarse "imagen"
module.exports = {
  uploadSingle: upload.single('imagen')
};
