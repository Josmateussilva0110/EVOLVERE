const multer = require("multer")
const path = require("path")
const fs = require("fs")

const pdfStorage = multer.diskStorage({
  destination: function (request, file, callback) {
    let folder = "documents"
    const url = request.originalUrl.toLowerCase()

    if (url.startsWith("/user")) {
      folder = '/diplomas'
    }

    const dest = path.join("public", folder)
    fs.mkdirSync(dest, { recursive: true }) // garante que a pasta existe

    callback(null, dest)
  },
  filename: function (request, file, callback) {
    const uniqueName =
      Date.now() + String(Math.floor(Math.random() * 100)) + path.extname(file.originalname)
    callback(null, uniqueName)
  },
})

const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter(request, file, callback) {
    if (!file.originalname.toLowerCase().endsWith(".pdf")) {
      return callback(new Error("Só aceito arquivos PDF"))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
})

module.exports = pdfUpload
