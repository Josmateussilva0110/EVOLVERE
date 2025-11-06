const knex = require("../database/connection")

/**
 * @class Form
 * @classdesc Classe responsável por interagir com a tabela `form` e suas tabelas relacionadas
 * (`questions`, `options`, `answers_form` e `classes`) no banco de dados. 
 * 
 * Inclui métodos para criação, consulta e exclusão de formulários, além de operações
 * auxiliares para cadastrar questões, opções e respostas associadas.
 */
class Form {

    /**
     * Verifica se já existe um formulário com o mesmo título para uma determinada turma.
     *
     * @async
     * @param {string} title - Título do formulário.
     * @param {number} class_id - ID da turma associada ao formulário.
     * @returns {Promise<boolean>} Retorna `true` se o formulário existir, caso contrário `false`.
     *
     * @example
     * const exists = await Form.formExists("Prova 1", 2)
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
     * Salva um novo formulário no banco de dados.
     *
     * @async
     * @param {Object} data - Dados do formulário a ser inserido.
     * @param {string} data.title - Título do formulário.
     * @param {string} data.description - Descrição do formulário.
     * @param {number} data.created_by - ID do usuário criador.
     * @param {number} data.subject_id - ID da disciplina associada.
     * @param {number} data.class_id - ID da turma associada.
     * @returns {Promise<{success: boolean, insertId?: number}>} Retorna objeto com status da operação e ID inserido.
     *
     * @example
     * await Form.save({ title: "Prova 2", description: "Avaliação final", created_by: 3, subject_id: 1, class_id: 2 })
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
     * Salva uma nova questão vinculada a um formulário.
     *
     * @async
     * @param {Object} data - Dados da questão.
     * @param {number} data.form_id - ID do formulário associado.
     * @param {string} data.text - Texto da questão.
     * @param {number} data.points - Pontuação da questão.
     * @param {string} data.type - Tipo da questão (ex: "multiple_choice", "true_false").
     * @returns {Promise<{success: boolean, insertId?: number}>} Retorna status e ID da questão criada.
     *
     * @example
     * await Form.saveQuestion({ form_id: 1, text: "Qual é a capital da França?", points: 2, type: "multiple_choice" })
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
     * Salva uma nova opção vinculada a uma questão.
     *
     * @async
     * @param {Object} data - Dados da opção.
     * @param {number} data.question_id - ID da questão associada.
     * @param {string} data.text - Texto da opção.
     * @param {boolean} [data.correct=false] - Indica se a opção é correta.
     * @returns {Promise<{success: boolean, insertId?: number}>} Retorna status e ID da opção criada.
     *
     * @example
     * await Form.saveOption({ question_id: 10, text: "Paris", correct: true })
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
     * incluindo suas questões e opções em formato JSON.
     *
     * @async
     * @param {number} class_id - ID da turma associada aos formulários.
     * @returns {Promise<Object[]|undefined>} Retorna lista de formulários com suas questões e opções, ou `undefined` se não houver resultados.
     *
     * @example
     * const forms = await Form.getFormByUser(5)
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
     * Busca um formulário pelo ID, incluindo suas perguntas e opções.
     *
     * @async
     * @param {number|string} id - ID do formulário a ser buscado.
     * @returns {Promise<Object[]|undefined>} Retorna um array com os dados do formulário e suas perguntas, 
     * ou `undefined` se o formulário não for encontrado.
     *
     * @example
     * const form = await Form.getFormById(3)
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
            `, [id]);
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar formulários:", err);
            return undefined
        }
    }

    /**
     * Verifica se um formulário existe pelo ID.
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
     * Deleta um formulário com base no ID informado.
     *
     * @async
     * @param {number|string} id - ID do formulário a ser deletado.
     * @returns {Promise<boolean>} Retorna `true` se o formulário foi deletado com sucesso, 
     * ou `false` caso contrário.
     *
     * @example
     * const deleted = await Form.deleteById(5)
     */
    async deleteById(id) {
        try {
            const deleted = await knex('form').where({ id }).delete();
            return deleted > 0;
        } catch (err) {
            console.error("Erro ao deletar formulário:", err);
            return false;
        }
    }

    /**
     * Busca todos os formulários associados a uma turma específica,
     * retornando também o nome da turma.
     *
     * @async
     * @param {number} class_id - ID da turma.
     * @returns {Promise<{class_name: string, forms: Object[]}|undefined>} Retorna nome da turma e lista de formulários,
     * ou `undefined` se ocorrer erro.
     *
     * @example
     * const data = await Form.getForm(2)
     * console.log(data.class_name) // "Turma A"
     */
    async getForm(class_id, user_id) {
        try {
            const classInfo = await knex
                .select("id", "name")
                .from("classes")
                .where({ id: class_id })
                .first();

            if (!classInfo) {
                return null;
            }

            const result = await knex.raw(`
                SELECT
                    f.id,
                    f.title,
                    f.class_id,
                    f.subject_id,
                    f.deadline
                FROM form f
                INNER JOIN classes c
                    ON c.id = f.class_id
                WHERE f.class_id = ?
                AND NOT EXISTS (
                    SELECT 1
                    FROM answers_form af
                    WHERE af.form_id = f.id
                    AND af.user_id = ?
                )
                `, [class_id, user_id])

            const forms = result.rows
            return {
                class_name: classInfo.name,
                forms
            }
        } catch(err) {
            console.error("Erro ao buscar simulados:", err);
            return undefined;
        }
    }

/**
     * Retorna todas as atividades (forms) pendentes para um aluno específico.
     * Busca tanto atividades da disciplina (globais) quanto da turma (específicas).
     * * @async
     * @function getPendingForStudent
     * @param {number} student_id - ID do aluno.
     * @returns {Promise<Array<Object>|undefined>} Lista de atividades pendentes.
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
     * Salva as respostas de um formulário enviadas por um aluno.
     *
     * @async
     * @param {Object[]} data - Lista de respostas a serem registradas.
     * @param {number} data[].form_id - ID do formulário respondido.
     * @param {number} data[].question_id - ID da questão respondida.
     * @param {number} data[].option_id - ID da opção escolhida.
     * @param {number} data[].user_id - ID do aluno que respondeu.
     * @returns {Promise<{success: boolean, ids?: number[]}>} Retorna status da operação e IDs inseridos.
     *
     * @example
     * await Form.saveAnswers([
     *   { form_id: 1, question_id: 10, option_id: 3, user_id: 5 },
     *   { form_id: 1, question_id: 11, option_id: 7, user_id: 5 }
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
     * Busca o ID da turma associada a um formulário específico.
     *
     * @async
     * @param {number|string} id - ID do formulário.
     * @returns {Promise<{class_id: number}|undefined>} Retorna o ID da turma ou `undefined` se não encontrado.
     *
     * @example
     * const classData = await Form.getClassIdByForm(4)
     * console.log(classData.class_id) // 2
     */
    async getClassIdByForm(id) {
        try {
            const result = await knex.select(["class_id"]).where({id}).table("form")
            if(result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        } catch (err) {
            console.error("Erro ao buscar id da turma: ", err)
            return undefined
        }
    }

    async mockCorrection(class_id) {
        try {
             const result = await knex.raw(`
                select distinct on (af.form_id)
                    af.form_id,
                    f.title,
                    f.status,
                    f.subject_id,
                    s.name
                from answers_form af
                inner join form f
                    on f.id = af.form_id
                inner join subjects s
                    on s.id = f.subject_id
                where f.class_id = ? and af.open_answer is not null
            `, [class_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch (err) {
            console.error("Erro ao buscar formulários para correção: ", err)
            return undefined
        }
    }

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

    async answerExist(answer_id) {
        try {
            const result = await knex.select("*").where({id: answer_id}).table("answers_form")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar resposta:', err)
            return false
        }
    }

    async getClassIdByAnswerId(answer_id) {
        try {
             const result = await knex.raw(`
                select
                    f.class_id,
                    f.id as form_id
                from form f
                inner join answers_form af
                    on af.form_id = f.id
                where af.id = ?
                `, [answer_id])
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch (err) {
            console.error("Erro ao buscar id da turma pela resposta: ", err)
            return undefined
        }
    }

    async saveCorrection(data) {
        try {
            const ids = await knex("comment_answers").insert(data)
            return { success: true, ids }
        } catch (err) {
            console.error("Erro ao cadastrar correção de formulário:", err)
            return { success: false }
        }
    }

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

    async updateStatusForm(form_id) {
        try {
            const updated_at = knex.fn.now()
            const result = await knex("form")
                .where({ id: form_id })
                .update({ status: 2, updated_at})
            return result > 0
        } catch (err) {
            console.error("Erro ao atualizar resposta: ", err)
            return false
        }
    }
}

module.exports = new Form()
