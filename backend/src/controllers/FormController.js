const MaterialFieldValidator = require("../utils/materialValidator")
const Form = require("../models/Form")
const Subject = require("../models/Subject")
const Class = require("../models/Class")
const validator = require('validator')

/**
 * @class FormController
 * @classdesc Controlador responsável pelas operações relacionadas aos formulários,
 * incluindo criação, listagem, visualização e exclusão, bem como o relacionamento
 * com disciplinas, turmas e respostas associadas.
 */
class FormController {

    /**
     * Publica (cria) um novo formulário no sistema, incluindo suas questões e opções.
     *
     * - Valida os campos obrigatórios antes do cadastro.
     * - Verifica se já existe um formulário com o mesmo título para a turma.
     * - Salva o formulário e suas questões/opções no banco de dados.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo os dados do formulário.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com o status da operação.
     *
     * @example
     * // Exemplo de uso:
     * POST /forms
     * Body: {
     *   "title": "Prova 1 - Estrutura de Dados",
     *   "description": "Avaliação sobre listas, pilhas e filas",
     *   "created_by": 4,
     *   "subject_id": 2,
     *   "class_id": 1,
     *   "questions": [
     *     {
     *       "text": "Qual é a complexidade de busca em uma lista encadeada?",
     *       "points": 2,
     *       "type": "multiple_choice",
     *       "options": [
     *         {"text": "O(1)", "correct": false},
     *         {"text": "O(n)", "correct": true}
     *       ]
     *     }
     *   ]
     * }
     */
    async publish(request, response) {
        try {
            const { title, description, created_by, subject_id, class_id, questions, totalDuration, deadline } = request.body
            const error = MaterialFieldValidator.validate({ title, description, created_by, subject_id, class_id })
            if (error) return response.status(422).json({ status: false, message: error })

            if (!validator.isISO8601(deadline)) {
                return response.status(400).json({ error: "O campo 'prazo' deve ser uma data válida (YYYY-MM-DD)." })
            }

            const formExist = await Form.formExists(title, class_id)
            if (formExist) {
                return response.status(422).json({ status: false, message: "Título de formulário já existe." })
            }

            const data = { title, description, created_by, subject_id, class_id, totalDuration, deadline }
            const savedForm = await Form.save(data)

            if (!savedForm.success) {
                return response.status(500).json({ status: false, message: "Erro ao cadastrar formulário." })
            }

            const formId = savedForm.insertId

            for (const q of questions) {
                const questionData = { form_id: formId, text: q.text, points: q.points, type: q.type }
                const savedQuestion = await Form.saveQuestion(questionData)
                const questionId = savedQuestion.insertId

                if (q.options && q.options.length > 0) {
                    for (const opt of q.options) {
                        await Form.saveOption({
                            question_id: questionId,
                            text: opt.text,
                            correct: opt.correct || false
                        })
                    }
                }
            }

            return response.status(200).json({ status: true, message: "Formulário cadastrado com sucesso." })

        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Recupera os relacionamentos entre usuário, disciplina e turma com base no ID do usuário.
     *
     * - Retorna o `subject_id` associado ao usuário.
     * - Retorna o `class_id` associado à disciplina.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo o parâmetro `id` do usuário.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com os IDs relacionados.
     *
     * @example
     * // Exemplo de uso:
     * GET /forms/relations/3
     */
    async getRelations(request, response) {
        try {
            const { class_id } = request.params

            if (!validator.isInt(class_id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." })
            }

            const subjectData = await Subject.subjectUser(class_id)
            if (!subjectData) {
                return response.status(404).json({ status: false, message: "Nenhuma disciplina encontrada." })
            }

            const { subject_id } = subjectData

            return response.status(200).json({ status: true, subject_id })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Lista todos os formulários criados por um determinado usuário.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo o parâmetro `id` do usuário.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com os formulários encontrados.
     *
     * @example
     * // Exemplo de uso:
     * GET /forms/user/4
     */
    async findFormByUser(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." })
            }

            const form = await Form.getFormByUser(id)
            if (!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }

            return response.status(200).json({ status: true, form })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Exclui um formulário existente e todas as suas relações no banco de dados.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo o parâmetro `id` do formulário.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com o status da exclusão.
     *
     * @example
     * // Exemplo de uso:
     * DELETE /forms/10
     */
    async delete(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." })
            }

            const formExist = await Form.formExist(id)
            if (!formExist) {
                return response.status(404).json({ status: false, message: "Formulário não encontrado." })
            }

            const valid = await Form.deleteById(id)
            if (!valid) {
                return response.status(500).json({ status: false, message: "Erro ao deletar formulário." })
            }

            return response.status(200).json({ status: true, message: "Formulário deletado com sucesso." })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Retorna as informações completas de um formulário específico.
     *
     * - Inclui título, descrição, questões e metadados.
     * - Pode ser usado para exibir o conteúdo antes da aplicação do formulário.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo o parâmetro `id` do formulário.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com os dados do formulário.
     *
     * @example
     * // Exemplo de uso:
     * GET /forms/5
     */
    async view(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." })
            }

            const form = await Form.getFormById(id)
            if (!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }

            return response.status(200).json({ status: true, form })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Lista todos os formulários associados a uma turma específica.
     *
     * - Verifica se a turma existe antes de buscar os formulários.
     * - Retorna os formulários vinculados à turma informada.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo o parâmetro `class_id` da turma.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com os formulários associados à turma.
     *
     * @example
     * // Exemplo de uso:
     * GET /forms/class/2
     */
    async getFormByClassId(request, response) {
        try {
            const { class_id } = request.params
            const { user_id } = request.body
            if (!validator.isInt(class_id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "Turma inválida." })
            }

            const classExist = await Class.classExist(class_id)
            if (!classExist) {
                return response.status(404).json({ status: false, message: "Nenhuma turma encontrada." })
            }

            const form = await Form.getForm(class_id, user_id)
            if (!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }

            return response.status(200).json({ status: true, ...form })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Salva as respostas enviadas por um usuário para um formulário.
     *
     * - Valida IDs de formulário e usuário.
     * - Garante que ao menos uma resposta foi enviada.
     * - Armazena as respostas no banco de dados.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo `form_id`, `user_id` e `answers`.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna o status da operação e o `class_id` vinculado ao formulário.
     *
     * @example
     * // Exemplo de uso:
     * POST /forms/answers
     * Body: {
     *   "form_id": 1,
     *   "user_id": 7,
     *   "answers": [
     *     { "question_id": 3, "option_id": 8 },
     *     { "question_id": 4, "option_id": 10 }
     *   ]
     * }
     */
    async saveAnswers(request, response) {
        try {
            const { form_id, user_id, answers } = request.body
            if (!validator.isInt(form_id + '', { min: 1 })) {
                return response.status(422).json({ status: false, message: "Formulário inválido." })
            }

            if (!validator.isInt(user_id + '', { min: 1 })) {
                return response.status(422).json({ status: false, message: "Usuário inválido." })
            }

            if (!Array.isArray(answers) || answers.length === 0) {
                return response.status(422).json({ status: false, message: "Nenhuma resposta enviada." })
            }

            const formData = await Form.getFormById(form_id)
            if (!formData) {
                return response.status(404).json({ status: false, message: "Formulário não encontrado." });
            }

            const deadline = new Date(formData.deadline)
            const now = new Date()


            if (now > deadline) {
                return response.status(403).json({
                    status: false,
                    message: "O tempo para envio deste simulado já expirou."
                })
            }


            const formattedAnswers = answers.map(({ question_id, option_id, open_answer }) => ({
                form_id,
                user_id,
                question_id,
                option_id: option_id || null,
                open_answer: open_answer || null,
            }))


            const classData = await Form.getClassIdByForm(form_id)
            if (!classData) {
                return response.status(404).json({ status: false, message: "Nenhuma turma encontrada." })
            }

            const { class_id } = classData

            const valid = await Form.saveAnswers(formattedAnswers)
            if (!valid) {
                return response.status(500).json({ status: false, message: "Erro ao salvar respostas." })
            }

            return response.status(200).json({ status: true, message: "Respostas salvas com sucesso.", class_id })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    async formCorrection(request, response) {
        try {
            const { class_id } = request.params
            if (!validator.isInt(class_id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "Professor invalido." })
            }

            const form = await Form.mockCorrection(class_id)
            if (!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }

            return response.status(200).json({ status: true, ...form })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async answersStudents(request, response) {
        try {
            const { form_id } = request.params
            if (!validator.isInt(form_id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "Formulário invalido." })
            }

            const form = await Form.responsesStudents(form_id)
            if (!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }

            return response.status(200).json({ status: true, form })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    
    async saveCorrection(request, response) {
        try {
            const corrections = request.body
            let id_class = null

            for (const { answer_id, teacher_id, comment, status } of corrections) {
                if (!validator.isInt(answer_id + '', { min: 1 })) {
                    return response.status(422).json({ status: false, message: "Resposta inválida." })
                }

                if (!validator.isInt(teacher_id + '', { min: 1 })) {
                    return response.status(422).json({ status: false, message: "Professor inválido." })
                }

                const ansData = await Form.answerExist(answer_id)
                if (!ansData) {
                    return response.status(404).json({ status: false, message: `Resposta ${answer_id} não encontrada.` })
                }

                const classData = await Form.getClassIdByAnswerId(answer_id)
                if (!classData) {
                    return response.status(404).json({ status: false, message: "Nenhuma turma encontrada." })
                }

                const { class_id, form_id } = classData
                id_class = class_id

                if(!comment) {
                    await Form.updateCorrection(answer_id, status)
                    await Form.updateStatusForm(form_id)
                }
                else {
                    const data = { answer_id, teacher_id, comment }
                    await Form.saveCorrection(data)
                    await Form.updateCorrection(answer_id, status)
                    await Form.updateStatusForm(form_id)
                }
            }

            return response.status(200).json({ status: true, message: "Correções salvas com sucesso.", id_class })
        } catch (err) {
            console.error(err);
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


}

module.exports = new FormController()
