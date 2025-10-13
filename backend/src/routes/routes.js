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
<<<<<<< HEAD
const materialRoutes = require("./materialsRoutes")
const classRoutes = require("./classRoutes")

=======
const classRoutes = require("./classRoutes") 
>>>>>>> b2415bd1aabded10d1c6c0a52a30697f5237cbe3

//Usar a rota
router.use(userRoutes)
router.use(accountRoutes)
router.use(courseRoutes)
<<<<<<< HEAD
router.use(subjectRoutes)
router.use(materialRoutes)
router.use(classRoutes)

=======
router.use(subjectRoutes) 
router.use(classRoutes)   
>>>>>>> b2415bd1aabded10d1c6c0a52a30697f5237cbe3

module.exports = router
