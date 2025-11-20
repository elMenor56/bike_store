// importamos multer para manejar subida de archivos
const multer = require("multer");

// configuramos dónde se van a guardar las imágenes
const storage = multer.diskStorage({

    // carpeta donde se guardarán las imágenes
    destination: (req, file, cb) => {
        // cb(null, 'uploads'); --> carpeta donde guardamos
        cb(null, "uploads");
    },

    // configuramos el nombre del archivo subido
    filename: (req, file, cb) => {
        // creamos un nombre único: fecha + nombre original
        const nombreUnico = Date.now() + "-" + file.originalname;

        // guardamos ese nombre
        cb(null, nombreUnico);
    }
});

// creamos el middleware final de multer
const upload = multer({
    storage: storage
});

// exportamos un middleware para 1 sola imagen con campo "imagen"
module.exports = {
    uploadSingle: upload.single("imagen")
};
