const up = function (knex) {
    return knex.schema.alterTable('answers_form', function(table) {
    table.boolean("corrected").defaultTo(false)
  })
}


const down = function (knex) {
  return knex.schema.alterTable("answers_form", function (table) {
    table.dropColumn("corrected")
  });
}

module.exports = { 
    up, 
    down 
}