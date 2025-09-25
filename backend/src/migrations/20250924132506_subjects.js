/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('subjects', (table) => {
    table.increments('id').primary();       
    table.string('name').notNullable();     

    table.integer('professional_id').unsigned().notNullable();
    table.foreign('professional_id')
         .references('id')
         .inTable('users')
         .onDelete('CASCADE')
         .onUpdate('CASCADE');

    table.integer('course_valid_id').unsigned().notNullable();
    table.foreign('course_valid_id')
         .references('id')
         .inTable('course_valid')
         .onDelete('CASCADE')
         .onUpdate('CASCADE');

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