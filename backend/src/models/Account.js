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

    /**
     * Retorna todas as solicitações de aprovação de professores que ainda não foram aprovadas.
     *
     * @async
     * @returns {Promise<Array<Object>|undefined>} Retorna um array de objetos contendo:
     * - `diploma` - Nome do arquivo do diploma.
     * - `username` - Nome do usuário.
     * - `id` - ID do profissional.
     * - `course` - Nome do curso.
     * - `flag` - Sigla da instituição de ensino.
     * Retorna `undefined` se não houver solicitações ou em caso de erro.
     *
     * @example
     * const requests = await Account.getRequests()
     * if (requests) {
     *   console.log(requests)
     * }
     */
    async getRequests() {
        try {
            const result = await knex.raw(`
                select 
                    split_part(diploma, '/', 2) as diploma, 
                    u.username,
                    vp.professional_id as id,
                    cv.name as course,
                    cv."acronym_IES" as flag
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


    /**
     * Remove uma solicitação de aprovação de professor pelo ID do profissional.
     *
     * @async
     * @param {number} id - ID do profissional cuja solicitação será removida.
     * @returns {Promise<boolean>} Retorna `true` se a exclusão foi bem-sucedida, `false` em caso de erro.
     *
     * @example
     * const deleted = await Account.deleteRequest(5)
     * // deleted === true ou false
     */
    async deleteRequest(id) {
        try {
            const result = await knex('validate_professionals')
            .where({ professional_id: id })
            .del()
            return result > 0
        } catch (err) {
            console.error('Erro ao remover request:', err)
            return false
        }
    }

    /**
     * Aprova a solicitação de um professor definindo o campo `approved` como `true`.
     *
     * @async
     * @param {number} id - ID do profissional a ser aprovado.
     * @returns {Promise<boolean>} Retorna `true` se a aprovação foi bem-sucedida, `false` em caso de erro.
     *
     * @example
     * const approved = await Account.approveTeacher(5)
     * // approved === true ou false
     */
    async approveTeacher(id) {
        try {
            const result = await knex('validate_professionals').where({professional_id: id }).update({approved: true})
            return result > 0
        } catch(err) {
            console.error('Erro ao aprovar request:', err)
            return false
        }
    }
}

module.exports = new Account()
