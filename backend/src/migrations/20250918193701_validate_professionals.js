
/**
 * Migration para criar a tabela "validate_professionals".
 * 
 * Estrutura da tabela:
 * - id: inteiro, chave primária auto-incrementada.
 * - professional_id: inteiro, referência ao ID do usuário na tabela "users".
 *   - Chave estrangeira: CASCADE em DELETE e UPDATE.
 * - institution: string, nome da instituição do profissional.
 * - access_code: string, código de acesso fornecido pela instituição.
 * - diploma: string, caminho ou nome do arquivo do diploma.
 * - role: inteiro, define o tipo de função ou cargo do profissional.
 * - approved: boolean, indica se o profissional foi aprovado; padrão false.
 * - created_at / updated_at: timestamps automáticos.
 * 
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>}
 */
const up = function (knex) {
  return knex.schema.createTable("validate_professionals", function (table) {
    table.increments('id')
    table.integer('professional_id').notNullable()
    table.foreign('professional_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('institution', 255).notNullable()
    table.string('access_code', 200).notNullable()
    table.string('diploma', 150).notNullable()
    table.integer('role').notNullable()
    table.boolean('approved').defaultTo(false)
    table.timestamps(true, true)
  })
}


/**
 * Reverte a migration, removendo a tabela "validate_professionals".
 * 
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>}
 */
const down = function (knex) {
  return knex.schema.dropTable("validate_professionals")
}

module.exports = { 
    up, 
    down 
}
