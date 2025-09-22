const knex = require("../database/connection")

class Course {
    async getAll() {
        try {
            const result = await knex.select("*").table("course_valid")
            if(result.length > 0) {
                return result
            } else {
                return undefined
            }
        } catch(err) {
            console.log('erro em get cursos: ', err)
            return undefined
        }
    }

    async getCourseByCode(code) {
        try {
            const result = await knex.select("*").where({course_code: code}).table("course_valid")
            if(result.length > 0) {
                return result[0]
            }
            else {
                return undefined
            }
        } catch(err) {
            console.log('erro em buscar curso por código: ', err)
            return undefined
        }
    }
}

module.exports = new Course()

