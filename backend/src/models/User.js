const knex = require("../database/connection")

/**
 * Modelo de Usuário.
 * Responsável por interagir com a tabela `users` no banco de dados.
 * Fornece métodos para salvar, buscar e validar usuários.
 * @class
 */
class User {

    /**
     * Salva um novo usuário no banco de dados.
     *
     * @async
     * @param {Object} data - Dados do usuário a serem salvos.
     * @param {string} data.username - Nome do usuário.
     * @param {string} data.email - Email do usuário.
     * @param {string} data.password - Hash da senha.
     * @param {string} data.registration - Matrícula única do usuário.
     * @returns {Promise<boolean>} Retorna `true` se salvo com sucesso, senão `false`.
     *
     * @example
     * const success = await User.save({
     *   username: "mateus",
     *   email: "mateus@email.com",
     *   password: "<hash>",
     *   registration: "12345678"
     * })
     */
    async save(data) {
        try {
            await knex("users").insert(data)
            return true
        } catch(err) {
            console.error('Erro ao cadastrar usuário:', err)
            return false
        }
    }

    /**
     * Verifica se um email já está cadastrado.
     *
     * @async
     * @param {string} email - Email a ser verificado.
     * @returns {Promise<boolean>} Retorna `true` se já existir, senão `false`.
     *
     * @example
     * const exists = await User.emailExists("mateus@email.com")
     * // exists === true ou false
     */
    async emailExists(email) {
        try {
            const result = await knex.select(["email"]).where({email}).table("users")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar email:', err)
            return false
        }
    }

    /**
     * Verifica se uma matrícula (registration) já existe.
     *
     * @async
     * @param {string} code - Código de matrícula.
     * @returns {Promise<boolean>} Retorna `true` se já existir, senão `false`.
     *
     * @example
     * const exists = await User.registrationExists("12345678")
     * // exists === true ou false
     */
    async registrationExists(code) {
        try {
            const result = await knex.select(["registration"]).where({registration: code}).table("users")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar matrícula:', err)
            return false
        }
    }

    /**
     * Busca um usuário pelo email.
     *
     * @async
     * @param {string} email - Email do usuário.
     * @returns {Promise<Object|undefined>} Retorna o usuário encontrado ou `undefined` se não existir.
     *
     * @example
     * const user = await User.findByEmail("mateus@email.com")
     * // user = { id, username, email, registration, password, ... } ou undefined
     */
    async findByEmail(email) {
        try {
            const result = await knex.select("*").where({email}).table("users")
            return result[0] || undefined
        } catch(err) {
            console.error('Erro ao buscar usuário por email:', err)
            return undefined
        }
    }

    /**
     * Busca um usuário pelo ID.
     *
     * @async
     * @param {number} id - ID do usuário.
     * @returns {Promise<Object|undefined>} Retorna o usuário encontrado ou `undefined` se não existir.
     *
     * @example
     * const user = await User.findById(1)
     * // user = { id, username, email, registration, photo, created_at, updated_at } ou undefined
     */
    async findById(id) {
        try {
            const result = await knex
                .select(["id", "username", "email", "registration", "photo", "created_at", "updated_at"])
                .where({id})
                .table("users")
            return result[0] || undefined
        } catch(err) {
            console.error('Erro ao buscar usuário por id:', err)
            return undefined
        }
    }
}

module.exports = new User()
