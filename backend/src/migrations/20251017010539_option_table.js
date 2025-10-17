const up = function(knex) {
  return knex.schema.createTable('options', function(table) {
    table.increments('id')
    table.integer('question_id').notNullable()
    table.foreign('question_id').references('id').inTable('questions').onDelete('CASCADE')
    table.string('text', 255).notNullable()
    table.boolean('correct').defaultTo(false)
  })
}

const down = function(knex) {
  return knex.schema.dropTable('options')
}

module.exports = { 
    up, 
    down 
}
