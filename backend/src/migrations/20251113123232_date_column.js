const up = function (knex) {
    return knex.schema.alterTable('classes', function(table) {
    table.datetime('expired').nullable()
  })
}


const down = function (knex) {
  return knex.schema.alterTable("classes", function (table) {
    table.dropColumn("expired")
  });
}

module.exports = { 
    up, 
    down 
}