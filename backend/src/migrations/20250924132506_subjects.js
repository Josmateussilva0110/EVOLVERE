/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('subjects', (table) => {
    table.increments('id').primary();       // ID autoincrement
    table.string('name').notNullable();     // Nome da matéria
    table.text('description');              // Descrição opcional
    table.timestamps(true, true);           // created_at e updated_at automáticos
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('subjects');
};
