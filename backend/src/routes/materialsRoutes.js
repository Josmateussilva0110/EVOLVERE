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


/**
 * @route DELETE /material/:id
 * @group Materials - Operações relacionadas a materiais didáticos
 * @summary Deleta um material específico pelo seu ID.
 * @param {number} id.path.required - ID do material a ser deletado.
 * 
 * @returns {Object} 200 - Sucesso: Retorna mensagem confirmando a exclusão.
 * @returns {boolean} 200.status - Indica se a operação foi bem-sucedida.
 * @returns {string} 200.message - Mensagem de confirmação da exclusão.
 * @returns {Object} 404 - Material não encontrado.
 * @returns {Object} 422 - ID inválido.
 * @returns {Object} 500 - Erro interno do servidor.
 * 
 * @example
 * // Exemplo de requisição
 * DELETE /material/12
 * 
 * // Exemplo de resposta (200)
 * {
 *   "status": true,
 *   "message": "Material deletado com sucesso."
 * }
 * 
 * @description
 * Essa rota exclui um material com base no `id` informado.
 * Caso o material não exista ou o ID seja inválido, é retornada uma mensagem de erro apropriada.
 */
router.delete("/material/:id", materialController.delete)


/**
 * @route GET /material/class/:class_id
 * @group Materials - Operações relacionadas a materiais didáticos
 * @summary Retorna todos os materiais vinculados a uma turma específica.
 * @param {number} class_id.path.required - ID da turma.
 * 
 * @returns {Object} 200 - Sucesso: Retorna um objeto com a lista de materiais e o total.
 * @returns {boolean} 200.status - Indica se a requisição foi bem-sucedida.
 * @returns {number} 200.total_materials - Quantidade total de materiais encontrados.
 * @returns {Array<{
 *   id: number,
 *   title: string,
 *   class_name: string,
 *   type_file: string,
 *   archive: string,
 *   updated_at: string
 * }>} 200.materials - Lista de materiais da turma.
 * @returns {Object} 404 - Nenhum material encontrado para a turma.
 * @returns {Object} 422 - ID inválido.
 * @returns {Object} 500 - Erro interno do servidor.
 * 
 * @example
 * // Exemplo de requisição
 * GET /material/class/5
 * 
 * // Exemplo de resposta (200)
 * {
 *   "status": true,
 *   "total_materials": 3,
 *   "materials": [
 *     {
 *       "id": 21,
 *       "title": "Apostila de Matemática",
 *       "class_name": "Turma A - Matemática",
 *       "type_file": "PDF",
 *       "archive": "uploads/materials/apostila.pdf",
 *       "updated_at": "2025-10-21T15:45:00Z"
 *     },
 *     {
 *       "id": 22,
 *       "title": "Slides Aula 3",
 *       "class_name": "Turma A - Matemática",
 *       "type_file": "PPT",
 *       "archive": "uploads/materials/slides3.pptx",
 *       "updated_at": "2025-10-20T09:12:00Z"
 *     }
 *   ]
 * }
 * 
 * @description
 * Essa rota retorna todos os materiais cadastrados para uma turma específica,
 * incluindo título, tipo de arquivo, nome da turma e data de atualização.
 */
router.get('/material/class/:class_id', materialController.getMaterialsClass)



/**
 * @route GET /materials/student
 * @group Materials - Operações relacionadas a materiais didáticos
 * @summary Retorna todos os materiais de todas as turmas do aluno logado (sessão).
 * @returns {Object} 200 - Sucesso: Retorna estatísticas e lista de materiais.
 * @returns {boolean} 200.status - Indica se a requisição foi bem-sucedida.
 * @returns {Array} 200.stats - Lista de estatísticas (ex: total de materiais).
 * @returns {Array} 200.materials - Lista de materiais de todas as turmas do aluno.
 * @returns {Object} 401 - Não autorizado (aluno não logado).
 * @returns {Object} 500 - Erro interno do servidor.
 */
router.get('/material/student', materialController.getStudentMaterials)

router.get(`/material/updates/:course_id`, materialController.getRecentUpdates)


module.exports = router
