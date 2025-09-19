const knex = require("../database/connection")

class Account {
    async save(data) {
        try {
            await knex("validate_professionals").insert(data)
            return true
        } catch(err) {
            console.log('erro ao cadastrar conta de usuário', err)
            return false
        }
    }

    async accountExists(id) {
        try {
            const result = await knex.select(["professional_id"]).where({professional_id: id}).table("validate_professionals")
            if(result.length > 0) {
                return true
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao buscar conta', err)
            return false
        }
    }
}

module.exports = new Account()

