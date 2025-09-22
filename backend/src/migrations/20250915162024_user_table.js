
/**
 * Migration para criar a tabela "users".
 * 
 * Estrutura da tabela:
 * - id: inteiro, chave primária auto-incrementada.
 * - username: string, obrigatório, nome do usuário.
 * - email: string, obrigatório, único, email do usuário.
 * - password: string, obrigatório, senha criptografada.
 * - registration: string, opcional, matrícula ou registro do usuário.
 * - photo: string, opcional, caminho da foto do usuário.
 * - status: inteiro, padrão 1, indica se o usuário está ativo.
 * - created_at / updated_at: timestamps automáticos.
 * 
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>}
 */
const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments('id')
    table.string('username', 100).notNullable()
    table.string('email', 100).notNullable().unique()
    table.string('password', 255).notNullable()
    table.string('registration', 255).nullable()
    table.string('photo',200).nullable()
    table.integer('status').defaultTo(1)
    table.timestamps(true, true)
  })
}

/**
 * Reverte a migration, removendo a tabela "users".
 * 
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>}
 */
const down = function (knex) {
  return knex.schema.dropTable("users")
}

module.exports = { 
    up, 
    down 
}
