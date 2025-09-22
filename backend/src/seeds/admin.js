const bcrypt = require("bcrypt")

/**
 * Seed de usuários administrativos iniciais.
 * 
 * Esta seed insere usuários padrão na tabela `users`, com senhas
 * criptografadas usando bcrypt. Caso um usuário com o mesmo email
 * já exista, ele será ignorado.
 * 
 * @async
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>} Retorna uma promise resolvida quando a seed termina de inserir os usuários.
 * 
 * @example
 * // Executar a seed
 * npx knex seed:run --specific=admin_users.js
 */
exports.seed = async function (knex) {
  const users = [
    {
      username: "Mateus",
      email: "mateus@evolvere.com",
      password: await bcrypt.hash("admin123", 10),
      registration: 'admin',
      status: 1
    },
    {
      username: "Rai",
      email: "rai@evolvere.com",
      password: await bcrypt.hash("admin123", 10),
      registration: 'admin',
      status: 1
    },
    {
      username: "Lucas",
      email: "lucas@evolvere.com",
      password: await bcrypt.hash("admin123", 10),
      registration: 'admin',
      status: 1
    },
    {
      username: "Gabriel",
      email: "gabriel@evolvere.com",
      password: await bcrypt.hash("admin123", 10),
      registration: 'admin',
      status: 1
    }
  ]

  // Insere os usuários na tabela "users"
  // Se já existir um usuário com o mesmo email, ignora a inserção
  await knex("users")
    .insert(users)
    .onConflict("email")
    .ignore()
}
