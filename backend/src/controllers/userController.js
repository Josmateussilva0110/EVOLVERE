const User = require("../models/User")
const bcrypt = require("bcrypt")
const UserFieldValidator = require("../utils/userValidator")
require('dotenv').config({ path: '../.env' })
const { customAlphabet } = require('nanoid')


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
     * Lista professores validados (role = 3 e approved = true)
     * 
     * @async
     * @param {import("express").Request} request
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON com lista de professores validados.
     */
    async getProfessoresValidados(request, response) {
        try {
            // Busca apenas professores validados (role = 3 e approved = true)
            const professores = await User.findProfessoresValidados();
            
            if (!professores || professores.length === 0) {
                return response.status(404).json({ 
                    status: false, 
                    message: 'Nenhum professor validado encontrado.' 
                });
            }
            
            return response.status(200).json({ 
                status: true, 
                professores 
            });
        } catch (err) {
            console.error("Erro ao listar professores:", err);
            return response.status(500).json({ 
                status: false, 
                message: "Erro interno no servidor." 
            });
        }
    }
    
}

module.exports = new UserController()
