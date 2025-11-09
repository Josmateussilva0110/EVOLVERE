const up = function (knex) {
  return knex.schema.createTable("results_form", function (table) {
    table.increments('id')
    table.integer('form_id').references('id').inTable('form').onDelete('CASCADE')
    table.integer('student_id').references('id').inTable('users').onDelete('CASCADE')
    table.decimal('points', 5, 2).defaultTo(0)
    table.integer('correct').defaultTo(0)
    table.integer('wrong').defaultTo(0)
    table.timestamps(true, true)
  })
}


const down = function (knex) {
  return knex.schema.dropTable("results_form")
}

module.exports = { 
    up, 
    down 
}