const knex = require("../database/connection")

/**
 * Classe responsável por gerenciar as operações relacionadas às opções de perguntas.
 * Cada opção está associada a uma questão (question_id) e pode ser marcada como correta ou não.
 */
class Option {

    /**
     * Salva uma nova opção no banco de dados.
     * 
     * @async
     * @param {Object} data - Dados da opção a ser inserida.
     * @param {number} data.question_id - ID da questão à qual a opção pertence.
     * @param {string} data.text - Texto da opção.
     * @param {boolean} [data.correct=false] - Indica se a opção é a correta (padrão: false).
     * 
     * @returns {Promise<Object>} Retorna um objeto indicando o sucesso da operação.
     * @property {boolean} success - Indica se a inserção foi bem-sucedida.
     * @property {number} [insertId] - ID da opção recém-criada (presente apenas em caso de sucesso).
     * 
     * @example
     * const optionData = { question_id: 1, text: "Resposta A", correct: true }
     * const result = await Option.save(optionData)
     * // result -> { success: true, insertId: 12 }
     */
    async save(data) {
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

}

module.exports = new Option()
