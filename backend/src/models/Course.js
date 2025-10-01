const knex = require("../database/connection")

/**
 * Classe para manipulação de cursos válidos na base de dados.
 * @class
 */
class Course {

    /**
     * Busca todos os cursos cadastrados na tabela `course_valid`.
     *
     * @async
     * @returns {Promise<Object[]|undefined>} Retorna um array de cursos caso existam,
     * ou `undefined` se nenhum curso for encontrado ou se ocorrer erro.
     *
     * @example
     * const courses = await Course.getAll()
     * // courses = [
     * //   { id: 1, name: "Matemática", course_code: "123456" },
     * //   { id: 2, name: "Física", course_code: "234567" }
     * // ] ou undefined
     */
    async getAll() {
        try {
            const result = await knex.select("*").table("course_valid")
            return result.length > 0 ? result : undefined
        } catch(err) {
            return undefined
        }
    }

    /**
     * Busca um curso pelo código fornecido.
     *
     * @async
     * @param {string} code - Código único do curso (`course_code`).
     * @returns {Promise<Object|undefined>} Retorna o curso encontrado ou `undefined`
     * caso não exista ou se ocorrer erro.
     *
     * @example
     * const course = await Course.getCourseByCode("123456")
     * // course = { id: 1, name: "Matemática", course_code: "123456" } ou undefined
     */
    async getCourseByCode(code) {
        try {
            const result = await knex.select("*").where({course_code: code}).table("course_valid")
            return result[0] || undefined
        } catch(err) {
            return undefined
        }
    }

    async findProfessors(courseId) {
        try {
            const professors = await knex('users')
                .select('users.id', 'users.username', 'vp.institution')
                .join('validate_professionals as vp', 'users.id', '=', 'vp.professional_id')
                .join('course_valid as cv', 'vp.access_code', '=', knex.raw('cv.course_code::text'))
                .where('cv.id', courseId) 
                .where('vp.role', 3)       // Filtra para garantir que são professores (role = 3)
                .where('vp.approved', true);
            
            return professors;
        } catch (err) {
            console.error("Erro ao buscar professores por curso:", err);
            return []; // Retorna um array vazio em caso de erro
        }
    }
}

module.exports = new Course()
