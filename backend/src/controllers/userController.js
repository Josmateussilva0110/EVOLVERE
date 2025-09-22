const User = require("../models/User")
const Account = require("../models/Account")
const bcrypt = require("bcrypt")
const UserFieldValidator = require("../utils/userValidator")
const path = require("path")
require('dotenv').config({ path: '../.env' })
const fs = require("fs")
const validator = require('validator')
const { customAlphabet } = require('nanoid')
const Course = require("../models/Course")

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

            const code = customAlphabet('0123456789', 8);

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

            request.session.user = { id: user.id, name: user.username }
            return response.status(200).json({status: true, message: "Dados salvo com sucesso.", user: { id: user.id, name: user.username }})

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

            request.session.user = { id: user.id, name: user.username }
            return response.status(200).json({
                status: true,
                message: "Login realizado com sucesso.",
                user: { id: user.id, name: user.username }
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
     * Adiciona um papel (role) e dados profissionais ao usuário.
     * - Valida instituição e código de acesso.
     * - Exige upload de diploma em PDF.
     * - Cria uma conta vinculada ao usuário.
     *
     * @async
     * @param {import("express").Request} request
     * @param {Object} request.body
     * @param {number|string} request.body.id - ID do usuário.
     * @param {string} request.body.institution - Nome da instituição (3-50 caracteres).
     * @param {number|string} request.body.access_code - Código de acesso válido.
     * @param {string} request.body.role - Papel a ser atribuído ao usuário.
     * @param {import("express").Request} request.file - Arquivo PDF do diploma.
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON com status da operação.
     *
     * @throws {400} Upload obrigatório.
     * @throws {422} Dados inválidos.
     * @throws {404} Curso não encontrado.
     * @throws {500} Erro interno do servidor.
     *
     * @example
     * // Requisição POST /addRole
     * {
     *   "id": 5,
     *   "institution": "Universidade X",
     *   "access_code": "123456",
     *   "role": "professor"
     * }
     *
     * @example
     * // Resposta em caso de sucesso
     * { "status": true, "message": "Conta cadastrada com sucesso." }
     */
    async addRole(request, response) {
        try {
            const { id, institution, access_code, role } = request.body
            let diplomaPath = null

            if (id >= 1 && id <= 4) {
                return response.status(422).json({
                    status: false,
                    message: "Não permitido, você já é admin",
                })
            }

            const course_valid = await Course.getCourseByCode(access_code)
            if(!course_valid) {
                return response.status(404).json({status: false, message: "Nenhum curso encontrado com esse código"})
            }
            if (!request.file) {
                return response.status(400).json({ status: false, message: "O upload de um PDF é obrigatório" })
            }

            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Usuário invalido."})
            }

            if (!validator.isInt(access_code + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Código de acesso invalido."})
            }

            if (validator.isEmpty(institution || '') || !validator.isLength(institution, { min: 3, max: 50 })) {
                return response.status(422).json({status: false, message: "Nome de instituição invalido."})
            }

            const accountExists = await Account.accountExists(id)
            if(accountExists) {
                return response.status(422).json({status: false, message: "Usuário já tem conta."})
            }

            const rootDir = path.join(__dirname, "..", "..")
            const uploadDir = path.join(rootDir, "public", "diplomas")

            fs.mkdirSync(uploadDir, { recursive: true })
            const uniqueName = Date.now() + "_" + Math.floor(Math.random() * 100) + path.extname(request.file.originalname)
            const finalPath = path.join(uploadDir, uniqueName)

            diplomaPath = path.join("diplomas", uniqueName)
 
            const data = {
                professional_id: id,
                institution,
                access_code,
                diploma: diplomaPath, 
                role
            }

            const valid = await Account.save(data)
            if(!valid) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar usuário."})
            }

            fs.writeFileSync(finalPath, request.file.buffer)
            return response.status(200).json({status: true, message: "Conta cadastrada com sucesso."})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new UserController()
