const express = require("express")
const cors = require("cors")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const { Pool } = require("pg")
const path = require("path")
require('dotenv').config({ path: '../.env' })
const downloadRoute = require("../src/routes/downloadRoute")

const router = require("./routes/routes")

/**
 * Servidor principal da API Evolvere.
 * Configura middlewares, rotas e sessões com PostgreSQL.
 * 
 * Middlewares configurados:
 * - `express.json()` para parse de JSON
 * - `cors` para comunicação entre frontend e backend
 * - `express.static` para servir arquivos públicos (imagens e diplomas)
 * - `express-session` com `connect-pg-simple` para sessões persistidas no PostgreSQL
 * 
 * @module server
 */
const app = express()

/**
 * Pool de conexão com PostgreSQL.
 * Usado pelo `connect-pg-simple` para armazenar sessões.
 * @type {import('pg').Pool}
 */
const pgPool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
})

// Middlewares
app.use(express.json())

// Servir arquivos estáticos
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")))
app.use("/diplomas", express.static(path.join(__dirname, "..", "public", "diplomas")))

// CORS
app.use(
  cors({
    origin: "http://localhost:5173", // front-end local
    credentials: true, 
  })
)

// Configuração de sessões
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "session",
      ttl: 7200, // 2 horas em segundos
      pruneSessionInterval: 60, 
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 horas em ms
      secure: false, // true se usar https
      httpOnly: true,
      sameSite: "lax",
    },
  })
)


app.use("/", downloadRoute)
// Rotas da API
app.use("/", router)

/**
 * Inicializa o servidor na porta 8080
 */
app.listen(8080, () => console.log("Servidor rodando 🚀"))
