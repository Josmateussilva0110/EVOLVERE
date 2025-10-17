const knex = require("../database/connection")

class Question {

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
