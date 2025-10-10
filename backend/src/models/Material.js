const knex = require("../database/connection")


class Material {
    async save(data) {
        try {
            await knex("materials").insert(data)
            return true
        } catch(err) {
            console.error('Erro ao cadastrar material:', err)
            return false
        }
    }
    
}

module.exports = new Material()
