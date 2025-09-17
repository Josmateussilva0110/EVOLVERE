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

const down = function (knex) {
  return knex.schema.dropTable("course_valid")
}

module.exports = { 
    up, 
    down 
}
