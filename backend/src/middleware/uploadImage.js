const multer = require("multer")

/**
 * Middleware de upload de imagens PNG usando Multer.
 * 
 * - Armazena o arquivo em memória (buffer)
 * - Aceita apenas arquivos PNG
 * - Limita o tamanho a 5MB
 */

const storage = multer.memoryStorage()

const fileFilter = (request, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    callback(null, true)
  } else {
    callback(new Error("Apenas arquivos PNG são permitidos!"), false)
  }
}

const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

module.exports = uploadImage
