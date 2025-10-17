const knex = require("../database/connection")

class Option {

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
