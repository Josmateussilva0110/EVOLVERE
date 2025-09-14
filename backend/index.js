const express = require("express")
const cors = require("cors")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const { Pool } = require("pg")
require('dotenv').config({ path: '../.env' })

const router = require("./routes/routes")

const app = express()

// Pool do Postgres
const pgPool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
})

app.use(express.json())
app.use("/images", express.static("public/images"))

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
)


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
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 horas em ms
      secure: false, // true se usar https
      httpOnly: true,
      sameSite: "lax",
    },
  })
)


/*//debug teste 
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "session",
      ttl: 40,
      pruneSessionInterval: 40, 
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 40, // 50 segundos
      secure: false, // true se usar https
      httpOnly: true,
      sameSite: "lax",
    },
  })
)*/


app.use("/", router)

app.listen(8080, () => console.log("Servidor rodando 🚀"))
