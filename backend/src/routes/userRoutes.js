const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const uploadImage = require("../middleware/uploadImage")

/**
 * @module userRoutes
 * @description Rotas relacionadas a utilizadores (autenticação, registo, contas, alunos e professores).
 */

/**
 * @route POST /login
 * @summary Realiza o login do utilizador.
 * @param {string} email.body.required - Email do utilizador.
 * @param {string} password.body.required - Senha do utilizador.
 * @returns {object} 200 - Sessão criada com sucesso.
 * @returns {object} 422 - Credenciais inválidas.
 * @returns {object} 404 - Utilizador não encontrado.
 * @example request - login
 * {
 *   "email": "joao@email.com",
 *   "password": "123456"
 * }
 */
router.post('/login', userController.login)

/**
 * @route POST /user/register
 * @summary Regista um novo utilizador.
 * @param {string} username.body.required - Nome do utilizador.
 * @param {string} email.body.required - Email do utilizador.
 * @param {string} password.body.required - Senha.
 * @param {string} confirm_password.body.required - Confirmação de senha.
 * @returns {object} 201 - Utilizador registado e sessão criada.
 * @returns {object} 422 - Email já existente ou dados inválidos.
 * @example request - registo
 * {
 *   "username": "João Silva",
 *   "email": "joao@email.com",
 *   "password": "123456",
 *   "confirm_password": "123456"
 * }
 */
router.post('/user/register', userController.register)

/**
 * @route POST /user/logout
 * @summary Encerra a sessão atual.
 * @returns {object} 200 - Logout realizado com sucesso.
 * @returns {object} 500 - Erro interno.
 */
router.post('/user/logout', userController.logout)

/**
 * @route GET /user/session
 * @summary Retorna informações do utilizador autenticado.
 * @returns {object} 200 - Dados do utilizador autenticado.
 * @returns {object} 401 - Não autenticado.
 */
router.get('/user/session', userController.session)

/**
 * @route GET /user/:id
 * @summary Obtém dados de um utilizador pelo ID.
 * @param {number} id.path.required - ID do utilizador.
 * @returns {object} 200 - Dados do utilizador.
 * @returns {object} 404 - Utilizador não encontrado.
 */
router.get('/user/:id', userController.getUserById)



/**
 * @route GET /users/students
 * @summary Lista todos os alunos registados.
 * @returns {object} 200 - Lista de alunos.
 * @returns {object} 404 - Nenhum aluno encontrado.
 */
router.get('/users/students/:id', userController.getStudents)

/**
 * @route DELETE /users/students/:id
 * @summary Remove um aluno pelo ID.
 * @param {number} id.path.required - ID do aluno.
 * @returns {object} 200 - Aluno apagado com sucesso.
 * @returns {object} 404 - Aluno não encontrado.
 */
router.delete('/users/students/:id', userController.deleteStudent)

router.put("/user/photo/:id", (request, response, next) => {
    uploadImage.single("photo")(request, response, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return response.status(400).json({ status: false, message: "A imagem excede o limite de 5 MB." })
            }
            return response.status(400).json({ status: false, message: err.message })
        }
        next()
    })
}, userController.editPhoto)

router.get("/user/photo/:id", userController.findPhoto)
router.put("/user/photo/delete/:id", userController.removePhoto)
router.get("/user/expire/session/:id", userController.findSessionById)

module.exports = router
