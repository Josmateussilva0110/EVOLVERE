const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const pdfUpload = require("../middleware/Archive")

/**
 * @module accountRoutes
 * @description Rotas de contas, solicitações, professores e coordenadores.
 */


/**
 * @route POST /user/account
 * @summary Regista uma conta profissional com upload de diploma PDF.
 * @param {number} role.body.required - Papel do utilizador (2 = coordenador, 3 = professor).
 * @param {string} institution.body.required - Nome da instituição.
 * @param {string} access_code.body.required - Código de acesso do curso.
 * @param {file} diploma.formData.required - Arquivo PDF do diploma (máx. 5MB).
 * @returns {object} 201 - Conta criada com sucesso.
 * @returns {object} 422 - Dados inválidos ou já possui conta.
 * @returns {object} 400 - Erro no upload do ficheiro.
 * @example request - registo de conta
 * {
 *   "role": 3,
 *   "institution": "Universidade XPTO",
 *   "access_code": "ABC123"
 * }
 */
router.post("/user/account", (request, response, next) => {
    pdfUpload.single("diploma")(request, response, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return response.status(400).json({ status: false, message: "O ficheiro excede 5 MB." })
            }
            return response.status(400).json({ status: false, message: err.message })
        }
        next()
    })
}, accountController.addRole)



/**
 * @route GET /user/requests/:id
 * @summary Lista solicitações de professores pendentes de aprovação.
 * @param {number} id.path.required - ID do coordenador.
 * @returns {object} 200 - Lista de solicitações.
 * @returns {object} 404 - Nenhuma solicitação encontrada.
 * @example response - sucesso
 * {
 *   "status": true,
 *   "data": [
 *     { "id": 10, "username": "Carlos", "role": "Professor" }
 *   ]
 * }
 */
router.get('/user/requests/:id', accountController.requests)

/**
 * @route DELETE /user/request/:id_user
 * @summary Remove uma solicitação de aprovação.
 * @param {number} id_user.path.required - ID do utilizador.
 * @returns {object} 200 - Solicitação removida.
 * @returns {object} 404 - Solicitação não encontrada.
 */
router.delete('/user/request/:id_user', accountController.removeRequest)

/**
 * @route PATCH /user/request/approved/:id_user
 * @summary Aprova a solicitação de um utilizador.
 * @param {number} id_user.path.required - ID do utilizador.
 * @returns {object} 200 - Conta aprovada com sucesso.
 * @returns {object} 404 - Solicitação não encontrada.
 */
router.patch('/user/request/approved/:id_user', accountController.approve)


/**
 * @route GET /users/professores
 * @summary Lista todos os professores validados.
 * @returns {object} 200 - Lista de professores.
 * @returns {object} 404 - Nenhum professor encontrado.
 */
router.get('/users/professores', accountController.getProfessoresValidados)

/**
 * @route GET /user/teachers/:id
 * @summary Retorna todos os professores aprovados de um coordenador.
 * @param {number} id.path.required - ID do coordenador.
 * @returns {object} 200 - Lista de professores.
 * @returns {object} 404 - Nenhum professor encontrado.
 */
router.get('/user/teachers/:id', accountController.getTeachers)

/**
 * @route DELETE /user/teacher/:id
 * @summary Remove um professor.
 * @param {number} id.path.required - ID do professor.
 * @returns {object} 200 - Professor removido.
 * @returns {object} 404 - Professor não encontrado.
 */
router.delete('/user/teacher/:id', accountController.deleteTeacher)

/**
 * @route GET /user/coordinator/:id
 * @summary Retorna dados de um coordenador.
 * @param {number} id.path.required - ID do coordenador.
 * @returns {object} 200 - Dados do coordenador.
 * @returns {object} 404 - Coordenador não encontrado.
 */
router.get('/user/coordinator/:id', accountController.getCoordinatorData)

/**
 * @route GET /user/coordinator/kpi/:id
 * @summary Retorna KPIs do dashboard do coordenador.
 * @param {number} id.path.required - ID do coordenador.
 * @returns {object} 200 - Objeto com KPIs.
 * @returns {object} 404 - Coordenador não encontrado.
 * @example response
 * {
 *   "teachers": 5,
 *   "subjects": 12,
 *   "requests": 3
 * }
 */
router.get('/user/coordinator/kpi/:id', accountController.getKpis)




module.exports = router
