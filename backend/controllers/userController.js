const User = require("../models/User")
const Account = require("../models/Account")
const bcrypt = require("bcrypt")
const UserFieldValidator = require("../utils/userValidator")
require('dotenv').config({ path: '../.env' })
const path = require("path")
const validator = require('validator')

class UserController {

    async register(request, response) {
        try {
            const {username, email, password, confirm_password} = request.body
            const error = UserFieldValidator.validate({username, email, password, confirm_password})
            if (error) return response.status(422).json({ status: false, message: error })

            const emailExist = await User.emailExists(email)
            if(emailExist) {
                return response.status(422).json({status: false, message: "Email já existe."})
            }

            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)
            const data = {}
            data.username = username
            data.email = email
            data.password = passwordHash
            data.role = 4
            data.status = 2

            const valid = await User.save(data)
            if(!valid) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar usuário."})
            }
            const user = await User.findByEmail(email)
            if(!user) {
                return response.status(400).json({status: false, message: "Erro ao criar token para usuário."})
            }
            
            request.session.user = { id: user.id, name: user.username }
            return response.status(200).json({status: true, message: "Dados salvo com sucesso.", user: { id: user.id, name: user.username }})

        } catch(err) {
            console.error("Erro no cadastro de usuários:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

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

    async logout(request, response) {
        request.session.destroy(err => {
            if (err) {
                return response.status(500).json({ success: false, message: "Erro ao sair" })
            }
            response.clearCookie('connect.sid')
            return response.status(200).json({ success: true, message: "Logout feito com sucesso" })
        })
    }

    async addRole(request, response) {
        try {
            const { id, institution, access_code, role } = request.body
            let diplomaPath = null

            if (request.file) {
                diplomaPath = path.join('diplomas', request.file.filename)
            }

            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Usuário invalido."})
            }

            if (!validator.isInt(access_code + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Código de acesso invalido."})
            }

            if (validator.isEmpty(institution || '') || !validator.isLength(institution, { min: 3, max: 50 })) {
                return response.status(422).json({status: false, message: "Nome de instituição invalido."})
            }

            const accountExists = await Account.accountExists(id)
            if(accountExists) {
                return response.status(422).json({status: false, message: "Usuário já tem conta."})
            }
 
            const data = {
                professional_id: id,
                institution,
                access_code,
                diploma: diplomaPath, 
                role
            }

            const valid = await Account.save(data)
            if(!valid) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar usuário."})
            }
            return response.status(200).json({status: true, message: "Conta cadastrada com sucesso."})
        } catch(err) {
            console.error("Erro em addRole:", err)
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new UserController()

