require('dotenv').config({ path: '../.env' })

/**
 * Instância do Knex configurada para PostgreSQL.
 * 
 * Esta configuração usa variáveis de ambiente definidas no arquivo `.env`:
 * - `HOST` - endereço do servidor PostgreSQL
 * - `USER` - usuário do banco
 * - `PASSWORD` - senha do banco
 * - `DATABASE` - nome do banco de dados
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
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
})

module.exports = knex
