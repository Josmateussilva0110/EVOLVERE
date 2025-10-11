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
