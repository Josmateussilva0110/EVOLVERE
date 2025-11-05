const knex = require("../database/connection")

/**
 * @class Form
 * @classdesc
 * Classe responsável por realizar operações relacionadas aos formulários (`form`)
 * e suas tabelas associadas (`questions`, `options`, `answers_form`, `classes`, `comment_answers`).
 * 
 * Esta classe encapsula toda a lógica de persistência no banco de dados referente
 * à criação, leitura, atualização e exclusão de formulários e suas relações.
 * 
 * É utilizada tanto por professores (para criação e correção de formulários) quanto por alunos
 * (para listagem e submissão de respostas).
 */
class Form {

    /**
     * Verifica se já existe um formulário com o mesmo título para uma determinada turma.
     *
     * @async
     * @param {string} title - Título do formulário a ser verificado.
     * @param {number} class_id - ID da turma associada ao formulário.
     * @returns {Promise<boolean>} Retorna `true` se o formulário já existir, caso contrário `false`.
     *
     * @example
     * const exists = await Form.formExists("Prova 1", 2)
     * if (exists) console.log("Já existe um formulário com este título nesta turma.")
     */
    async formExists(title, class_id) {
        try {
            const result = await knex("form")
                .select("id")
                .where({ title, class_id })
                .first()
            return !!result
        } catch (err) {
            console.error("Erro ao verificar título:", err)
            return false
        }
    }

    /**
     * Insere um novo registro na tabela `form`.
     *
     * @async
     * @param {Object} data - Dados do formulário a ser inserido.
     * @param {string} data.title - Título do formulário.
     * @param {string} data.description - Descrição do formulário.
     * @param {number} data.created_by - ID do usuário criador.
     * @param {number} data.subject_id - ID da disciplina associada.
     * @param {number} data.class_id - ID da turma associada.
     * @param {Date} [data.deadline] - Prazo de entrega da atividade.
     * @param {number} [data.totalDuration] - Duração total (em minutos).
     * @returns {Promise<{success: boolean, insertId?: number}>} Retorna `success` e o ID inserido.
     *
     * @example
     * await Form.save({
     *   title: "Simulado 3",
     *   description: "Avaliação final do semestre",
     *   created_by: 1,
     *   subject_id: 4,
     *   class_id: 2,
     *   deadline: new Date("2025-12-10")
     * })
     */
    async save(data) {
        try {
            const [result] = await knex("form")
                .insert(data)
                .returning("id")
            return { success: true, insertId: result.id }
        } catch (err) {
            console.error("Erro ao cadastrar formulário:", err)
            return { success: false }
        }
    }

    /**
     * Cadastra uma nova questão vinculada a um formulário específico.
     *
     * @async
     * @param {Object} data - Dados da questão.
     * @param {number} data.form_id - ID do formulário associado.
     * @param {string} data.text - Enunciado da questão.
     * @param {number} data.points - Valor (pontuação) da questão.
     * @param {string} data.type - Tipo da questão (ex: "multiple_choice", "true_false", "open_answer").
     * @returns {Promise<{success: boolean, insertId?: number}>} Retorna status e ID inserido.
     *
     * @example
     * await Form.saveQuestion({
     *   form_id: 2,
     *   text: "Qual é o maior planeta do sistema solar?",
     *   points: 2,
     *   type: "multiple_choice"
     * })
     */
    async saveQuestion(data) {
        try {
            const [result] = await knex("questions")
                .insert(data)
                .returning("id")
            return { success: true, insertId: result.id }
        } catch (err) {
            console.error("Erro ao cadastrar questões:", err)
            return { success: false }
        }
    }

    /**
     * Cadastra uma opção vinculada a uma questão de múltipla escolha.
     *
     * @async
     * @param {Object} data - Dados da opção.
     * @param {number} data.question_id - ID da questão associada.
     * @param {string} data.text - Texto da opção.
     * @param {boolean} [data.correct=false] - Indica se a opção é correta.
     * @returns {Promise<{success: boolean, insertId?: number}>} Retorna status e ID da opção criada.
     *
     * @example
     * await Form.saveOption({
     *   question_id: 3,
     *   text: "Júpiter",
     *   correct: true
     * })
     */
    async saveOption(data) {
        try {
            const [result] = await knex("options")
                .insert(data)
                .returning("id")
            return { success: true, insertId: result.id }
        } catch (err) {
            console.error("Erro ao cadastrar opções:", err)
            return { success: false }
        }
    }

    /**
     * Retorna todos os formulários de uma determinada turma,
     * incluindo questões e opções aninhadas no formato JSON.
     *
     * @async
     * @param {number} class_id - ID da turma.
     * @returns {Promise<Object[]|undefined>} Retorna uma lista de formulários com suas questões e opções.
     *
     * @example
     * const forms = await Form.getFormByUser(5)
     * console.log(forms[0].questions)
     */
    async getFormByUser(class_id) {
        try {
            const result = await knex.raw(`
                SELECT
                    f.id,
                    f.title,
                    f.description,
                    f.subject_id,
                    f.class_id,
                    SUM(COALESCE(q.points, 0)) AS total_points,
                    f."totalDuration",
                    f.deadline,
                    f.updated_at,
                    json_agg(
                        json_build_object(
                            'id', q.id,
                            'text', q.text,
                            'points', q.points,
                            'type', q.type,
                            'options', (
                                SELECT json_agg(
                                    json_build_object(
                                        'id', o.id,
                                        'text', o.text,
                                        'correct', o.correct
                                    )
                                )
                                FROM options o
                                WHERE o.question_id = q.id
                            )
                        )
                    ) AS questions
                FROM form f
                INNER JOIN questions q ON q.form_id = f.id
                WHERE f.class_id = ?
                GROUP BY f.id
                ORDER BY f.updated_at DESC;
            `, [class_id])

            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch (err) {
            console.error("Erro ao buscar formulários:", err)
            return undefined
        }
    }

    /**
     * Busca um formulário específico pelo ID, incluindo suas questões e opções.
     *
     * @async
     * @param {number|string} id - ID do formulário.
     * @returns {Promise<Object[]|undefined>} Retorna o formulário com suas questões e opções,
     * ou `undefined` se não encontrado.
     *
     * @example
     * const form = await Form.getFormById(2)
     * console.log(form[0].questions)
     */
    async getFormById(id) {
        try {
            const result = await knex.raw(`
                SELECT
                    f.id,
                    f.title,
                    f.description,
                    f.subject_id,
                    f.class_id,
                    SUM(COALESCE(q.points, 0)) AS total_points,
                    f."totalDuration",
                    f.deadline,
                    f.updated_at,
                    json_agg(
                        json_build_object(
                            'id', q.id,
                            'text', q.text,
                            'points', q.points,
                            'type', q.type,
                            'options', (
                                SELECT json_agg(
                                    json_build_object(
                                        'id', o.id,
                                        'text', o.text,
                                        'correct', o.correct
                                    )
                                )
                                FROM options o
                                WHERE o.question_id = q.id
                            )
                        )
                    ) AS questions
                FROM form f
                INNER JOIN questions q ON q.form_id = f.id
                WHERE f.id = ?
                GROUP BY f.id
                ORDER BY f.updated_at DESC;
            `, [id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar formulários:", err)
            return undefined
        }
    }

    /**
     * Verifica se um formulário existe pelo seu ID.
     *
     * @async
     * @param {number|string} id - ID do formulário a ser verificado.
     * @returns {Promise<boolean>} Retorna `true` se o formulário existir, ou `false` caso contrário.
     *
     * @example
     * const exists = await Form.formExist(1)
     */
    async formExist(id) {
        try {
            const result = await knex.select("*").where({id}).table("form")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar formulário:', err)
            return false
        }
    }

    /**
     * Deleta um formulário existente com base em seu ID.
     *
     * @async
     * @param {number|string} id - ID do formulário a ser deletado.
     * @returns {Promise<boolean>} Retorna `true` se o formulário foi deletado, `false` caso contrário.
     *
     * @example
     * const deleted = await Form.deleteById(4)
     * if (deleted) console.log("Formulário removido com sucesso.")
     */
    async deleteById(id) {
        try {
            const deleted = await knex('form').where({ id }).delete()
            return deleted > 0
        } catch (err) {
            console.error("Erro ao deletar formulário:", err)
            return false
        }
    }

    /**
     * Retorna os formulários disponíveis para uma turma,
     * excluindo os que o aluno já respondeu.
     *
     * @async
     * @param {number} class_id - ID da turma.
     * @param {number} user_id - ID do aluno logado.
     * @returns {Promise<{class_name: string, forms: Object[]}|undefined>} Nome da turma e lista de formulários disponíveis.
     *
     * @example
     * const { class_name, forms } = await Form.getForm(3, 12)
     */
    async getForm(class_id, user_id) {
        try {
            const classInfo = await knex
                .select("id", "name")
                .from("classes")
                .where({ id: class_id })
                .first()

            if (!classInfo) return null

            const result = await knex.raw(`
                SELECT
                    f.id,
                    f.title,
                    f.class_id,
                    f.subject_id,
                    f.deadline
                FROM form f
                INNER JOIN classes c ON c.id = f.class_id
                WHERE f.class_id = ?
                AND NOT EXISTS (
                    SELECT 1 FROM answers_form af
                    WHERE af.form_id = f.id
                    AND af.user_id = ?
                )
            `, [class_id, user_id])

            return { class_name: classInfo.name, forms: result.rows }
        } catch (err) {
            console.error("Erro ao buscar simulados:", err)
            return undefined
        }
    }

    /**
     * Retorna todas as atividades pendentes (ainda não entregues e não respondidas)
     * para um aluno específico.
     *
     * @async
     * @param {number} student_id - ID do aluno.
     * @returns {Promise<Array<Object>|undefined>} Lista de formulários pendentes.
     *
     * @example
     * const pendentes = await Form.getPendingForStudent(8)
     */
    async getPendingForStudent(student_id) {
        try {
            const studentClasses = await knex('class_student as cs')
                .join('classes as c', 'c.id', 'cs.class_id')
                .where('cs.student_id', student_id)
                .select('c.id as class_id', 'c.subject_id')

            if (studentClasses.length === 0) return []

            const classIds = studentClasses.map(c => c.class_id)
            const subjectIds = [...new Set(studentClasses.map(c => c.subject_id))]

            const query = knex('form as f')
                .select('f.id', 'f.title', 'f.description', 'f.deadline', 's.name as discipline_name')
                .leftJoin('subjects as s', 's.id', 'f.subject_id')
                .where('f.deadline', '>', knex.fn.now())
                .where(function() {
                    this.where(function() {
                        this.whereNotNull('f.class_id')
                            .whereIn('f.class_id', classIds)
                    })
                    .orWhere(function() {
                        this.whereNull('f.class_id')
                            .whereIn('f.subject_id', subjectIds)
                    })
                })
                .orderBy('f.deadline', 'asc')

            return await query
        } catch (err) {
            console.error("Erro ao buscar atividades pendentes do aluno:", err)
            return undefined
        }
    }

    /**
     * Salva as respostas de um formulário submetidas por um aluno.
     *
     * @async
     * @param {Object[]} data - Array de respostas.
     * @param {number} data[].form_id - ID do formulário respondido.
     * @param {number} data[].question_id - ID da questão.
     * @param {number} data[].option_id - ID da opção selecionada.
     * @param {number} data[].user_id - ID do aluno.
     * @param {string} [data[].open_answer] - Resposta dissertativa (se aplicável).
     * @returns {Promise<{success: boolean, ids?: number[]}>} Retorna o status da operação e os IDs inseridos.
     *
     * @example
     * await Form.saveAnswers([
     *   { form_id: 2, question_id: 5, option_id: 12, user_id: 3 },
     *   { form_id: 2, question_id: 6, open_answer: "Minha explicação", user_id: 3 }
     * ])
     */
    async saveAnswers(data) {
        try {
            const ids = await knex("answers_form").insert(data)
            return { success: true, ids }
        } catch (err) {
            console.error("Erro ao cadastrar respostas de formulário:", err)
            return { success: false }
        }
    }

    /**
     * Retorna o ID da turma associada a um formulário específico.
     *
     * @async
     * @param {number|string} id - ID do formulário.
     * @returns {Promise<{class_id: number}|undefined>} Retorna o objeto com class_id ou `undefined`.
     *
     * @example
     * const classData = await Form.getClassIdByForm(2)
     * console.log(classData.class_id)
     */
    async getClassIdByForm(id) {
        try {
            const result = await knex.select(["class_id"]).where({id}).table("form")
            if(result.length > 0) return result[0]
            else return undefined
        } catch (err) {
            console.error("Erro ao buscar id da turma: ", err)
            return undefined
        }
    }

    /**
     * Retorna todos os formulários que possuem respostas dissertativas pendentes de correção
     * em uma determinada turma.
     *
     * @async
     * @param {number} class_id - ID da turma.
     * @returns {Promise<Object[]|undefined>} Lista de formulários com status de correção pendente.
     *
     * @example
     * const toCorrect = await Form.mockCorrection(5)
     */
    async mockCorrection(class_id) {
        try {
            const result = await knex.raw(`
                SELECT DISTINCT ON (af.form_id)
                    af.form_id,
                    f.title,
                    f.status,
                    f.subject_id,
                    s.name
                FROM answers_form af
                INNER JOIN form f ON f.id = af.form_id
                INNER JOIN subjects s ON s.id = f.subject_id
                WHERE f.class_id = ? AND af.open_answer IS NOT NULL
            `, [class_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch (err) {
            console.error("Erro ao buscar formulários para correção: ", err)
            return undefined
        }
    }

    /**
     * Retorna todas as respostas dissertativas submetidas por alunos
     * para um determinado formulário.
     *
     * @async
     * @param {number} form_id - ID do formulário.
     * @returns {Promise<Object[]|undefined>} Lista contendo aluno, questão e resposta.
     *
     * @example
     * const respostas = await Form.responsesStudents(1)
     * console.log(respostas[0].open_answer)
     */
    async responsesStudents(form_id) {
        try {
            const result = await knex.raw(`
                SELECT
                    af.id AS answer_id,
                    af.user_id,
                    u.username,
                    q.id AS question_id,
                    q.text AS question_text,
                    af.open_answer,
                    f.title as form_name
                FROM answers_form af
                INNER JOIN users u ON u.id = af.user_id
                INNER JOIN questions q ON q.id = af.question_id
                INNER JOIN form f ON f.id = af.form_id
                WHERE af.form_id = ?
                AND af.open_answer IS NOT NULL
                ORDER BY u.username, q.id
            `, [form_id])

            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch (err) {
            console.error("Erro ao buscar respostas para correção: ", err)
            return undefined
        }
    }

    /**
     * Verifica se uma resposta existe pelo ID.
     *
     * @async
     * @param {number} answer_id - ID da resposta.
     * @returns {Promise<boolean>} Retorna `true` se a resposta existir.
     *
     * @example
     * const exists = await Form.answerExist(10)
     */
    async answerExist(answer_id) {
        try {
            const result = await knex("answers_form")
                .select("id")
                .where({ id: answer_id })
                .first()
            return !!result
        } catch (err) {
            console.error("Erro ao verificar resposta:", err)
            return false
        }
    }

    /**
     * Retorna o ID da turma e do formulário associados a uma resposta.
     *
     * @async
     * @param {number} answer_id - ID da resposta.
     * @returns {Promise<{class_id: number, form_id: number}|undefined>}
     *
     * @example
     * const data = await Form.getClassIdByAnswerId(4)
     * console.log(data.class_id)
     */
    async getClassIdByAnswerId(answer_id) {
        try {
            const result = await knex("answers_form as af")
                .join("form as f", "f.id", "af.form_id")
                .select("f.class_id", "af.form_id")
                .where("af.id", answer_id)
                .first()
            return result
        } catch (err) {
            console.error("Erro ao buscar turma da resposta:", err)
            return undefined
        }
    }

    /**
     * Salva um comentário de correção realizado pelo professor.
     *
     * @async
     * @param {Object} data - Dados do comentário.
     * @param {number} data.answer_id - ID da resposta corrigida.
     * @param {number} data.teacher_id - ID do professor que realizou a correção.
     * @param {string} data.comment - Comentário textual do professor.
     * @returns {Promise<boolean>} Retorna `true` se o comentário foi salvo.
     *
     * @example
     * await Form.saveCorrection({
     *   answer_id: 4,
     *   teacher_id: 1,
     *   comment: "Ótima resposta!"
     * })
     */
    async saveCorrection(data) {
        try {
            await knex("comment_answers").insert(data)
            return true
        } catch (err) {
            console.error("Erro ao salvar comentário:", err)
            return false
        }
    }

    /**
     * Atualiza o status de correção de uma resposta.
     *
     * @async
     * @param {number} answer_id - ID da resposta.
     * @param {string} status - Status atualizado (ex: "correto", "incorreto", "parcial").
     * @returns {Promise<boolean>} Retorna `true` se a atualização foi bem-sucedida.
     *
     * @example
     * await Form.updateCorrection(12, "correto")
     */
    async updateCorrection(answer_id, status) {
        try {
            await knex("answers_form").where({ id: answer_id }).update({ status })
            return true
        } catch (err) {
            console.error("Erro ao atualizar correção:", err)
            return false
        }
    }

    /**
     * Atualiza o status geral de um formulário após uma correção.
     *
     * @async
     * @param {number} form_id - ID do formulário.
     * @returns {Promise<boolean>} Retorna `true` se a atualização foi concluída.
     *
     * @example
     * await Form.updateStatusForm(3)
     */
    async updateStatusForm(form_id) {
        try {
            await knex("form").where({ id: form_id }).update({ status: "corrigido" })
            return true
        } catch (err) {
            console.error("Erro ao atualizar status do formulário:", err)
            return false
        }
    }
}

module.exports = new Form()
