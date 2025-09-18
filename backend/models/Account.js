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
}

module.exports = new Account()

