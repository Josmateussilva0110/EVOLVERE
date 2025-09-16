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

            request.session.user = { id: user.id, name: user.username }
            return response.status(200).json({
                status: true,
                message: "Login realizado com sucesso.",
                user: { id: user.id, name: user.username }
            })
        } catch (err) {
            console.error("Erro no login:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async getUserById(request, response) {
        try {
            const {id} = request.params
            const error = UserFieldValidator.validate({id})

            if (error) {
                return response.status(422).json({ status: false, message: error })
            }

            const user = await User.findById(id)
            if(!user) {
                return response.status(404).json({ status: false, message: "Usuário não encontrado." })
            }
            return response.status(200).json({status: true, user})

        } catch (err) {
            console.error("Erro em getUserById:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async session(request, response) {
        if (request.session && request.session.user) {
            return response.status(200).json({ success: true, user: request.session.user })
        } else {
            return response.status(401).json({ success: false, message: "Usuário não autenticado" })
        }
    }
}

module.exports = new UserController()

