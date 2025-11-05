const up = function (knex) {
  return knex.schema.createTable("comment_answers", function (table) {
    table.increments('id')
    table.integer('answer_id').notNullable()
    table.foreign('answer_id').references('id').inTable('answers_form').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('teacher_id').notNullable()
    table.foreign('teacher_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
    table.text("comment").nullable()
    table.timestamps(true, true)
  })
}


const down = function (knex) {
  return knex.schema.dropTable("comment_answers")
}

module.exports = { 
    up, 
    down 
}