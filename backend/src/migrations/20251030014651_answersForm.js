const up = function (knex) {
  return knex.schema.createTable("answers_form", function (table) {
    table.increments('id')
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('form_id').notNullable()
    table.foreign('form_id').references('id').inTable('form').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('question_id').notNullable()
    table.foreign('question_id').references('id').inTable('questions').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('option_id').notNullable()
    table.foreign('option_id').references('id').inTable('options').onDelete('CASCADE').onUpdate('CASCADE')
    table.timestamps(true, true)
  })
}


const down = function (knex) {
  return knex.schema.dropTable("answers_form")
}

module.exports = { 
    up, 
    down 
}