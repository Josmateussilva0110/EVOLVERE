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
            await knex("form").insert(data)
            return true
        } catch(err) {
            console.error('Erro ao cadastrar formulário:', err)
            return false
        }
    }

    
}

module.exports = new Form()
