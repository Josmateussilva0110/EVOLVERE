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

    async deleteById(id) {
        try {
            const deleted = await knex('materials').where({ id }).delete();
            return deleted > 0;
        } catch (err) {
            console.error("Erro ao deletar material:", err);
            return false;
        }
    }

    async materialExist(id) {
        try {
            const result = await knex.select("*").where({id}).table("materials")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar material:', err)
            return false
        }
    }
    
}

module.exports = new Material()
