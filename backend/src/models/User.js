const knex = require("../database/connection")

class User {

    async save(data) {
        try {
            await knex("users").insert(data)
            return true
        } catch(err) {
            console.log('erro ao cadastrar usuário', err)
            return false
        }
    }

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

    async registrationExists(code) {
        try {
            const result = await knex.select(["registration"]).where({registration: code}).table("users")
            if(result.length > 0) {
                return true
            }
            else {
                return false
            }
        } catch(err) {
            console.log('erro ao verificar matricula: ', err)
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

    async findById(id) {
        try {
            const result = await knex.select(["id", "username", "email", "registration", "photo", "created_at", "updated_at"]).where({id}).table("users")
            if(result.length > 0) {
                return result[0]
            }
            else {
                return undefined
            }
        } catch(err) {
            console.log('erro ao buscar usuário por id: ', err)
            return undefined
        }
    }
}

module.exports = new User()

