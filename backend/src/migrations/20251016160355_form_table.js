const up = function (knex) {
  return knex.schema.createTable("form", function (table) {
    table.increments('id')
    table.string('title', 150).notNullable()
    table.string('description', 255).nullable()
    table.integer('created_by').notNullable()
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('subject_id').notNullable()
    table.foreign('subject_id').references('id').inTable('subjects').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('class_id').notNullable()
    table.foreign('class_id').references('id').inTable('classes').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('totalDuration').notNullable().defaultTo(0)
    table.datetime('deadline').notNullable()
    table.integer('status').defaultTo(1)
    table.timestamps(true, true)
  })
}


const down = function (knex) {
  return knex.schema.dropTable("form")
}

module.exports = { 
    up, 
    down 
}
