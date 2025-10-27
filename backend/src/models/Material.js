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


    /**
     * Busca todos os materiais associados a uma turma específica.
     * 
     * @async
     * @function getMaterialsByIdClass
     * @param {number} class_id - ID da turma cujos materiais serão buscados.
     * @returns {Promise<{ total_materials: number, materials: Array<Object> } | false>}
     * Retorna um objeto contendo:
     * - `total_materials`: número total de materiais encontrados.
     * - `materials`: lista de materiais com os seguintes campos:
     *   - `id`: ID do material.
     *   - `title`: título do material.
     *   - `class_name`: nome da turma associada.
     *   - `type_file`: tipo de arquivo (PDF, DOC, PPT ou Desconhecido).
     *   - `archive`: caminho ou nome do arquivo armazenado.
     *   - `updated_at`: data da última atualização.
     * 
     * Retorna `false` em caso de erro.
     * 
     * @throws {Error} Registra no console uma mensagem de erro caso ocorra falha na consulta.
     * 
     * @example
     * const result = await getMaterialsByIdClass(10);
     * if (result) {
     *   console.log(`Total: ${result.total_materials} materiais`);
     *   console.table(result.materials);
     * }
     */
    async getMaterialsByIdClass(class_id) {
    try {
        const classInfo = await knex
        .select("id", "name")
        .from("classes")
        .where({ id: class_id })
        .first();

        if (!classInfo) {
        return null;
        }

        // 2️⃣ Busca os materiais da turma
        const materialsResult = await knex.raw(`
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
        `, [class_id]);

        const materials = materialsResult.rows;

        const countResult = await knex.raw(`
        select count(*) as total_materials
        from materials
        where class_id = ? and origin = 2
        `, [class_id]);

        const total = Number(countResult.rows[0]?.total_materials || 0);

        return {
        class_name: classInfo.name,
        total_materials: total,
        materials
        };

    } catch (err) {
        console.error("Erro ao buscar materiais da turma:", err);
        return false;
    }
    }


    
}

module.exports = new Material()
