const knex = require("../database/connection")

/**
 * Classe responsável por gerenciar as operações relacionadas às questões de formulários.
 * Cada questão pertence a um formulário (form_id) e pode ter um conjunto de opções associadas.
 */
class Question {

    /**
     * Insere uma nova questão no banco de dados.
     * 
     * @async
     * @param {Object} data - Dados da questão a ser salva.
     * @param {number} data.form_id - ID do formulário ao qual a questão pertence.
     * @param {string} data.text - Texto ou enunciado da questão.
     * @param {number} [data.points=0] - Quantidade de pontos atribuída à questão (padrão: 0).
     * @param {string} data.type - Tipo da questão (exemplo: 'multiple_choice', 'true_false', etc.).
     * 
     * @returns {Promise<Object>} Retorna um objeto indicando o sucesso da operação.
     * @property {boolean} success - Indica se a inserção foi bem-sucedida.
     * @property {number} [insertId] - ID da questão recém-criada (presente apenas em caso de sucesso).
     * 
     * @example
     * const questionData = {
     *   form_id: 3,
     *   text: "Qual é a capital do Brasil?",
     *   points: 5,
     *   type: "multiple_choice"
     * }
     * const result = await Question.save(questionData)
     * // result -> { success: true, insertId: 8 }
     */
    async save(data) {
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

}

module.exports = new Question()
