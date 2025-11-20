require("dotenv").config()

/**
 * Instância do Knex configurada para PostgreSQL.
 * 
 * Esta configuração usa variáveis de ambiente definidas no arquivo `.env`:
 * - `DB_HOST` - endereço do servidor PostgreSQL
 * - `DB_USER` - usuário do banco
 * - `DB_PASSWORD` - senha do banco
 * - `DB_DATABASE` - nome do banco de dados
 * 
 * @module knex
 * @type {import('knex').Knex}
 * 
 * @example
 * const knex = require('./connection')
 * 
 * // Exemplo de uso: buscar todos os usuários
 * const users = await knex.select('*').from('users')
 * console.log(users)
 */
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
})

module.exports = knex
