const up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id')
    table.string('name', 150).notNullable()
    table.string('email', 150).notNullable()
    table.string('password',200).notNullable()
    table.string('photo',200).nullable()
    table.integer('status').defaultTo(1) // 1 = ativo 2 = cancelado 3 = arquivado 4 = concluído
    table.timestamps(true, true) // created_at e updated_at automáticos
  })
};


const down = function(knex) {
  return knex.schema.dropTable('users')
};

module.exports = {
  up,
  down
}
