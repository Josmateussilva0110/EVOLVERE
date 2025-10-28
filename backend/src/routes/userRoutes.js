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



/**
 * @route PUT /user/photo/:id
 * @description Atualiza a foto de um usuário específico.
 * 
 * @param {string} id - ID do usuário (passado como parâmetro de rota).
 * @param {FormData} photo - Arquivo de imagem enviado no campo "photo".
 * 
 * @returns {Object} Retorna um JSON indicando se a atualização foi bem-sucedida:
 *  - status: boolean
 *  - message: string
 * 
 * @example
 * // Exemplo de requisição usando fetch e FormData
 * const formData = new FormData();
 * formData.append("photo", fileInput.files[0]);
 * 
 * fetch("/user/photo/123", {
 *   method: "PUT",
 *   body: formData
 * }).then(res => res.json()).then(data => console.log(data));
 */
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


/**
 * @route GET /user/photo/:id
 * @description Retorna a foto de um usuário específico pelo ID.
 * 
 * @param {string} id - ID do usuário (passado como parâmetro de rota).
 * 
 * @returns {Object|undefined} Retorna um objeto com a propriedade `photo` contendo
 *  o caminho/URL da imagem do usuário, ou `undefined` caso o usuário não exista
 *  ou não possua foto.
 * 
 * @example
 * // GET /user/photo/123
 * {
 *   "photo": "/uploads/user123.jpg"
 * }
 */
router.get("/user/photo/:id", userController.findPhoto)

/**
 * @route PUT /user/photo/delete/:id
 * @description Remove a foto de um usuário específico, definindo o campo `photo` como `null`.
 * 
 * @param {string} id - ID do usuário (passado como parâmetro de rota).
 * 
 * @returns {Object} Retorna um JSON indicando o resultado da operação:
 *  - status: boolean
 *  - message: string
 * 
 * @example
 * // PUT /user/photo/delete/123
 * {
 *   "status": true,
 *   "message": "Foto removida com sucesso!"
 * }
 */
router.put("/user/photo/delete/:id", userController.removePhoto)

/**
 * @route GET /user/expire/session/:id
 * @description Busca a sessão ativa de um usuário pelo ID e retorna sua data de expiração.
 * 
 * @param {string} id - ID do usuário (passado como parâmetro de rota).
 * 
 * @returns {Object|undefined} Retorna um objeto com a propriedade `expire` indicando
 *  a data de expiração da sessão, ou `undefined` caso não haja sessão ativa
 *  ou ocorra algum erro.
 * 
 * @example
 * // GET /user/expire/session/123
 * {
 *   "expire": "2025-10-08T23:59:59.000Z"
 * }
 */
router.get("/user/expire/session/:id", userController.findSessionById)

/**
 * @route PATCH /user/edit/:id
 * @description Atualiza as informações de um usuário específico, incluindo username, email e senha.
 * 
 * @param {string} id - ID do usuário (passado como parâmetro de rota).
 * @param {Object} body - Dados enviados no corpo da requisição.
 * @param {string} [body.username] - Novo nome de usuário.
 * @param {string} [body.email] - Novo email.
 * @param {string} [body.current_password] - Senha atual (necessária para alterar a senha).
 * @param {string} [body.password] - Nova senha.
 * @param {string} [body.confirm_password] - Confirmação da nova senha.
 * 
 * @returns {Object} Retorna um JSON com o status e a mensagem da operação:
 *  - status: boolean
 *  - message: string
 * 
 * @example
 * // PATCH /user/edit/123
 * {
 *   "username": "novoUsuario",
 *   "email": "novo@email.com",
 *   "current_password": "senhaAtual",
 *   "password": "novaSenha",
 *   "confirm_password": "novaSenha"
 * }
 */
router.patch("/user/edit/:id", userController.edit)

router.patch("/user/join/course", userController.joinCourse)


module.exports = router
