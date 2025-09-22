const up = function (knex) {
  return knex.schema.createTable("session", function (table) {
    table.string("sid").primary()
    table.json("sess").notNullable()
    table.timestamp("expire", { useTz: false }).notNullable()
  })
  .then(() =>
    knex.schema.raw(
      'CREATE INDEX "IDX_session_expire" ON "session" ("expire")'
    )
  )
}

const down = function (knex) {
  return knex.schema.dropTable("session")
}

module.exports = { 
    up, 
    down 
}
