    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.up = function(knex) {
        // Cria a tabela 'Class_alunos' para ligar os alunos às turmas
        return knex.schema.createTable("class_student", function (table) {
            // Chave estrangeira para a turma
            table.integer('class_id').unsigned().notNullable();
            table.foreign('class_id')
                .references('id')
                .inTable('classes')
                .onDelete('CASCADE');

            // Chave estrangeira para o aluno (utilizador)
            table.integer('student_id').unsigned().notNullable();
            table.foreign('student_id')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');

            // Chave primária composta
            table.primary(['class_id', 'student_id']);

            table.timestamps(true, true);
        });
    };

    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.down = function(knex) {
        return knex.schema.dropTable("class_student");
    };
