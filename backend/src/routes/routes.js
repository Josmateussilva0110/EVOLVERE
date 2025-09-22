const express = require("express")
const pdfUpload = require("../middleware/Archive")
const router = express.Router()
const userController = require("../controllers/userController")
const courseController = require("../controllers/courseController")

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
 * @route GET /user/session
 * @summary Retorna informações da sessão atual do usuário
 * @returns {object} 200 - Dados do usuário logado
 * @returns {object} 401 - Usuário não autenticado
 */
router.get('/user/session', userController.session)

/**
 * @route GET /user/:id
 * @summary Obtém dados de um usuário pelo ID
 * @param {number} id.path.required - ID do usuário
 * @returns {object} 200 - Dados do usuário
 * @returns {object} 404 - Usuário não encontrado
 */
router.get('/user/:id', userController.getUserById)

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
  userController.addRole
)

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

module.exports = router
