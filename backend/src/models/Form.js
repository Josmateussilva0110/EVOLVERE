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
                    af.created_at AS send_response,
                    json_agg(
                        DISTINCT jsonb_build_object(   -- evita duplicação
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

                LEFT JOIN (
                    SELECT form_id, MAX(created_at) AS created_at
                    FROM answers_form
                    GROUP BY form_id
                ) af ON af.form_id = f.id

                WHERE f.id = ?
                GROUP BY f.id, af.created_at
                ORDER BY f.updated_at DESC;
            `, [id])

            const rows = result.rows
            return rows.length > 0 ? rows : undefined

        } catch (err) {
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
        // 1. Descobre quais turmas e disciplinas o aluno cursa
        const studentClasses = await knex('class_student as cs')
        .join('classes as c', 'c.id', 'cs.class_id')
        .where('cs.student_id', student_id)
        .select('c.id as class_id', 'c.subject_id');

        if (studentClasses.length === 0) {
        return []; // Aluno não está em nenhuma turma
        }

        // Cria listas de IDs
        const classIds = studentClasses.map(c => c.class_id);
        const subjectIds = [...new Set(studentClasses.map(c => c.subject_id))];

        // 2. Busca formulários pendentes
        const query = knex('form as f')
        .select(
            'f.id',
            'f.title',
            'f.description',
            'f.deadline',
            'f.class_id',
            's.name as discipline_name'
        )
        .leftJoin('subjects as s', 's.id', 'f.subject_id')
        // 🔹 Junta com answers_form para verificar se o aluno respondeu
        .leftJoin('answers_form as af', function() {
            this.on('af.form_id', '=', 'f.id')
                .andOn('af.user_id', '=', knex.raw('?', [student_id]));
        })
        // 🔹 Só retorna formulários SEM resposta do aluno
        .whereNull('af.id')
        // 🔹 Atividade ainda não venceu
        .andWhere('f.deadline', '>', knex.fn.now())
        // 🔹 Atividade pertence à turma ou disciplina do aluno
        .andWhere(function() {
            this.where(function() {
            this.whereNotNull('f.class_id').whereIn('f.class_id', classIds);
            })
            .orWhere(function() {
            this.whereNull('f.class_id').whereIn('f.subject_id', subjectIds);
            });
        })
        // 🔹 Ordena pela data de entrega
        .orderBy('f.deadline', 'asc');

        return await query;
    } catch (err) {
        console.error("Erro ao buscar atividades pendentes do aluno:", err);
        return undefined;
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
    async mockCorrection(subject_id) {
        try {
            const result = await knex.raw(`
            SELECT DISTINCT ON (af.form_id)
                af.form_id,
                f.title,
                f.subject_id,
                c.name,
                BOOL_AND(fc.corrected) AS status
            FROM answers_form af
            INNER JOIN form f
                ON f.id = af.form_id
            INNER JOIN classes c
                ON c.id = f.class_id
            INNER JOIN form_corrections fc
                ON fc.form_id = f.id
            WHERE f.subject_id = ?
                AND af.open_answer IS NOT NULL
            GROUP BY af.form_id, f.title, f.subject_id, c.name
            `, [subject_id])

            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch (err) {
            console.error("Erro ao buscar formulários para correção:", err)
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
                INNER JOIN form_corrections fc ON fc.student_id = u.id 
                and fc.form_id = af.form_id
                WHERE af.form_id = ?
                AND af.open_answer IS NOT NULL 
                AND fc.corrected = false
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
             const result = await knex.raw(`
                select
                    f.class_id,
                    f.id as form_id,
                    af.user_id as student_id
                from form f
                inner join answers_form af
                    on af.form_id = f.id
                where af.id = ?
                `, [answer_id])
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch (err) {
            console.error("Erro ao buscar turma da resposta:", err)
            return undefined
        }
    }

    async saveFormAndUserCorrection(data) {
        try {
            const ids = await knex("form_corrections").insert(data)
            return { success: true, ids }
        } catch (err) {
            console.error("Erro cadastro de correção de formulário:", err)
            return { success: false }
        }
    }

    /**
     * Salva as correções de um formulário no banco de dados.
     *
     * @async
     * @function saveFormAndUserCorrection
     * @param {Object|Object[]} data - Dados a serem inseridos na tabela `form_corrections`.
     * Pode ser um objeto único ou um array de objetos contendo as informações da correção.
     * @param {number} data.form_id - ID do formulário corrigido.
     * @param {number} data.user_id - ID do usuário (aluno) relacionado à correção.
     * @param {number} data.teacher_id - ID do professor que realizou a correção.
     * @param {string} [data.comment] - Comentário opcional da correção.
     * @param {boolean} [data.corrected] - Indica se o formulário foi totalmente corrigido.
     *
     * @returns {Promise<{success: boolean, ids?: number[]}>} Retorna um objeto com `success = true`
     * e os IDs das inserções realizadas se bem-sucedido, ou `success = false` em caso de erro.
     *
     * @throws {Error} Lança erro interno caso a operação no banco de dados falhe.
     */
    async saveFormAndUserCorrection(data) {
        try {
            const ids = await knex("form_corrections").insert(data)
            return { success: true, ids }
        } catch (err) {
            console.error("Erro cadastro de correção de formulário:", err)
            return { success: false }
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
            const updated_at = knex.fn.now()
            const result = await knex("answers_form")
                .where({ id: answer_id })
                .update({ corrected: status, updated_at})
            return result > 0
        } catch (err) {
            console.error("Erro ao atualizar resposta: ", err)
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
    async updateStatusForm(form_id, student_id) {
        try {
            const updated_at = knex.fn.now()
            const result = await knex("form_corrections")
                .where({ form_id }).andWhere({ student_id })
                .update({ corrected: true, updated_at})
            return result > 0
        } catch (err) {
            console.error("Erro ao atualizar status de formulário: ", err)
            return false
        }
    }

    async saveComment(data) {
        try {
            const ids = await knex("comment_answers").insert(data)
            return { success: true, ids }
        } catch (err) {
            console.error("Erro ao cadastrar correção de formulário:", err)
            return { success: false }
        }
    }

    async calculateResults(formattedAnswers) {
        try {
            const rowsToInsert = formattedAnswers.map(a => `(${a.question_id}, ${a.option_id})`).join(",")

            const result = await knex.raw(`
            WITH user_answers(question_id, option_id) AS (
                VALUES ${rowsToInsert}
            )
            SELECT
                COUNT(*) FILTER (WHERE o.correct = true) AS correct,
                COUNT(*) FILTER (WHERE o.correct = false) AS wrong,
                COALESCE(SUM(q.points) FILTER (WHERE o.correct = true), 0) AS total_points
            FROM user_answers ua
            INNER JOIN options o ON o.id = ua.option_id
            INNER JOIN questions q ON q.id = ua.question_id
            `)

            const rows = result.rows
            return rows.length > 0 ? rows[0] : { correct: 0, wrong: 0, total_points: 0 }
        } catch (err) {
            console.error("Erro ao calcular resultados:", err)
            return { correct: 0, wrong: 0, total_points: 0 }
        }
    }


    async saveFormResults(data) {
        try {
            const ids = await knex("results_form").insert(data)
            return { success: true, ids }
        } catch (err) {
            console.error("Erro cadastro de resultados: ", err)
            return { success: false }
        }
    }

    async resultForm(form_id, student_id) {
        try {
            const result = await knex.raw(`
                SELECT
                    f.title as form_name,
                    u.username,
                    SUM(rf.correct) AS total_correct,
                    SUM(rf.wrong) AS total_wrong,
                    SUM(rf.points) AS total_points,
                    (SUM(rf.correct) + SUM(rf.wrong)) AS total_questions,
                    CASE 
                        WHEN (SUM(rf.correct) + SUM(rf.wrong)) > 0 
                        THEN ROUND((SUM(rf.correct)::decimal / (SUM(rf.correct) + SUM(rf.wrong))) * 100, 2)
                        ELSE 0
                    END AS percent_correct,
                    MAX(rf.updated_at) AS updated_at
                FROM results_form rf
                inner join form f
                    on f.id = rf.form_id
                inner join users u
                    on u.id = rf.student_id
                WHERE rf.form_id = ? AND rf.student_id = ?
                GROUP BY f.title, u.username;
            `, [form_id, student_id]);

            return result.rows[0];
        } catch (err) {
            console.error("Erro ao buscar resultados do formulário: ", err);
            return undefined;
        }
    }


}

module.exports = new Form()
