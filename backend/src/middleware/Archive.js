const multer = require("multer")

/**
 * Middleware de upload de arquivos PDF usando Multer.
 * 
 * - Armazena o arquivo apenas na memória (buffer).
 * - Aceita apenas arquivos PDF.
 * - Limita o tamanho do arquivo a 5MB.
 * @module upload
 */

/**
 * Configuração de armazenamento em memória.
 * Armazena arquivos enviados apenas no buffer da memória.
 * 
 * @type {multer.StorageEngine}
 * @example
 * // arquivo disponível em request.file.buffer
 */
const storage = multer.memoryStorage()

/**
 * Função de filtro de arquivos.
 * Permite apenas arquivos PDF e rejeita outros tipos.
 * 
 * @param {import("express").Request} req - Objeto de requisição do Express.
 * @param {Express.Multer.File} file - Arquivo enviado.
 * @param {function(Error|null, boolean)} cb - Callback do Multer.
 * @example
 * // Sucesso:
 * cb(null, true)
 * 
 * // Erro:
 * cb(new Error("Apenas arquivos PDF são permitidos!"), false)
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    cb(new Error("Apenas arquivos PDF são permitidos!"), false)
  }
}

/**
 * Instância do middleware Multer configurada para upload de PDFs.
 * - Usa armazenamento em memória
 * - Filtro de arquivos PDF
 * - Limite de tamanho: 5MB
 * 
 * @type {import("multer").Multer}
 * @example
 * // Uso em rota Express:
 * const upload = require("./upload")
 * app.post("/upload", upload.single("diploma"), (req, res) => { ... })
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

module.exports = upload
