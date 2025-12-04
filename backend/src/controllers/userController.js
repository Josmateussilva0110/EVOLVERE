const User = require("../models/User")
const Course = require("../models/Course")
const bcrypt = require("bcrypt")
const UserFieldValidator = require("../utils/userValidator")
const validator = require('validator')
require("dotenv").config()
const { customAlphabet } = require('nanoid')
const cloudinary = require("../utils/cloudinary")


/**
 * Controlador de Usuários.
 * Responsável por registro, login, sessões e associação de contas a papéis (roles).
 */
class UserController {

    /**
     * Registra um novo usuário no sistema.
     * - Valida os campos enviados.
     * - Gera um código de matrícula único.
     * - Cria hash da senha e salva no banco.
     * - Cria sessão automática após cadastro.
     *
     * @async
     * @param {import("express").Request} request - Objeto de requisição do Express.
     * @param {Object} request.body
     * @param {string} request.body.username - Nome do usuário (3-30 caracteres).
     * @param {string} request.body.email - Email válido.
     * @param {string} request.body.password - Senha (mínimo 6 caracteres).
     * @param {string} request.body.confirm_password - Confirmação da senha.
     * @param {import("express").Response} response - Objeto de resposta do Express.
     * @returns {Promise<Object>} JSON com status, mensagem e dados do usuário.
     *
     * @throws {422} Campos inválidos.
     * @throws {500} Erro interno do servidor.
     *
     * @example
     * // Requisição POST /register
     * {
     *   "username": "mateus",
     *   "email": "mateus@email.com",
     *   "password": "123456",
     *   "confirm_password": "123456"
     * }
     *
     * @example
     * // Resposta em caso de sucesso
     * {
     *   "status": true,
     *   "message": "Dados salvo com sucesso.",
     *   "user": { "id": 1, "name": "mateus" }
     * }
     */
    async register(request, response) {
        try {
            const {username, email, password, confirm_password} = request.body
            const error = UserFieldValidator.validate({username, email, password, confirm_password})
            if (error) return response.status(422).json({ status: false, message: error })

            const emailExist = await User.emailExists(email)
            if(emailExist) {
                return response.status(422).json({status: false, message: "Email já existe."})
            }

            const code = customAlphabet('0123456789', 8)

            let registration
            let isUnique = false

            while (!isUnique) {
                const newCode = code()
                const exists = await User.registrationExists(newCode)
                if (!exists) {
                    registration = newCode
                    isUnique = true
                }
            }

            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)
            const data = {
                username,
                email,
                password: passwordHash,
                registration,
            }

            const valid = await User.save(data)
            if(!valid) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar usuário."})
            }

            const user = await User.findByEmail(email)
            if(!user) {
                return response.status(400).json({status: false, message: "Erro ao criar token para usuário."})
            }

            if(user.role === null) {
                user.role = 4
            }

            console.log('user: ', user)


            request.session.user = { id: user.id, name: user.username, role: user.role}
            return response.status(200).json({status: true, message: "Dados salvo com sucesso.", user: { id: user.id, name: user.username, role: user.role}})

        } catch(err) {
            console.error("Erro no cadastro de usuários:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Realiza login do usuário.
     * - Valida email e senha.
     * - Verifica credenciais no banco.
     * - Cria sessão em caso de sucesso.
     *
     * @async
     * @param {import("express").Request} request
     * @param {Object} request.body
     * @param {string} request.body.email - Email do usuário.
     * @param {string} request.body.password - Senha do usuário.
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON com status e dados do usuário autenticado.
     *
     * @throws {422} Campos inválidos ou senha incorreta.
     * @throws {404} Email não encontrado.
     * @throws {500} Erro interno do servidor.
     *
     * @example
     * // Requisição POST /login
     * { "email": "mateus@email.com", "password": "123456" }
     *
     * @example
     * // Resposta em caso de sucesso
     * {
     *   "status": true,
     *   "message": "Login realizado com sucesso.",
     *   "user": { "id": 1, "name": "mateus" }
     * }
     */
    async login(request, response) {
        try {
            const { email, password } = request.body
            const error = UserFieldValidator.validate({ email, password })
            if (error) return response.status(422).json({ status: false, message: error })

            const user = await User.findByEmail(email)
            if (!user) {
                return response.status(404).json({ status: false, message: "Email não encontrado." })
            }

            const checkPassword = await bcrypt.compare(password, user.password)
            if (!checkPassword) {
                return response.status(422).json({ status: false, message: "Senha incorreta" })
            }

            if(user.registration === 'admin') {
                user.role = 1
            }

            if(user.role == null) {
                user.role = 4
            }


            request.session.user = { id: user.id, name: user.username, role: user.role }
            return response.status(200).json({
                status: true,
                message: "Login realizado com sucesso.",
                user: { id: user.id, name: user.username, role: user.role }
            })
        } catch (err) {
            console.error("Erro no login:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Busca informações de um usuário pelo ID.
     *
     * @async
     * @param {import("express").Request} request
     * @param {Object} request.params
     * @param {string|number} request.params.id - ID do usuário.
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON com status e dados do usuário.
     *
     * @throws {422} ID inválido.
     * @throws {404} Usuário não encontrado.
     * @throws {500} Erro interno do servidor.
     *
     * @example
     * // Requisição GET /user/1
     * {}
     *
     * @example
     * // Resposta em caso de sucesso
     * { "status": true, "user": { "id": 1, "username": "mateus", "email": "mateus@email.com" } }
     */
    async getUserById(request, response) {
        try {
            const {id} = request.params
            const error = UserFieldValidator.validate({id})

            if (error) {
                return response.status(422).json({ status: false, message: error })
            }

            const user = await User.findById(id)
            if(!user) {
                return response.status(404).json({ status: false, message: "Usuário não encontrado." })
            }
            return response.status(200).json({status: true, user})

        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
     * Retorna informações da sessão ativa.
     *
     * @async
     * @param {import("express").Request} request
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON com dados do usuário logado ou erro de autenticação.
     *
     * @throws {401} Se não houver usuário autenticado.
     *
     * @example
     * // Requisição GET /session
     * {}
     *
     * @example
     * // Resposta em caso de sessão ativa
     * { "success": true, "user": { "id": 1, "name": "mateus" } }
     */
    async session(request, response) {
        if (request.session && request.session.user) {
            return response.status(200).json({ success: true, user: request.session.user })
        } else {
            return response.status(401).json({ success: false, message: "Usuário não autenticado" })
        }
    }

    /**
     * Encerra a sessão do usuário (logout).
     *
     * @async
     * @param {import("express").Request} request
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON confirmando logout ou erro.
     *
     * @throws {500} Se ocorrer erro ao destruir a sessão.
     *
     * @example
     * // Requisição POST /logout
     * {}
     *
     * @example
     * // Resposta em caso de sucesso
     * { "success": true, "message": "Logout feito com sucesso" }
     */
    async logout(request, response) {
        request.session.destroy(err => {
            if (err) {
                return response.status(500).json({ success: false, message: "Erro ao sair" })
            }
            response.clearCookie('connect.sid')
            return response.status(200).json({ success: true, message: "Logout feito com sucesso" })
        })
    }


    
    /**
     * Lista todos os alunos.
     */
    async getStudents(request, response) {
        try {
            const {id} = request.params
            const error = UserFieldValidator.validate({id})
            if (error) return response.status(422).json({ status: false, message: error })
            const admin = await User.isAdmin(id)
            let students = []
            if(!admin) {
                const coordinator = await User.findById(id)
                if(!coordinator) {
                    return response.status(404).json({status: false, message: "Nenhum coordenador encontrado."})
                }
                students = await User.findAllStudentsByCoordinator(coordinator.access_code)
            }
            else {
                students = await User.findAllStudents()
            }
            return response.status(200).json({ status: true, data: students })
        } catch (err) {
            console.error("Erro ao listar alunos:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
         Apaga um aluno.
     */
    async deleteStudent(request, response) {
        try {
            const { id } = request.params
            const error = UserFieldValidator.validate({id})
            if (error) return response.status(422).json({ status: false, message: error })
            const success = await User.deleteById(Number(id))

            if (!success) {
                return response.status(404).json({ status: false, message: 'Aluno não encontrado.' })
            }

            return response.status(200).json({ status: true, message: 'Aluno apagado com sucesso.' })
        } catch (err) {
            console.error("Erro ao apagar aluno:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
     * Atualiza a foto de perfil de um usuário específico.
     * 
     * @async
     * @function editPhoto
     * @memberof UserController
     * 
     * @param {import('express').Request} request - Objeto de requisição do Express.  
     *   Deve conter:
     *   - `params.id`: ID do usuário (numérico e válido).  
     *   - `file`: Arquivo de imagem PNG enviado via `multipart/form-data`.
     * @param {import('express').Response} response - Objeto de resposta do Express.
     * 
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON com:
     *  - `status`: booleano indicando sucesso ou falha.  
     *  - `message`: mensagem de status da operação.
     * 
     * @throws {Error} Retorna erro 500 caso ocorra falha interna no servidor.
     * 
     * @example
     * // Exemplo de rota usando o método editPhoto
     * const express = require("express")
     * const multer = require("multer")
     * const router = express.Router()
     * const UserController = require("../controllers/UserController")
     * 
     * // Configuração do multer (armazenamento em memória)
     * const storage = multer.memoryStorage()
     * const upload = multer({
     *   storage,
     *   fileFilter: (req, file, cb) => {
     *     if (file.mimetype !== "image/png") {
     *       return cb(new Error("Apenas imagens PNG são permitidas."))
     *     }
     *     cb(null, true)
     *   }
     * })
     * 
     * // Rota: PATCH /users/:id/photo
     * router.patch("/users/:id/photo", upload.single("photo"), UserController.editPhoto)
     * 
     * // Requisição de exemplo (multipart/form-data):
     * // PATCH /users/3/photo
     * // Form-data:
     * //  - photo: (arquivo.png)
     * //
     * // Resposta de sucesso (HTTP 200):
     * // {
     * //   "status": true,
     * //   "message": "Foto atualizada com sucesso."
     * // }
     * //
     * // Resposta de erro (HTTP 400):
     * // {
     * //   "status": false,
     * //   "message": "O upload de uma imagem PNG é obrigatório."
     * // }
     */
    async editPhoto(request, response) {
        try {
            const { id } = request.params
            const error = UserFieldValidator.validate({ id })
            if (error) {
                return response.status(422).json({ status: false, message: error })
            }

            const user = await User.findById(id)
            if (!user) {
                return response.status(404).json({ status: false, message: "Usuário não encontrado." })
            }

            if (!request.file) {
                return response.status(400).json({
                    status: false,
                    message: "O upload de uma imagem é obrigatório."
                })
            }

            const uploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "evolvere/users",
                        resource_type: "image"
                    },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )

                uploadStream.end(request.file.buffer)
            })

            const uploadedImage = await uploadPromise
            const imageUrl = uploadedImage.secure_url

            const updated = await User.updatePhoto(id, imageUrl)
            if (!updated) {
                return response.status(500).json({
                    status: false,
                    message: "Erro ao atualizar a foto do usuário."
                })
            }

            return response.status(200).json({
                status: true,
                message: "Foto atualizada com sucesso.",
                url: imageUrl, 
            })

        } catch (err) {
            console.error("Erro ao adicionar imagem:", err)
            return response.status(500).json({
                status: false,
                message: "Erro interno no servidor."
            })
        }
    }


    /**
     * Busca a foto de perfil de um usuário pelo seu ID.
     * 
     * @async
     * @function findPhoto
     * @memberof UserController
     * 
     * @param {import('express').Request} request - Objeto de requisição do Express.  
     * Deve conter o parâmetro `id` em `request.params`.
     * @param {import('express').Response} response - Objeto de resposta do Express.
     * 
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON com:
     *  - `status`: booleano indicando sucesso ou falha.  
     *  - `photo`: caminho relativo da imagem do usuário, se encontrada.  
     *  - `message`: mensagem de erro, se aplicável.
     * 
     * @throws {Error} Retorna erro 500 em caso de falha interna no servidor.
     * 
     * @example
     * // Exemplo de rota usando o método findPhoto
     * const express = require("express")
     * const router = express.Router()
     * const UserController = require("../controllers/UserController")
     * 
     * // Rota: GET /users/:id/photo
     * router.get("/users/:id/photo", UserController.findPhoto)
     * 
     * // Requisição de exemplo:
     * // GET /users/3/photo
     * //
     * // Resposta de sucesso (HTTP 200):
     * // {
     * //   "status": true,
     * //   "photo": "images/users/1728403200000_12.png"
     * // }
     * //
     * // Resposta de erro (HTTP 404):
     * // {
     * //   "status": false,
     * //   "message": "Foto não encontrada"
     * // }
     */
    async findPhoto(request, response) {
        try {
            const { id } = request.params 
            const error = UserFieldValidator.validate({ id })
            if (error) return response.status(422).json({ status: false, message: error })
            const photo = await User.findPhoto(id)
            if(photo === undefined) {
                return response.status(404).json({status: false, message: "Foto não encontrada"})
            }
            return response.status(200).json({status: true, photo})
        } catch(err) {
            console.error("Erro ao buscar foto:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
     * Remove a foto de perfil de um usuário pelo seu ID.
     * 
     * @async
     * @function removePhoto
     * @memberof UserController
     * 
     * @param {import('express').Request} request - Objeto de requisição do Express.  
     * Deve conter o parâmetro `id` em `request.params`.
     * @param {import('express').Response} response - Objeto de resposta do Express.
     * 
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON com:
     *  - `status`: booleano indicando sucesso ou falha.  
     *  - `message`: mensagem de status da operação.
     * 
     * @throws {Error} Retorna erro 500 em caso de falha interna no servidor.
     * 
     * @example
     * // Exemplo de rota usando o método removePhoto
     * const express = require("express")
     * const router = express.Router()
     * const UserController = require("../controllers/UserController")
     * 
     * // Rota: DELETE /users/:id/photo
     * router.delete("/users/:id/photo", UserController.removePhoto)
     * 
     * // Requisição de exemplo:
     * // DELETE /users/3/photo
     * //
     * // Resposta de sucesso (HTTP 200):
     * // {
     * //   "status": true,
     * //   "message": "Foto removida com sucesso"
     * // }
     * //
     * // Resposta de erro (HTTP 404):
     * // {
     * //   "status": false,
     * //   "message": "Foto não encontrada"
     * // }
     */
    async removePhoto(request, response) {
        try {
            const { id } = request.params 
            const error = UserFieldValidator.validate({ id })
            if (error) return response.status(422).json({ status: false, message: error })
            const photo = await User.findPhoto(id)
            if(photo === undefined) {
                return response.status(404).json({status: false, message: "Foto não encontrada"})
            }
            const valid = await User.deletePhoto(id)
            if(!valid) {
                return response.status(500).json({ status: false, message: "Erro ao remover foto." })
            }
            return response.status(200).json({ status: true, message: "Foto removida com sucesso" })
        } catch(err) {
            console.error("Erro ao buscar foto:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
     * Busca os dados da sessão de um usuário com base no seu ID.
     * 
     * @async
     * @function findSessionById
     * @memberof UserController
     * 
     * @param {import('express').Request} request - Objeto de requisição do Express.  
     * Deve conter o parâmetro `id` em `request.params`.
     * @param {import('express').Response} response - Objeto de resposta do Express.
     * 
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON com:
     *  - `status`: booleano indicando sucesso ou falha.  
     *  - `session`: objeto contendo os dados da sessão do usuário, se encontrada.  
     *  - `message`: mensagem de erro, se aplicável.
     * 
     * @throws {Error} Retorna erro 500 em caso de falha interna no servidor.
     * 
     * @example
     * // Exemplo de rota usando o método findSessionById
     * const express = require("express")
     * const router = express.Router()
     * const UserController = require("../controllers/UserController")
     * 
     * // Rota: GET /users/:id/session
     * router.get("/users/:id/session", UserController.findSessionById)
     * 
     * // Requisição de exemplo:
     * // GET /users/3/session
     * //
     * // Resposta de sucesso (HTTP 200):
     * // {
     * //   "status": true,
     * //   "session": {
     * //     "session_id": "abc123xyz",
     * //     "user_id": 3,
     * //     "expires_at": "2025-10-08T20:30:00.000Z"
     * //   }
     * // }
     * //
     * // Resposta de erro (HTTP 404):
     * // {
     * //   "status": false,
     * //   "message": "Sessão não encontrada"
     * // }
     */
    async findSessionById(request, response) {
        try {
            const { id } = request.params 
            const error = UserFieldValidator.validate({ id })
            if (error) return response.status(422).json({ status: false, message: error })
            const session = await User.findSessionById(id)
            if(!session) {
                return response.status(404).json({status: false, message: "Sessão não encontrada"})
            }
            return response.status(200).json({status: true, session})
        } catch(err) {
            console.error("Erro ao sessão:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Atualiza as informações de um usuário.
     * 
     * @async
     * @function edit
     * @param {Object} request - Objeto de requisição do Express.
     * @param {Object} request.params - Parâmetros da URL.
     * @param {string} request.params.id - ID do usuário a ser atualizado.
     * @param {Object} request.body - Dados enviados no corpo da requisição.
     * @param {string} [request.body.username] - Novo nome de usuário.
     * @param {string} [request.body.email] - Novo email.
     * @param {string} [request.body.current_password] - Senha atual (necessária para alterar a senha).
     * @param {string} [request.body.password] - Nova senha.
     * @param {string} [request.body.confirm_password] - Confirmação da nova senha.
     * @param {Object} response - Objeto de resposta do Express.
     * 
     * @returns {Promise<Object>} Retorna um JSON com o status e a mensagem da operação.
     * 
     * @throws {Error} Lança erro em caso de falha interna no servidor.
     * 
     * @example
     * // PATCH /users/123
     * {
     *   "username": "novoUsuario",
     *   "email": "novo@email.com",
     *   "current_password": "senhaAtual",
     *   "password": "novaSenha",
     *   "confirm_password": "novaSenha"
     * }
     */
    async edit(request, response) {
        try {
            const { id } = request.params
            const { username, email, current_password, password, confirm_password } = request.body
            const update = {}

            const user = await User.findById(id)
            if (!user) {
                return response.status(404).json({ status: false, message: "Usuário não encontrado" })
            }

            if (username && username !== user.username) {
                update.username = username
            }


            if (email && email !== user.email) {
                const emailExist = await User.emailExists(email)
                if (emailExist) {
                    return response.status(422).json({ status: false, message: "Email já existe" })
                }
                update.email = email
            }

            if (current_password || password || confirm_password) {
                if (!current_password || !password || !confirm_password) {
                    return response.status(422).json({
                    status: false,
                    message: "Para alterar a senha, preencha todos os campos de senha.",
                    })
                }

                const checkPassword = await bcrypt.compare(current_password, user.password)
                if (!checkPassword) {
                    return response.status(422).json({ status: false, message: "Senha atual incorreta." })
                }

                if (password !== confirm_password) {
                    return response.status(422).json({ status: false, message: "As senhas não coincidem." })
                }

                const salt = await bcrypt.genSalt(10)
                const passwordHash = await bcrypt.hash(password, salt)
                update.password = passwordHash
            }

            if (Object.keys(update).length === 0) {
            return response.status(400).json({ status: false, message: "Nenhuma alteração foi feita." })
            }

            const valid = await User.updateUser(id, update)
            if (!valid) {
            return response.status(500).json({ status: false, message: "Erro ao atualizar usuário." })
            }

            return response.status(200).json({ status: true, message: "Usuário atualizado com sucesso." })
        } catch (err) {
            console.error("Erro ao editar usuário:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async joinCourse(request, response) {
        try {
            const {user_id, course_id} = request.body
            if (!validator.isInt(user_id + '', { min: 1 })) {
                return res.status(422).json({ success: false, message: "Usuário invalido." });
            }

            if (!validator.isInt(course_id + '', { min: 1 })) {
                return res.status(422).json({ success: false, message: "Curso invalido." });
            }


            const user = await User.findById(user_id)
            if(!user) {
                return response.status(404).json({ status: false, message: "Usuário não encontrado." })
            }

            const courseExist = Course.courseExists(course_id)
            if(!courseExist) {
                return response.status(404).json({ status: false, message: "Curso não encontrado." })
            }

            const data = {
                course_id
            }

            const valid = await User.updateCourse(user_id, data)
            if(!valid) {
                return response.status(500).json({ status: false, message: "Erro ao vincular curso ao aluno." })
            }

            return response.status(200).json({ status: true, message: "Aluno vinculado ao curso com sucesso." })


        } catch(err) {
            console.error("Erro ao vincular usuário ao curso:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new UserController()
