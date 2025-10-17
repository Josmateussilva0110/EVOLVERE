
const up = function(knex) {
  return knex.schema.createTable('questions', function(table) {
    table.increments('id')
    table.integer('form_id').notNullable()
    table.foreign('form_id').references('id').inTable('form').onDelete('CASCADE')
    table.text('text').notNullable()
    table.decimal('points', 5, 2).defaultTo(0)
    table.enu('type', ['multipla_escolha', 'verdadeiro/falso', 'aberta']).notNullable()
  })
}

const down = function(knex) {
  return knex.schema.dropTable('questions')
}

module.exports = { 
    up, 
    down 
}

