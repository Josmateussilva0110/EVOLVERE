/**
 * routes/materialsRoutes.js
 * Rotas relacionadas a materiais (upload e remoção).
 *
 * Endpoints:
 *  - POST /material
 *      Recebe um arquivo (campo multipart/form-data `materials`) e metadados no body
 *      (title, description, type, created_by, subject_id, opcional class_id).
 *      O middleware `Archive` (multer) valida o upload e limita o tamanho (5MB).
 *      Em caso de sucesso, `materialController.register` persiste o arquivo e os
 *      metadados na base de dados e retorna { status: true, message, subject_id }.
 *
 *  - DELETE /material/:id
 *      Remove o registro de material pelo ID e (espera-se) também o arquivo
 *      associado ser removido pelo controller. Retorna status e mensagem.
 *
 * Tratamento de erros:
 *  - O middleware captura erros de upload e retorna 400 com mensagens claras
 *    (p.ex. 'O ficheiro excede 5 MB.' ou erro do multer).
 *  - Todos os outros erros são delegados aos handlers do controller que
 *    retornam códigos apropriados (404, 422, 500).
 *
 * Observações de implementação:
 *  - O campo multipart usado no form deve se chamar `materials` para ser aceito
 *    pelo middleware `archiveUpload.single('materials')`.
 *  - O controller espera `request.file` com `buffer` e `originalname`.
 */
const express = require("express")
const router = express.Router()
const materialController = require("../controllers/materialController")
const archiveUpload = require("../middleware/Archive")

router.post("/material", (request, response, next) => {
    archiveUpload.single("materials")(request, response, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return response.status(400).json({ status: false, message: "O ficheiro excede 5 MB." })
            }
            return response.status(400).json({ status: false, message: err.message })
        }
        next()
    })
}, materialController.register)

router.delete("/material/:id", materialController.delete)

router.get('/material/class/:class_id', materialController.getMaterialsClass)




module.exports = router
