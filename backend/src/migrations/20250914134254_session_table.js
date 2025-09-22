/**
 * Migration para criar a tabela "session" usada pelo connect-pg-simple.
 * 
 * Estrutura da tabela:
 * - sid: string, chave primária, identifica a sessão.
 * - sess: JSON, dados da sessão.
 * - expire: timestamp, data de expiração da sessão.
 * 
 * Também cria um índice na coluna "expire" para otimizar consultas de expiração.
 * 
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>}
 */
const up = function (knex) {
  return knex.schema.createTable("session", function (table) {
    table.string("sid").primary()
    table.json("sess").notNullable()
    table.timestamp("expire", { useTz: false }).notNullable()
  })
  .then(() =>
    knex.schema.raw(
      'CREATE INDEX "IDX_session_expire" ON "session" ("expire")'
    )
  )
}

/**
 * Reverte a migration, removendo a tabela "session".
 * 
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>}
 */
const down = function (knex) {
  return knex.schema.dropTable("session")
}

module.exports = { 
    up, 
    down 
}
