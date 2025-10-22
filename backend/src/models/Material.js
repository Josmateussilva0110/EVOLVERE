const knex = require("../database/connection")

/**
 * Classe responsável por gerenciar operações relacionadas aos materiais no banco de dados.
 * Fornece métodos para salvar, deletar e verificar a existência de materiais.
 * 
 * @class Material
 */
class Material {

    /**
     * Insere um novo material na tabela "materials".
     * 
     * @async
     * @param {Object} data - Dados do material a serem salvos.
     * @param {string} data.title - Título do material.
     * @param {string} [data.description] - Descrição opcional do material.
     * @param {number} data.type - Tipo do material (ex: 1 = PDF, 2 = vídeo, etc).
     * @param {string} data.archive - Caminho do arquivo salvo.
     * @param {number} data.created_by - ID do usuário que criou o material.
     * @param {number} data.subject_id - ID da disciplina à qual o material pertence.
     * @param {number} [data.class_id] - ID da turma associada (caso exista).
     * @param {number} [data.origin] - Indica a origem do material (1 = disciplina, 2 = turma).
     * @returns {Promise<boolean>} Retorna `true` se o material for salvo com sucesso, ou `false` em caso de erro.
     */
    async save(data) {
        try {
            await knex("materials").insert(data)
            return true
        } catch(err) {
            console.error('Erro ao cadastrar material:', err)
            return false
        }
    }


    /**
     * Deleta um material com base no ID.
     * 
     * @async
     * @param {number} id - ID do material a ser deletado.
     * @returns {Promise<boolean>} Retorna `true` se o material for deletado com sucesso, ou `false` caso contrário.
     */
    async deleteById(id) {
        try {
            const deleted = await knex('materials').where({ id }).delete();
            return deleted > 0;
        } catch (err) {
            console.error("Erro ao deletar material:", err);
            return false;
        }
    }


    /**
     * Verifica se um material existe no banco de dados.
     * 
     * @async
     * @param {number} id - ID do material a ser verificado.
     * @returns {Promise<boolean>} Retorna `true` se o material existir, ou `false` caso contrário.
     */
    async materialExist(id) {
        try {
            const result = await knex.select("*").where({id}).table("materials")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar material:', err)
            return false
        }
    }

    async getMaterialsByIdClass(class_id) {
        try {
            const result = await knex.raw(`
                select 
                    m.id,
                    m.title,
                    case 
                        when m.type = 1 then 'PDF'
                        when m.type = 2 then 'DOC'
                        when m.type = 3 then 'PPT'
                        else 'Desconhecido'
                    end as type_file,
                    m.archive,
                    m.updated_at
                from materials m
                where m.class_id = ? and m.origin = 2
                order by m.updated_at desc
            `, [class_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error('Erro ao buscar materiais da turma:', err)
            return false
        }
    }
    
}

module.exports = new Material()
