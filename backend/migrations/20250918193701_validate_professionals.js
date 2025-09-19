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

const down = function (knex) {
  return knex.schema.dropTable("validate_professionals")
}

module.exports = { 
    up, 
    down 
}
