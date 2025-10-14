const express = require("express")
const router = express.Router()


/**
 * Arquivo principal de rotas da aplicação.
 * 
 * Este arquivo importa e utiliza os módulos de rotas específicos para cada recurso:
 *  - userRoutes: rotas relacionadas a usuários
 *  - accountRoutes: rotas relacionadas a contas
 *  - courseRoutes: rotas relacionadas a cursos
 *  - subjectRoutes: rotas relacionadas a disciplinas
 * 
 * @module routes
 * 
 * @example
 * const express = require("express");
 * const app = express();
 * const routes = require("./routes");
 * 
 * app.use("/api", routes);
 */
const userRoutes = require("./userRoutes")
const accountRoutes = require("./accountRoutes")
const courseRoutes = require("./courseRoutes")
const subjectRoutes = require("./subjectRoutes")
const materialRoutes = require("./materialsRoutes")
const classRoutes = require("./classRoutes")


//Usar a rota
router.use(userRoutes)
router.use(accountRoutes)
router.use(courseRoutes)
router.use(subjectRoutes)
router.use(materialRoutes)
router.use(classRoutes)


module.exports = router
