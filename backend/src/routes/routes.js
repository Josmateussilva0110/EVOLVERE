const express = require("express")
const router = express.Router()

const userRoutes = require("./userRoutes")
const accountRoutes = require("./accountRoutes")
const courseRoutes = require("./courseRoutes")
const subjectRoutes = require("./subjectRoutes")

// Usar rotas
router.use(userRoutes)
router.use(accountRoutes)
router.use(courseRoutes)
router.use(subjectRoutes)

module.exports = router
