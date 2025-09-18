const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")


// rotas para o usuário
router.post('/login', userController.login)
router.post('/user/register', userController.register)
router.post('/user/logout', userController.logout)
router.get('/user/session', userController.session)
router.get('/user/:id', userController.getUserById)

module.exports = router
