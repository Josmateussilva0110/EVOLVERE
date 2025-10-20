/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // Altera a tabela 'validate_professionals'
  return knex.schema.alterTable('validate_professionals', function(table) {
    // Modifica a coluna 'diploma' para permitir valores nulos.
    // O método .nullable() define que a coluna pode ser NULL.
    // O .alter() aplica a mudança à coluna existente.
    table.string('diploma').nullable().alter(); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // Reverte a alteração: torna a coluna 'diploma' obrigatória novamente.
  return knex.schema.alterTable('validate_professionals', function(table) {
    // Define a coluna como NOT NULL.
    table.string('diploma').notNullable().alter();
  });
};