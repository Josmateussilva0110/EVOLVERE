const knex = require("../database/connection")

class User {
    async emailExists(email) {
        try {
            const result = await knex.select(["email"]).where({email}).table("users")
            if(result.length > 0) {
                return true
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao verificar email: ', err)
            return false
        }
    }

    async findByEmail(email) {
        try {
            const result = await knex.select("*").where({email}).table("users")
            if(result.length > 0) {
                return result[0]
            }
            else {
                return undefined
            }
        } catch(err) {
            console.log('erro ao buscar usuário por email: ', err)
            return undefined
        }
    }
}

module.exports = new User()

