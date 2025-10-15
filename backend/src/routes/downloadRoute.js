/**
 * routes/downloadRoute.js
 * Rota para servir downloads e visualização de materiais estáticos.
 *
 * Endpoint:
 *  - GET /materials/:filename
 *
 * Query params suportados:
 *  - download=true : força o download enviando header `Content-Disposition`.
 *
 * Comportamento:
 *  - Valida a existência do arquivo em `public/materials` e retorna 404 se não existir.
 *  - Quando `download=true` adiciona headers para forçar o download; caso
 *    contrário o arquivo é servido diretamente (com Content-Type genérico).
 *
 * Segurança / notas operacionais:
 *  - Certifique-se de que nomes de arquivos são validados ao salvar no servidor
 *    para evitar path traversal; aqui o uso de `path.join(__dirname, .., 'public', 'materials', filename)`
 *    limita a pesquisa ao diretório de materiais.
 *  - Para ambientes com autenticação, aplique middleware de autorização antes
 *    de expor arquivos sensíveis.
 */
const express = require("express")
const path = require("path")
const router = express.Router()
const fs = require("fs")


router.get("/materials/:filename", (request, response) => {
  const filePath = path.join(__dirname, "..",  "..", "public", "materials", request.params.filename)
  const forceDownload = request.query.download === "true"

  if (!fs.existsSync(filePath)) {
    return response.status(404).json({ error: "Arquivo não encontrado" })
  }

  if (forceDownload) {
    response.setHeader("Content-Disposition", `attachment; filename="${request.params.filename}"`)
    response.setHeader("Content-Type", "application/octet-stream")
  }

  response.sendFile(filePath)
})

module.exports = router
