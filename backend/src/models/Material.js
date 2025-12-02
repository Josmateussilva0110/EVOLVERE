const knex = require("../database/connection")
const { supabase } = require("../utils/supabase")

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

            for (let material of materials) {
                if (!material.archive) {
                    material.file_url = null;
                    continue;
                }

                const { data, error } = await supabase.storage
                    .from("materials")
                    .createSignedUrl(material.archive, 60 * 60); // 1 hora

                if (error) {
                    console.error("Erro ao gerar URL Supabase:", error);
                    material.file_url = null;
                } else {
                    material.file_url = data.signedUrl;
                }
            }

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


    /**
     * Retorna todos os materiais de todas as turmas em que um aluno está matriculado.
     * * @async
     * @function getAllMaterialsForStudent
     * @param {number} student_id - ID do aluno.
     * @returns {Promise<Array<Object>|undefined>} Lista de materiais formatada.
     */
    async getAllMaterialsForStudent(student_id) {
        try {
            const query = knex('materials as m')
                .join('subjects as s', 's.id', 'm.subject_id')
                .select(
                    'm.id',
                    'm.title',
                    knex.raw(`
                        CASE 
                            WHEN m.type = 1 THEN 'PDF'
                            WHEN m.type = 2 THEN 'DOC'
                            WHEN m.type = 3 THEN 'PPT'
                            ELSE 'Outro'
                        END as type_file
                    `),
                    'm.archive',
                    'm.updated_at',
                    's.name as discipline_name'
                )
                .where('m.origin', 1) 
                .whereIn('m.subject_id', function() { 
                    this.select('c.subject_id')
                        .distinct()
                        .from('class_student as cs')
                        .join('classes as c', 'c.id', 'cs.class_id')
                        .where('cs.student_id', student_id);
                })
                .orderBy('m.updated_at', 'desc');

            const result = await query;

            for (let material of result) {
                if (!material.archive) {
                    material.file_url = null;
                    continue;
                }

                const { data, error } = await supabase.storage
                    .from("materials")
                    .createSignedUrl(material.archive, 60 * 60); // 1 hora

                if (error) {
                    console.error("Erro ao gerar URL Supabase:", error);
                    material.file_url = null;
                } else {
                    material.file_url = data.signedUrl;
                }
            }

            const formattedResult = result.map(material => ({
                id: material.id,
                titulo: material.title,
                tipo: material.type_file,
                tamanho: "N/D",
                data: material.updated_at,
                disciplina: material.discipline_name,
                archive: material.archive,
                categoria: material.type_file.toLowerCase(),
                file_url: material.file_url 
            }));

            return formattedResult;

        } catch (err) {
            console.error("Erro ao buscar materiais globais do aluno:", err);
            return undefined;
        }
    }

    
    
    /**
     * @function getUpdates
     * @description
     * Busca as atualizações recentes de um curso, retornando separadamente:
     * - Materiais atualizados
     * - Formulários atualizados
     * 
     * Cada categoria retorna no máximo 2 itens, ordenados por data de atualização.
     *
     * @async
     * @param {number|string} course_id - ID do curso para filtrar as atualizações.
     * 
     * @returns {Promise<Object>} Um objeto contendo:
     * @returns {Array<Object>} return.materials - Lista dos materiais atualizados.
     * @returns {number} return.materials[].material_id - ID do material.
     * @returns {string} return.materials[].material_title - Título do material.
     * @returns {number} return.materials[].subject_id - ID da disciplina.
     * @returns {string} return.materials[].subject_name - Nome da disciplina.
     * @returns {number} return.materials[].class_id - ID da turma.
     * @returns {string} return.materials[].class_name - Nome da turma.
     * @returns {string} return.materials[].teacher_name - Nome do professor responsável.
     * @returns {Date} return.materials[].updated_at - Data da última atualização.
     * 
     * @returns {Array<Object>} return.forms - Lista dos formulários atualizados.
     * @returns {number} return.forms[].form_id - ID do formulário.
     * @returns {string} return.forms[].form_title - Título do formulário.
     * @returns {number} return.forms[].class_id - ID da turma.
     * @returns {string} return.forms[].class_name - Nome da turma.
     * @returns {string} return.forms[].teacher_name - Nome do professor que criou o formulário.
     * @returns {Date} return.forms[].updated_at - Data da última atualização do formulário.
     * 
     * @throws {Error} Caso haja falha ao consultar o banco.
     */
    async getUpdates(course_id) {
        try {

            // Buscar materiais
            const materials = await knex("materials as m")
                .join("subjects as s", "s.id", "m.subject_id")
                .join("classes as c", "c.id", "m.class_id")
                .join("users as u", "u.id", "s.professional_id")
                .select(
                    "m.id as material_id",
                    "m.title as material_title",
                    "s.id as subject_id",
                    "s.name as subject_name",
                    "c.id as class_id",
                    "c.name as class_name",
                    "u.username as teacher_name",
                    "m.updated_at"
                )
                .where("s.course_valid_id", course_id)
                .orderBy("m.updated_at", "desc")
                .limit(2)

            // Buscar formulários
            const forms = await knex("form as f")
                .join("subjects as s", "s.id", "f.subject_id")       
                .join("classes as c", "c.id", "f.class_id")             
                .join("users as u", "u.id", "f.created_by")    
                .select(
                    "f.id as form_id",
                    "f.title as form_title",
                    "c.id as class_id",            
                    "c.name as class_name", 
                    "u.username as teacher_name",
                    "f.updated_at"
                )
                .where("s.course_valid_id", course_id)
                .orderBy("f.updated_at", "desc")
                .limit(2)

            return {
                materials,
                forms
            }

        } catch (err) {
            console.error("Erro ao buscar atualizações:", err)
            return { materials: [], forms: [] }
        }
    }
}


module.exports = new Material()
