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
     * A consulta retorna o formulário com os campos principais (id, título, descrição, etc.),
     * o total de pontos somando as questões e um array JSON com as perguntas e suas opções.
     *
     * @async
     * @function getFormById
     * @param {number|string} id - ID do formulário a ser buscado.
     * @returns {Promise<Object[]|undefined>} Retorna um array com os dados do formulário e suas perguntas, 
     * ou `undefined` se o formulário não for encontrado.
     *
     * @example
     * const form = await getFormById(3);
     * if (form) {
     *   console.log(form[0].title); // "Prova de Matemática"
     * }
     */
    async getFormById(id) {
        try {
            const result = await knex.raw(`
                
                select
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
                from form f
                inner join questions q ON q.form_id = f.id
                where f.id = ?
                group by f.id
                order by f.updated_at DESC;
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
     * @function formExist
     * @param {number|string} id - ID do formulário a ser verificado.
     * @returns {Promise<boolean>} Retorna `true` se o formulário existir, ou `false` caso contrário.
     *
     * @example
     * const exists = await formExist(1);
     * if (exists) {
     *   console.log("Formulário encontrado!");
     * }
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
     * @function deleteById
     * @param {number|string} id - ID do formulário a ser deletado.
     * @returns {Promise<boolean>} Retorna `true` se o formulário foi deletado com sucesso, 
     * ou `false` caso contrário.
     *
     * @example
     * const deleted = await deleteById(5);
     * if (deleted) {
     *   console.log("Formulário removido com sucesso!");
     * }
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

    async getForm(class_id) {
        try {
             const result = await knex.raw(`
                select
                    f.id, 
                    f.title,
                    f.class_id,
                    f.subject_id,
                    f.deadline,
                    c.name
                from form f
                inner join classes c
                    on c.id = f.class_id
                where f.class_id = ?
                `, [class_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar simulados:", err);
            return undefined;
        }
    }


}

module.exports = new Form()
