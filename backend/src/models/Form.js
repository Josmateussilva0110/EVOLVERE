const knex = require("../database/connection")

/**
 * @class Form
 * @classdesc Classe responsável por interagir com a tabela `form` e suas tabelas relacionadas
 * (`questions` e `options`) no banco de dados. 
 * 
 * Inclui métodos para criação, consulta e exclusão de formulários, além de operações
 * auxiliares para cadastrar questões e opções associadas.
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
     * Retorna todos os formulários criados por um determinado usuário,
     * incluindo suas questões e opções em formato JSON.
     *
     * @async
     * @param {number} created_by - ID do usuário criador.
     * @returns {Promise<Object[]|undefined>} Retorna lista de formulários ou `undefined` se não houver resultados.
     *
     * @example
     * const forms = await Form.getFormByUser(5)
     */
    async getFormByUser(created_by) {
        try {
            const result = await knex.raw(`
                SELECT
                    f.id,
                    f.title,
                    f.description,
                    f.subject_id,
                    f.class_id,
                    SUM(COALESCE(q.points, 0)) AS total_points,
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
                WHERE f.created_by = ?
                GROUP BY f.id
                ORDER BY f.updated_at DESC;
            `, [created_by])

            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch (err) {
            console.error("Erro ao buscar formulários:", err)
            return undefined
        }
    }

}

module.exports = new Form()
