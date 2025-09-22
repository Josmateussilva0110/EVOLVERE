/**
 * Migration para criar a tabela "course_valid".
 * 
 * Estrutura da tabela:
 * - id: inteiro, chave primária auto-incrementada.
 * - code_IES: inteiro, código da instituição de ensino superior.
 * - acronym_IES: string, sigla da instituição.
 * - name_IES: string, nome da instituição.
 * - situation: string, situação do curso (ex.: ativo, inativo).
 * - course_code: inteiro, código do curso, único.
 * - name: string, nome do curso.
 * - degree: string, grau do curso (ex.: bacharelado, licenciatura).
 * - city: string, cidade da instituição.
 * - UF: string, unidade federativa (estado) da instituição.
 * 
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>}
 */
const up = function (knex) {
  return knex.schema.createTable("course_valid", function (table) {
    table.increments('id')
    table.integer('code_IES').notNullable()
    table.string('acronym_IES', 200).notNullable()
    table.string('name_IES', 255).notNullable()
    table.string('situation', 100).notNullable()
    table.integer('course_code').notNullable().unique()
    table.string('name',200).notNullable()
    table.string('degree', 100).notNullable()
    table.string('city', 150).notNullable()
    table.string('UF', 3).notNullable()
  })
}


/**
 * Reverte a migration, removendo a tabela "course_valid".
 * 
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>}
 */
const down = function (knex) {
  return knex.schema.dropTable("course_valid")
}

module.exports = { 
    up, 
    down 
}
