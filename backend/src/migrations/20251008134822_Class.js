/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // Cria a tabela 'turmas' para armazenar as turmas de cada disciplina
    return knex.schema.createTable("classes", function (table) {
        // ID único para cada turma (Chave Primária)
        table.increments('id');

        // Nome da turma (ex: "A", "B", "Manhã", "Tarde")
        table.string('name', 100).notNullable();
        
        // Período da turma (ex: "2025.1", "2025.2")
        table.string('period', 20).notNullable();

        table.integer('capacity').unsigned().notNullable(); // Capacidade máxima de alunos

        // Chave estrangeira para ligar a turma a uma disciplina específica
        table.integer('subject_id').unsigned().notNullable();
        table.foreign('subject_id')
             .references('id')
             .inTable('subjects')
             .onDelete('CASCADE'); // Se uma disciplina for apagada, as suas turmas também serão.

        table.integer('course_id').unsigned().notNullable();
        table.foreign('course_id')
             .references('id')
             .inTable('course_valid')
             .onDelete('CASCADE'); // Se um curso for apagado, as suas turmas também serão.

        // Campos automáticos de data de criação e atualização
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    // Remove a tabela 'turmas' se a migração precisar de ser revertida
    return knex.schema.dropTable("classes");
};