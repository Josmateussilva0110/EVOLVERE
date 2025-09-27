const express = require("express")
const pdfUpload = require("../middleware/Archive")
const router = express.Router()
const userController = require("../controllers/userController")
const courseController = require("../controllers/courseController")
const accountController = require("../controllers/accountController")
const subjectController = require("../controllers/subjectController") 

/**
 * @module routes
 * @description Define as rotas da API para usuários, cursos e disciplinas.
 */


/**
 * @module routes
 * @description Define as rotas da API para usuários e cursos.
 */

/**
 * ROTAS DE USUÁRIOS
 */

/**
 * @route POST /login
 * @group Usuários - Operações de login e registro
 * @summary Realiza login do usuário
 * @param {string} email.body.required - Email do usuário
 * @param {string} password.body.required - Senha do usuário
 * @returns {object} 200 - Usuário autenticado e sessão criada
 * @returns {object} 422 - Erro de validação (senha incorreta ou campos inválidos)
 * @returns {object} 404 - Usuário não encontrado
 */
router.post('/login', userController.login)

/**
 * @route POST /user/register
 * @summary Registra um novo usuário
 * @param {string} username.body.required - Nome do usuário
 * @param {string} email.body.required - Email do usuário
 * @param {string} password.body.required - Senha
 * @param {string} confirm_password.body.required - Confirmação de senha
 * @returns {object} 200 - Usuário cadastrado e sessão criada
 * @returns {object} 422 - Erro de validação ou email já existente
 */
router.post('/user/register', userController.register)

/**
 * @route POST /user/logout
 * @summary Encerra a sessão do usuário
 * @returns {object} 200 - Logout realizado com sucesso
 * @returns {object} 500 - Erro interno ao encerrar a sessão
 */
router.post('/user/logout', userController.logout)


/**
 * @route GET /user/requests
 * @summary Retorna todas as solicitações de professores pendentes de aprovação
 * @returns {object} 200 - Lista de solicitações
 * @returns {object} 404 - Nenhuma solicitação encontrada
 * @returns {object} 500 - Erro interno do servidor
 */
router.get('/user/requests', accountController.requestsTeachers)

/**
 * @route GET /user/session
 * @summary Retorna informações da sessão atual do usuário
 * @returns {object} 200 - Dados do usuário logado
 * @returns {object} 401 - Usuário não autenticado
 */
router.get('/user/session', userController.session)

router.get('/user/teachers', accountController.getTeachers)

/**
 * @route GET /user/:id
 * @summary Obtém dados de um usuário pelo ID
 * @param {number} id.path.required - ID do usuário
 * @returns {object} 200 - Dados do usuário
 * @returns {object} 404 - Usuário não encontrado
 */
router.get('/user/:id', userController.getUserById)

router.get('/user/coordinator/:id', userController.getCoordinatorData)

/**
 * @route POST /user/account
 * @summary Cadastro de conta de profissional com upload de diploma PDF
 * @param {string} role.body.required - Papel do profissional
 * @param {string} institution.body.required - Nome da instituição
 * @param {string|number} access_code.body.required - Código de acesso do curso
 * @param {file} diploma.formData.required - Arquivo PDF do diploma (máx 5MB)
 * @returns {object} 200 - Conta cadastrada com sucesso
 * @returns {object} 400 - Erro no upload do arquivo (formato ou tamanho)
 * @returns {object} 422 - Dados inválidos ou usuário já possui conta
 */
router.post(
  "/user/account",
  (request, response, next) => {
    pdfUpload.single("diploma")(request, response, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return response.status(400).json({ status: false, message: "O arquivo excede 5 MB." })
        }
        return response.status(400).json({ status: false, message: err.message })
      }
      next()
    })
  },
  accountController.addRole
)

/**
 * ROTAS DE account
 */

/**
 * @route DELETE /user/request/{id_user}
 * @summary Remove uma solicitação de aprovação de professor
 * @param {number} id_user.path.required - ID do usuário cuja solicitação será removida
 * @returns {object} 200 - Solicitação removida com sucesso
 * @returns {object} 422 - ID inválido
 * @returns {object} 500 - Erro interno ao remover solicitação
 */
router.delete('/user/request/:id_user', accountController.removeRequest)



/**
 * @route PATCH /user/request/approved/{id_user}
 * @summary Aprova a solicitação de um professor
 * @param {number} id_user.path.required - ID do usuário a ser aprovado
 * @returns {object} 200 - Conta aprovada com sucesso
 * @returns {object} 422 - ID inválido
 * @returns {object} 500 - Erro interno ao aprovar
 */
router.patch('/user/request/approved/:id_user', accountController.approve)




/**
 * ROTAS DE CURSOS
 */

/**
 * @route GET /courses
 * @summary Obtém todos os cursos cadastrados
 * @returns {object} 200 - Lista de cursos
 * @returns {object} 404 - Nenhum curso encontrado
 */
router.get('/courses', courseController.getCourses)


/**
 * ROTAS DE DISCIPLINAS (SUBJECTS)
 */

/**
 * @route GET /subjects
 * @group Disciplinas - Operações com disciplinas
 * @summary Obtém todas as disciplinas cadastradas
 * @returns {object} 200 - Lista de disciplinas
 * @returns {object} 404 - Nenhuma disciplina encontrada
 */
router.get('/subjects', subjectController.list)

/**
 * @route POST /subjects
 * @summary Cria uma nova disciplina
 * @param {string} name.body.required - Nome da disciplina
 * @param {number} professional_id.body.required - ID do professor
 * @param {number} course_valid_id.body.required - ID do curso
 * @returns {object} 201 - Disciplina criada com sucesso
 * @returns {object} 400 - Dados inválidos
 */
router.post('/subjects', subjectController.create)

/**
 * @route GET /subjects/:id
 * @summary Obtém uma disciplina pelo ID
 * @param {number} id.path.required - ID da disciplina
 * @returns {object} 200 - Dados da disciplina
 * @returns {object} 404 - Disciplina não encontrada
 */
router.get('/subjects/:id', subjectController.getById)

/**
 * @route PUT /subjects/:id
 * @summary Atualiza uma disciplina
 * @param {number} id.path.required - ID da disciplina
 * @param {string} name.body.optional - Nome da disciplina
 * @param {number} professional_id.body.optional - ID do professor
 * @param {number} course_valid_id.body.optional - ID do curso
 * @returns {object} 200 - Disciplina atualizada com sucesso
 * @returns {object} 404 - Disciplina não encontrada
 */
router.put('/subjects/:id', subjectController.update)

/**
 * @route DELETE /subjects/:id
 * @summary Exclui uma disciplina
 * @param {number} id.path.required - ID da disciplina
 * @returns {object} 204 - Disciplina excluída com sucesso
 * @returns {object} 404 - Disciplina não encontrada
 */
router.delete('/subjects/:id', subjectController.delete)

/**
 * @route GET /users/professores
 * @group Usuários - Operações com usuários
 * @summary Lista professores validados
 * @returns {object} 200 - Lista de professores validados
 * @returns {object} 404 - Nenhum professor encontrado
 */
router.get('/users/professores', userController.getProfessoresValidados)

module.exports = router
