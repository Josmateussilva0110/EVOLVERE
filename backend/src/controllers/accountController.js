const Account = require("../models/Account")
const path = require("path")
require('dotenv').config({ path: '../.env' })
const fs = require("fs")
const validator = require('validator')
const Course = require("../models/Course")

/**
 * Controlador de Usuários.
 * Responsável por registro, login, sessões e associação de contas a papéis (roles).
 */
class AccountController {

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

    async requestsTeachers(request, response) {
        try {
            const teachers = await Account.getRequests()
            if(!teachers) {
                return response.status(404).json({status: false, message: "Nenhuma solicitação encontrada."})
            }
            return response.status(200).json({status: true, teachers})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new AccountController()
