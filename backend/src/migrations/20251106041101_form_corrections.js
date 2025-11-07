const up = function (knex) {
  return knex.schema.createTable("form_corrections", function (table) {
    table.increments('id')
    table.integer('form_id').references('id').inTable('form').onDelete('CASCADE')
    table.integer('student_id').references('id').inTable('users').onDelete('CASCADE')
    table.boolean('corrected').defaultTo(false)
    table.timestamps(true, true)
  })
}


const down = function (knex) {
  return knex.schema.dropTable("form_corrections")
}

module.exports = { 
    up, 
    down 
}