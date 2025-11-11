const MaterialFieldValidator = require("../utils/materialValidator")
const Form = require("../models/Form")
const Subject = require("../models/Subject")
const Class = require("../models/Class")
const validator = require('validator')

/**
 * Calcula a diferença de dias entre duas datas.
 * @param {string|Date} deadline - Data limite no formato ISO (YYYY-MM-DD) ou objeto Date.
 * @returns {number} Retorna o número de dias restantes até o prazo. Retorna -1 se o prazo já expirou.
 */
function getDaysRemaining(deadline) {
    const deadLineDate = new Date(deadline);
    const today = new Date();
    
    // Zera as horas para comparar apenas os dias
    deadLineDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    const diffTime = deadLineDate.getTime() - today.getTime();
    if (diffTime < 0) return -1; // Já venceu

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Define a urgência baseada nos dias restantes.
 * @param {number} days - Quantidade de dias restantes até o prazo.
 * @returns {{label: string, color: string}} Objeto contendo o rótulo e a cor correspondente à urgência.
 */
function getUrgency(days) {
    if (days <= 0) return { label: "Vencido", color: "red" };
    if (days <= 5) return { label: "Urgente", color: "red" };
    if (days <= 10) return { label: "Importante", color: "amber" };
    return { label: "Normal", color: "blue" };
}


/**
 * @class FormController
 * @classdesc Controlador responsável pelas operações relacionadas aos formulários,
 * incluindo criação, listagem, visualização, exclusão e correção, bem como o relacionamento
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
     * POST /forms
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
     * Recupera os relacionamentos entre usuário, disciplina e turma com base no ID da turma.
     *
     * - Retorna o `subject_id` associado à turma.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo o parâmetro `class_id`.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com o `subject_id` relacionado.
     *
     * @example
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
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo o parâmetro `class_id` e o `user_id` no corpo.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com os formulários associados à turma.
     *
     * @example
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
     * - Impede envio após o prazo (deadline).
     *
     * @async
     * @param {import("express").Request} request - Objeto contendo `form_id`, `user_id` e `answers`.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna o status da operação e o `class_id` vinculado ao formulário.
     *
     * @example
     * POST /forms/answers
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

            const stats = await Form.calculateResults(formattedAnswers)

            const results = {
                form_id,
                student_id: user_id,
                points: stats.total_points,
                correct: stats.correct,
                wrong: stats.wrong,
            }
            
            await Form.saveFormResults(results)


            const classData = await Form.getClassIdByForm(form_id)
            if (!classData) {
                return response.status(404).json({ status: false, message: "Nenhuma turma encontrada." })
            }

            const { class_id } = classData

            const valid = await Form.saveAnswers(formattedAnswers)
            if (!valid) {
                return response.status(500).json({ status: false, message: "Erro ao salvar respostas." })
            }

            const data = {form_id, student_id: user_id}

            await Form.saveFormAndUserCorrection(data)

            return response.status(200).json({ status: true, message: "Respostas salvas com sucesso.", class_id, form_id })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Retorna os formulários prontos para correção de uma turma específica.
     *
     * - Utilizado por professores para acessar simulados enviados pelos alunos.
     * - Retorna os formulários que precisam ser corrigidos.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição contendo o parâmetro `class_id`.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com os formulários prontos para correção.
     *
     * @example
     * GET /forms/correction/1
     */
    async formCorrection(request, response) {
        try {
            const { subject_id } = request.params
            if (!validator.isInt(subject_id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "Professor invalido." })
            }

            const form = await Form.mockCorrection(subject_id)
            if (!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }

            return response.status(200).json({ status: true, ...form })
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Retorna todas as respostas enviadas pelos alunos para um formulário específico.
     *
     * - Usado por professores para visualizar as respostas antes da correção.
     *
     * @async
     * @param {import("express").Request} request - Objeto contendo o parâmetro `form_id`.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com as respostas dos alunos.
     *
     * @example
     * GET /forms/answers/students/2
     */
    async answersStudents(request, response) {
        try {
            const { form_id } = request.params
            if (!validator.isInt(form_id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "Formulário inválido." })
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

    /**
     * Salva as correções feitas pelo professor nas respostas dos alunos.
     *
     * - Valida se as respostas e professores são válidos.
     * - Atualiza o status das respostas (corrigidas, pendentes, etc.).
     * - Registra comentários do professor, se existirem.
     *
     * @async
     * @param {import("express").Request} request - Objeto da requisição HTTP contendo uma lista de correções no corpo.
     * @param {import("express").Response} response - Objeto da resposta HTTP.
     * @returns {Promise<import("express").Response>} Retorna um JSON com o status e o `class_id` da turma corrigida.
     *
     * @example
     * POST /forms/corrections
     * Body: [
     *   { "answer_id": 5, "teacher_id": 2, "comment": "Boa resposta!", "status": "correto" }
     * ]
     */
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

                const { class_id, form_id, student_id, question_id} = classData
                id_class = class_id

                if(!comment) {
                    await Form.updateCorrection(answer_id, status)
                }
                else {
                    const data = { answer_id, teacher_id, comment }
                    await Form.saveComment(data)
                    await Form.updateCorrection(answer_id, status)
                }

                await Form.updatePoints(question_id, form_id, student_id)

                await Form.updateStatusForm(form_id, student_id)
            }

            return response.status(200).json({ status: true, message: "Correções salvas com sucesso.", id_class })
        } catch (err) {
            console.error(err);
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Obtém as atividades pendentes para o dashboard do aluno logado.
     *
     * - Retorna o número total de atividades pendentes.
     * - Lista até 3 atividades mais próximas do prazo, com prioridade visual (urgência).
     * - Inclui cálculo de dias restantes e cor da urgência.
     *
     * @async
     * @param {import("express").Request} req - Objeto da requisição Express contendo a sessão do usuário.
     * @param {import("express").Response} res - Objeto da resposta Express.
     * @returns {Promise<void>} Retorna JSON contendo o total de atividades pendentes e uma lista resumida das mais próximas.
     *
     * @example
     * GET /dashboard/student/pending
     */
    async getStudentPendingForms(req, res) {
        try {
            const student_id = req.session.user.id;
            if (!student_id) {
                return res.status(401).json({ status: false, message: "Acesso não autorizado." });
            }

            const forms = await Form.getPendingForStudent(Number(student_id));
            if (forms === undefined) {
                return res.status(500).json({ status: false, message: "Erro ao consultar atividades." });
            }

            const countClass = await Class.countClassByUser(student_id)

            const upcomingActivities = forms.map(form => {
                const daysRemaining = getDaysRemaining(form.deadline);
                const urgency = getUrgency(daysRemaining);
                
                return {
                    id: form.id,
                    title: form.title,
                    description: form.discipline_name || form.description, // Mostra nome da disciplina
                    class_id: form.class_id,
                    daysRemaining: daysRemaining,
                    urgencyLabel: urgency.label,
                    urgencyColor: urgency.color
                };
            }).slice(0, 3);

            const pendingCount = forms.length;
            
            res.status(200).json({
                status: true,
                data: {
                    pendingCount: pendingCount,
                    upcomingActivities: upcomingActivities,
                    countClass,
                }
            });

        } catch (error) {
            console.error('Erro ao buscar atividades pendentes:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor.' 
            });
        }
    }

    async getResultForm(request, response) {
        try {
            const { form_id } = request.params
            const student_id = request.session.user?.id // buscar usuário logado
            if (!student_id) {
                return response.status(401).json({ status: false, message: "Acesso não autorizado." });
            }

            if (!validator.isInt(form_id + '', { min: 1 })) {
                return response.status(422).json({ status: false, message: "Formulário invalido." })
            }

            const formExist = await Form.formExist(form_id)
            if(!formExist) {
                return response.status(404).json({ status: false, message: "Simulado não encontrado." })
            }

            const results = await Form.resultForm(form_id, student_id)
            if(!results) {
                return response.status(500).json({ status: false, message: "Erro ao buscar resultados." })
            }

            return response.status(200).json({ status: true, results })
            

        } catch (error) {
            console.error("Erro interno em getResultForm:", error)
            response.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor.' 
            });
        }
    }

}

module.exports = new FormController()
