const MaterialFieldValidator = require("../utils/materialValidator")
const Material = require("../models/Material")
const path = require("path")
const fs = require("fs")


class MaterialController {
    async register(request, response) {
        try {
            const {title, description, type, created_by, subject_id} = request.body
            const error = MaterialFieldValidator.validate({ title, description, type, created_by, subject_id })
            if (error) return response.status(422).json({ status: false, message: error })

            if (!request.file) {
                return response.status(400).json({ status: false, message: "O upload de um arquivo é obrigatório." })
            }

            const rootDir = path.join(__dirname, "..", "..")
            const uploadDir = path.join(rootDir, "public", "materials")
            fs.mkdirSync(uploadDir, { recursive: true })


            const uniqueName = Date.now() + "_" + Math.floor(Math.random() * 100) + path.extname(request.file.originalname)
            const finalPath = path.join(uploadDir, uniqueName)
            const archivePath = path.join("materials", uniqueName)

            fs.writeFileSync(finalPath, request.file.buffer)

            const data = {
                title, 
                description, 
                type, 
                archive: archivePath, 
                created_by, 
                subject_id
            }
            const valid = await Material.save(data)
            if(!valid) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar material"})
            }
            return response.status(200).json({status: true, message: "Material Cadastrado com sucesso", subject_id})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new MaterialController()
