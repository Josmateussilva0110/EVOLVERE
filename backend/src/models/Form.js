const knex = require("../database/connection")

class Form {

    async formExists(title, class_id) {
        try {
            const result = await knex("form")
            .select("id")
            .where({ title, class_id })
            .first()

            return !!result 
        } catch (err) {
            console.error("Erro ao verificar título:", err)
            return false
        }
    }

    async save(data) {
        try {
            const [result] = await knex("form")
            .insert(data)
            .returning("id") 
            return { success: true, insertId: result.id }
        } catch (err) {
            console.error("Erro ao cadastrar formulário:", err)
            return { success: false }
        }
    }



    
}

module.exports = new Form()
