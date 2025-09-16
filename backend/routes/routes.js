const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")


// rotas para o usuário
router.post('/login', userController.login)

module.exports = router
