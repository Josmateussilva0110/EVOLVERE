const User = require("../models/User")
const Account = require("../models/Account")
const bcrypt = require("bcrypt")
const UserFieldValidator = require("../utils/userValidator")
require('dotenv').config({ path: '../.env' })
const path = require("path")
const fs = require("fs")
const validator = require('validator')
const { customAlphabet } = require('nanoid')

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

            const code = customAlphabet('0123456789', 8);

            let registration
            let isUnique = false

            while (!isUnique) {
                const newCode = code()
                const exists = await User.registrationExists(newCode)
                if (!exists) {
                    registration = newCode
                    isUnique = true
                }
            }

            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)
            const data = {
                username: username,
                email: email,
                password: passwordHash,
                registration: registration,
            }

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

            if (!request.file) {
                return response.status(400).json({ status: false, message: "O upload de um PDF é obrigatório" })
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

            const uploadDir = path.join(__dirname, "..", "public", "diplomas")
            fs.mkdirSync(uploadDir, { recursive: true })
            const uniqueName = Date.now() + "_" + Math.floor(Math.random() * 100) + path.extname(request.file.originalname)
            const finalPath = path.join(uploadDir, uniqueName)

            // monta o caminho relativo para salvar no banco
            diplomaPath = path.join("diplomas", uniqueName)
 
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
            fs.writeFileSync(finalPath, request.file.buffer)
            return response.status(200).json({status: true, message: "Conta cadastrada com sucesso."})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new UserController()

