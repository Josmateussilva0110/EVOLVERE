    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.up = function(knex) {
        // Cria a tabela 'Class_alunos' para ligar os alunos às turmas
        return knex.schema.createTable("classes_alunos", function (table) {
            // Chave estrangeira para a turma
            table.integer('classes_id').unsigned().notNullable();
            table.foreign('classes_id')
                .references('id')
                .inTable('classes')
                .onDelete('CASCADE');

            // Chave estrangeira para o aluno (utilizador)
            table.integer('aluno_id').unsigned().notNullable();
            table.foreign('aluno_id')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');

            // Chave primária composta
            table.primary(['classes_id', 'aluno_id']);

            table.timestamps(true, true);
        });
    };

    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.down = function(knex) {
        return knex.schema.dropTable("classes_alunos");
    };
