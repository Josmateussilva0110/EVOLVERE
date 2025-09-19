const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments('id')
    table.string('username', 100).notNullable()
    table.string('email', 100).notNullable().unique()
    table.string('password', 255).notNullable()
    table.string('registration', 255).nullable()
    table.string('photo',200).nullable()
    table.integer('status').defaultTo(1)
    table.timestamps(true, true)
  })
}

const down = function (knex) {
  return knex.schema.dropTable("users")
}

module.exports = { 
    up, 
    down 
}
