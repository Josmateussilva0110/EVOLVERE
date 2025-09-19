const express = require("express")
const pdfUpload = require("../middleware/Archive")
const router = express.Router()
const userController = require("../controllers/userController")


// rotas para o usuário
router.post('/login', userController.login)
router.post('/user/register', userController.register)
router.post('/user/logout', userController.logout)
router.get('/user/session', userController.session)
router.get('/user/:id', userController.getUserById)
router.post(
  "/user/account",
  (request, response, next) => {
    pdfUpload.single("diploma")(request, response, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return response.status(400).json({ status: false, message: "O arquivo excede 5 MB." })
        }
        return response.status(400).json({ status: false, message: err.message })
      }
      next()
    })
  },
  userController.addRole
)


module.exports = router
