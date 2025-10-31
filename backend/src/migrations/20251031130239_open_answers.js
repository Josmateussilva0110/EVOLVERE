const up = function (knex) {
    return knex.schema.alterTable('answers_form', function(table) {
    table.text("open_answer").nullable().after("option_id")
  })
}


const down = function (knex) {
  return knex.schema.alterTable("answers_form", function (table) {
    table.dropColumn("open_answer")
  });
}

module.exports = { 
    up, 
    down 
}
