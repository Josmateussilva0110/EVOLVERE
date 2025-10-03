const knex = require("../database/connection")

/**
 * Classe para manipulação de dados relacionados a Cursos na base de dados.
 * @class
 */
class Course {

 /**
     * Busca todos os cursos cadastrados na tabela `course_valid`.
     * @async
     * @returns {Promise<Object[]|undefined>} Retorna um array de cursos ou undefined.
     */
    async getAll() {
        try {
            const result = await knex.select("*").table("course_valid")
            return result.length > 0 ? result : undefined
        } catch(err) {
            console.error("Erro no model ao buscar todos os cursos:", err);
            return undefined
        }
    }

 /**
     * Busca um curso pelo seu código único.
     * @async
     * @param {string} code - Código único do curso (`course_code`).
     * @returns {Promise<Object|undefined>} Retorna o objeto do curso ou undefined.
     */
    async getCourseByCode(code) {
        try {
            const result = await knex.select("*").where({course_code: code}).table("course_valid")
            return result[0] || undefined
        } catch(err) {
        console.error("Erro no model ao buscar curso por código:", err);
        return undefined
        }
    }

    /**
     * Busca todos os professores aprovados e associados a um curso específico.
     * @async
     * @param {number} courseId - O ID do curso.
     * @returns {Promise<Object[]>} Retorna um array de objetos de professores, ou um array vazio em caso de erro.
     * @example
     * const professors = await Course.findProfessors(2);
     * // professors = [
     * //   { "id": 5, "username": "Prof. Carlos", "institution": "Universidade X" },
     * //   { "id": 8, "username": "Prof. Ana", "institution": "Universidade X" }
     * // ]
     */
    async findProfessors(courseId) {
        try {
            const professors = await knex('users')
            .select('users.id', 'users.username', 'vp.institution')
            .join('validate_professionals as vp', 'users.id', '=', 'vp.professional_id')
            .join('course_valid as cv', 'vp.access_code', '=', knex.raw('cv.course_code::text'))
            .where('cv.id', courseId) 
            .where('vp.role', 3)
            .where('vp.approved', true);
 
            return professors;
        } catch (err) {
            console.error("Erro ao buscar professores por curso:", err);
            return []; // Retorna um array vazio em caso de erro
        }
    }
    
    /**
     * Encontra todas as disciplinas de um curso específico pelo ID do curso.
     * Também une com a tabela de usuários para obter o nome do professor.
     * @async
     * @param {number} courseId - O ID do curso.
     * @returns {Promise<Object[]|undefined>} Uma lista de disciplinas ou undefined em caso de erro.
     * @example
     * const subjects = await Course.findSubjectsByCourseId(2);
     * // subjects = [
     * //   { "id": 10, "name": "Cálculo I", "professor_nome": "Prof. Carlos" },
     * //   { "id": 12, "name": "Física I", "professor_nome": null }
     * // ]
     */
    async findSubjectsByCourseId(courseId) {
        try {
            const subjects = await knex('subjects')
                // Seleciona todas as colunas de 'subjects' E o nome do professor da tabela 'users'
                .select(
                    'subjects.*', 
                    'users.username as professor_nome' 
                )
                // Usa LEFT JOIN para garantir que disciplinas sem professor também apareçam
                .leftJoin('users', 'subjects.professional_id', 'users.id')
                // Filtra o resultado para pegar apenas disciplinas do curso desejado
                .where('subjects.course_valid_id', courseId);
            
            return subjects;
        } catch (err) {
            console.error("Erro no model ao buscar disciplinas por curso:", err);
            return undefined;
        }
    }
}

module.exports = new Course()
