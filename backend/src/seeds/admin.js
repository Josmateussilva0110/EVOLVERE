const bcrypt = require("bcrypt")

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

  await knex("users")
    .insert(users)
    .onConflict("email") 
    .ignore() // se já existir, não insere
}
