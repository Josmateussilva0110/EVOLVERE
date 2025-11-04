const MaterialFieldValidator = require("../utils/materialValidator")
const Form = require("../models/Form")
const Subject = require("../models/Subject")
const Class = require("../models/Class")
const validator = require('validator')

/**
 * Calcula a diferença de dias entre duas datas.
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
 * incluindo criação, listagem, visualização e exclusão, bem como o relacionamento
 * com disciplinas, turmas e questões associadas.
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
            const {title, description, created_by, subject_id, class_id, questions, deadline} = request.body
            const error = MaterialFieldValidator.validate({ title, description, created_by, subject_id, class_id })
            if (error) return response.status(422).json({ status: false, message: error })

            if (!validator.isISO8601(deadline)) {
                return res.status(400).json({ error: "O campo 'prazo' deve ser uma data válida (YYYY-MM-DD)." });
            }

            const formExist = await Form.formExists(title, class_id)
            if(formExist) {
                return response.status(422).json({ status: false, message: "Título de formulário já existe." })
            }

            const data = { title, description, created_by, subject_id, class_id, deadline }
            const savedForm = await Form.save(data)

            if(!savedForm.success) {
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

        } catch(err) {
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
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." });
            }

            const subject_id = await Subject.subjectUser(id)
            if(!subject_id) {
                return response.status(404).json({ status: false, message: "Nenhuma disciplina encontrada." })
            }

            return response.status(200).json({ status: true, subject_id })
        } catch(err) {
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
                return response.status(422).json({ success: false, message: "ID inválido." });
            }

            const form = await Form.getFormByUser(id)
            if(!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }

            return response.status(200).json({ status: true, form })
        } catch(err) {
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
                return response.status(422).json({ success: false, message: "ID inválido." });
            }

            const formExist = await Form.formExist(id)
            if(!formExist) {
                return response.status(404).json({ status: false, message: "Formulário não encontrado." })
            }

            const valid = await Form.deleteById(id)
            if(!valid) {
                return response.status(500).json({ status: false, message: "Erro ao deletar formulário." })
            }

            return response.status(200).json({ status: true, message: "Formulário deletado com sucesso." })
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * Retorna as informações completas de um formulário específico.
     *
     * - Inclui título, descrição e demais metadados.
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
                return response.status(422).json({ success: false, message: "ID inválido." });
            }

            const form = await Form.getFormById(id)
            if(!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }

            return response.status(200).json({ status: true, form })
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async getFormByClassId(request, response) {
        try {
            const { class_id } = request.params
            if (!validator.isInt(class_id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "Turma invalida." });
            }
            const classExist = await Class.classExist(class_id)
            if(!classExist) {
                return response.status(404).json({status: false, message: "Nenhuma turma encontrada."})
            }

            const form = await Form.getForm(class_id)
            if(!form) {
                return response.status(404).json({status: false, message: "Nenhum form encontrado."})
            }

            return response.status(200).json({status: true, ...form})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * @summary Obtém as atividades pendentes para o dashboard do aluno logado.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
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

            // Formata os dados para o frontend
            const upcomingActivities = forms.map(form => {
                const daysRemaining = getDaysRemaining(form.deadline);
                const urgency = getUrgency(daysRemaining);
                
                return {
                    id: form.id,
                    title: form.title,
                    description: form.discipline_name || form.description, // Mostra nome da disciplina
                    daysRemaining: daysRemaining,
                    urgencyLabel: urgency.label,
                    urgencyColor: urgency.color
                };
            }).slice(0, 3); // Pega apenas as 3 mais próximas

            // Dados para os cards de estatística
            const pendingCount = forms.length;
            
            // Retorna no formato "joguinho" .data.data que já conhecemos
            res.status(200).json({
                status: true,
                data: {
                    pendingCount: pendingCount,
                    upcomingActivities: upcomingActivities
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


}

module.exports = new FormController()
