const Account = require("../models/Account")
const User = require("../models/User")
const Subject = require("../models/Subject")
const path = require("path")
require('dotenv').config({ path: '../.env' })
const fs = require("fs")
const validator = require('validator')
const Course = require("../models/Course")
const sendEmail = require("../utils/sendEmail")
const formatMessageTeacherApproved = require("../utils/messageApprovedEmail")
const formatMessageTeacherRejected = require("../utils/messageReprovedEmail")

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


        
    /**
     * Retorna todas as solicitações de professores pendentes de aprovação.
     *
     * @async
     * @param {import("express").Request} request
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON contendo:
     * - `status` - Booleano indicando sucesso ou falha.
     * - `teachers` - Array de objetos com informações das solicitações.
     *
     * @throws {404} Se não houver solicitações.
     * @throws {500} Erro interno do servidor.
     */
    async requests(request, response) {
        try {
            const {id} = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Id inválido."})
            }

            let users = []

            if (id >= 1 && id <= 4) {
                users = await Account.getAllRequests()
            }
            else {
                const coordinator = await Account.findCoordinatorById(id)
                if(!coordinator) {
                    return response.status(404).json({status: false, message: "Coordenador não encontrado."})
                }
                users = await Account.getAllRequestsByCoordinator(coordinator.access_code)
            }
            if(users.length === 0) {
                return response.status(404).json({status: false, message: "Nenhuma solicitação encontrada."})
            }
            return response.status(200).json({status: true, users})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
     * Remove uma solicitação de aprovação de professor.
     *
     * @async
     * @param {import("express").Request} request
     * @param {Object} request.params
     * @param {number|string} request.params.id_user - ID do usuário cuja solicitação será removida.
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON com status da operação.
     *
     * @throws {422} ID inválido.
     * @throws {500} Erro ao remover ou erro interno do servidor.
     */
    async removeRequest(request, response) {
        try {
            const {id_user} = request.params
            if (!validator.isInt(id_user + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Id inválido."})
            }

            const user = await User.findById(id_user)
            const valid = await Account.deleteRequest(id_user)
            if(!valid) {
                return response.status(500).json({status: false, message: 'Erro ao remover requisição'})
            }

            if(!user) {
                return response.status(404).json({status: false, message: "Usuário não encontrado para envio de email"})
            }
            const subject = "Validação de conta - Evolvere"
            const { html } = formatMessageTeacherRejected(user.username)
            await sendEmail(user.email, subject, html)
            return response.status(200).json({status: true, message: "requisição recusada com sucesso."})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
     * Aprova a solicitação de um professor.
     *
     * @async
     * @param {import("express").Request} request
     * @param {Object} request.params
     * @param {number|string} request.params.id_user - ID do usuário a ser aprovado.
     * @param {import("express").Response} response
     * @returns {Promise<Object>} JSON com status da operação.
     *
     * @throws {422} ID inválido.
     * @throws {500} Erro ao aprovar ou erro interno do servidor.
     */
    async approve(request, response) {
        try {
            const {id_user} = request.params
            if (!validator.isInt(id_user + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Id inválido."})
            }

            const valid = await Account.approveRequest(id_user)
            if(!valid) {
                return response.status(500).json({status: false, message: "Erro ao aprovar."})
            }

            const user = await User.findById(id_user)   
            if(!user) {
                return response.status(404).json({status: false, message: "Usuário não encontrado para envio de email"})
            }
            const subject = "Validação de conta - Evolvere"
            const { html } = formatMessageTeacherApproved(user.username)
            await sendEmail(user.email, subject, html)
            return response.status(200).json({status: true, message: "Conta aprovada com sucesso."})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Controlador para obter os dados de um coordenador acadêmico pelo ID.
     * 
     * Fluxo de execução:
     * 1. Extrai o `id` dos parâmetros da requisição (`request.params`).
     * 2. Valida o `id` usando `UserFieldValidator`. Caso inválido, retorna status 422.
     * 3. Chama `User.findCoordinatorById(id)` para buscar os dados do coordenador.
     * 4. Se não encontrar o usuário, retorna status 404.
     * 5. Se encontrado, retorna status 200 com os dados do usuário.
     * 6. Em caso de erro interno, retorna status 500.
     * 
     * @async
     * @function getCoordinatorData
     * @param {Object} request - Objeto da requisição Express.
     * @param {Object} request.params - Parâmetros da URL, incluindo `id`.
     * @param {Object} response - Objeto de resposta Express.
     * @returns {Promise<Object>} JSON contendo:
     *   - status: boolean (true se sucesso, false se erro)
     *   - user: objeto com os dados do coordenador (quando encontrado)
     *   - message: string com mensagem de erro (quando aplicável)
     * 
     * @example
     * // Rota Express
     * app.get('/coordinator/:id', UserController.getCoordinatorData);
     */
    async getCoordinatorData(request, response) {
        try {
            const {id} = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Id inválido."})
            }

            const user = await Account.findCoordinatorById(id)
            if(!user) {
                return response.status(404).json({ status: false, message: "Usuário não encontrado." })
            }
            return response.status(200).json({status: true, user})

        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async getTeachers(request, response) {
        try {
            const {id} = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Usuário invalido."})
            }

            let teachers = []

            if (id >= 1 && id <= 4) {
                teachers = await Account.getAllTeachers()
            }
            else {
                const coordinator = await Account.findCoordinatorById(id)
                if(!coordinator) {
                    return response.status(404).json({status: false, message: "Coordenador não encontrado."})
                }
                teachers = await Account.getAllTeachersByCoordinator(coordinator.access_code)
            }

            if(teachers.length === 0) {
                return response.status(404).json({status: false, message: "Nenhuma professor encontrado."})
            }
            return response.status(200).json({status: true, teachers})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async getKpis(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Usuário invalido."})
            }

            let teachers = []
            let subjects = []
            let requests = []

            if (id >= 1 && id <= 4) {
                teachers = await Account.countAllTeachers()
                subjects = await Subject.countAllSubjects()
                requests = await Account.countAllRequests()
            }
            else {
                const coordinator = await Account.findCoordinatorById(id)
                if(!coordinator) {
                    return response.status(404).json({status: false, message: "Coordenador não encontrado."})
                }
                teachers = await Account.countTeachers(coordinator.access_code)
                subjects = await Subject.countSubjects(coordinator.access_code)
                requests = await Account.countRequests(coordinator.access_code)
            }
            if(!teachers) {
                return response.status(404).json({status: false, message: "Nenhum professor encontrado."})
            }
            const kpi = {
                teachers,
                subjects,
                requests,
            }
            return response.status(200).json({status: true, kpi})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new AccountController()
