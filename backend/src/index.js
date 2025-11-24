const express = require("express")
const cors = require("cors")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const { Pool } = require("pg")
const path = require("path")
require("dotenv").config()
const downloadRoute = require("../src/routes/downloadRoute")

const router = require("./routes/routes")

const app = express()

const pgPool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false }
})

app.use(express.json())


app.use(cors({
  origin: "https://evolvere-frontend.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

// Forçar credenciais
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true")
  next()
})



// ----------------------
// Sessões
// ----------------------
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "session",
      ttl: 7200,
      pruneSessionInterval: 60,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      secure: true,                
      httpOnly: true,
      sameSite: "none",         
    },
  })
)

// Arquivos estáticos
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")))
app.use("/diplomas", express.static(path.join(__dirname, "..", "public", "diplomas")))

app.use("/", downloadRoute)
app.use("/", router)

app.listen(8080, () => console.log("Servidor rodando 🚀"))
