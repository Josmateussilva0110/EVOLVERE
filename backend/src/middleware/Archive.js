const multer = require("multer")

/**
 * Middleware de upload de arquivos (PDF, DOC, DOCX, PPT, PPTX) usando Multer.
 *
 * - Armazena o arquivo apenas na memória (buffer).
 * - Aceita apenas arquivos PDF, DOC, DOCX, PPT e PPTX.
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
 * Lista de tipos MIME permitidos.
 * 
 * @type {string[]}
 */
const allowedMimeTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" // .pptx
]

/**
 * Função de filtro de arquivos.
 * Permite apenas arquivos PDF, DOC, DOCX, PPT e PPTX.
 *
 * @param {import("express").Request} req - Objeto de requisição do Express.
 * @param {Express.Multer.File} file - Arquivo enviado.
 * @param {function(Error|null, boolean)} cb - Callback do Multer.
 */
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Apenas arquivos PDF, DOC, DOCX, PPT e PPTX são permitidos!"), false)
  }
}

/**
 * Instância do middleware Multer configurada.
 * - Usa armazenamento em memória
 * - Filtro de tipos permitidos
 * - Limite de tamanho: 5MB
 *
 * @type {import("multer").Multer}
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

module.exports = upload
