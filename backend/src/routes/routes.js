const express = require("express")
const router = express.Router()

/**
 * Arquivo principal de rotas da aplicação.
...
 */
const userRoutes = require("./userRoutes")
const accountRoutes = require("./accountRoutes")
const courseRoutes = require("./courseRoutes")
const subjectRoutes = require("./subjectRoutes")
const materialRoutes = require("./materialsRoutes")
const classRoutes = require("./classRoutes")
const formRoutes = require("./formRoutes")
const enrollmentRoutes = require("./enrollmentRoutes")
const dashboardRoutes = require("./dashboardRoutes") 

//Usar a rota
router.use(dashboardRoutes)
router.use(userRoutes)
router.use(accountRoutes)
router.use(courseRoutes)
router.use(subjectRoutes)
router.use(materialRoutes)
router.use(classRoutes)
router.use(formRoutes)
router.use(enrollmentRoutes)




module.exports = router