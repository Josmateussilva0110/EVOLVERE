const User = require("../models/User")
const bcrypt = require("bcrypt")
const UserFieldValidator = require("../utils/userValidator")
require('dotenv').config({ path: '../.env' })

class UserController {

    async login(request, response) {
        try {
            const { email, password } = request.body
            const error = UserFieldValidator.validate({ email, password })
            if (error) return response.status(422).json({ status: false, message: error })

            const user = await User.findByEmail(email)
            if (!user) {
                return response.status(404).json({ status: false, message: "Email não encontrado." })
            }

            const checkPassword = await bcrypt.compare(password, user.password)
            if (!checkPassword) {
                return response.status(422).json({ status: false, message: "Senha incorreta" })
            }

            request.session.user = { id: user.id, name: user.name }
            return response.status(200).json({
                status: true,
                message: "Login realizado com sucesso.",
                user: { id: user.id, name: user.name }
            })
        } catch (err) {
            console.error("Erro no login:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }
}

module.exports = new UserController()

