const multer = require("multer")

// Armazena o arquivo apenas na memória (buffer)
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    cb(new Error("Apenas arquivos PDF são permitidos!"), false)
  }
}


const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

module.exports = upload
