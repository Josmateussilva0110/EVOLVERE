exports.up = function(knex) {
  return knex.schema.createTable("classes_invites", function (table) {
    table.increments('id');
    table.string('code', 10).notNullable().unique();
    
    table.integer('classes_id').unsigned().notNullable();
    table.foreign('classes_id').references('id').inTable('classes').onDelete('CASCADE');

    table.timestamp('expires_at').notNullable();

    // ALTERAÇÃO AQUI:
    // Permite que o valor seja nulo. Usaremos 'null' para representar "sem limite".
    table.integer('max_uses').nullable(); 
    
    table.integer('use_count').defaultTo(0);

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("classes_invites");
};