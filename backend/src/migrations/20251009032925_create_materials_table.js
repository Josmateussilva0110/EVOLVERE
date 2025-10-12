/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("materials", function (table) {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('file_path').notNullable(); // Caminho para o arquivo no servidor/nuvem
        table.string('file_type', 50).notNullable(); // Ex: 'PDF', 'DOCX'
        table.string('size', 20); // Ex: '2.4 MB'

        table.integer('subject_id').unsigned().notNullable();
        table.foreign('subject_id')
             .references('id')
             .inTable('subjects')
             .onDelete('CASCADE'); // Se a disciplina for apagada, seus materiais também serão.

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("materials");
};