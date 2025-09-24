const knex = require("../database/connection")

/**
 * Classe responsável por gerenciar contas de profissionais.
 * @class
 */
class Account {

    /**
     * Salva uma nova conta de profissional na tabela `validate_professionals`.
     *
     * @async
     * @param {Object} data - Objeto contendo os dados do profissional.
     * @param {number} data.professional_id - ID do usuário/profissional.
     * @param {string} data.institution - Nome da instituição.
     * @param {string|number} data.access_code - Código de acesso válido.
     * @param {string} data.diploma - Caminho do arquivo PDF do diploma.
     * @param {string} data.role - Papel (role) do profissional.
     * @returns {Promise<boolean>} Retorna `true` se o cadastro for bem-sucedido, `false` caso ocorra algum erro.
     *
     * @example
     * const success = await Account.save({
     *   professional_id: 5,
     *   institution: "Universidade X",
     *   access_code: "123456",
     *   diploma: "diplomas/arquivo.pdf",
     *   role: "professor"
     * })
     * // success === true ou false
     */
    async save(data) {
        try {
            await knex("validate_professionals").insert(data)
            return true
        } catch(err) {
            console.error('Erro ao cadastrar conta de usuário:', err)
            return false
        }
    }

    /**
     * Verifica se uma conta de profissional existe na tabela `validate_professionals`.
     *
     * @async
     * @param {number|string} id - ID do profissional a ser verificado.
     * @returns {Promise<boolean>} Retorna `true` se a conta existir, `false` caso contrário ou em caso de erro.
     *
     * @example
     * const exists = await Account.accountExists(5)
     * // exists === true ou false
     */
    async accountExists(id) {
        try {
            const result = await knex
                .select(["professional_id"])
                .where({ professional_id: id })
                .table("validate_professionals")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao buscar conta:', err)
            return false
        }
    }

    async getRequests() {
        try {
            const result = await knex.raw(`
                select 
                    split_part(diploma, '/', 2) as diploma, 
                    u.username,
                    vp.professional_id as id,
                    cv.name as course
                from validate_professionals vp
                inner join users u
                    on u.id = vp.professional_id
                inner join course_valid cv
                    on cv.course_code::text = vp.access_code
                where vp.role = 3 and vp.approved = false
            `)
            const rows = result.rows
             return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error('Erro ao buscar requests:', err)
            return undefined
        }
    }
}

module.exports = new Account()
