const MaterialFieldValidator = require("../utils/materialValidator")
const Material = require("../models/Material")
const path = require("path")
const fs = require("fs")
const validator = require('validator');



class MaterialController {
    async register(request, response) {
        try {
            const {title, description, type, created_by, subject_id, class_id} = request.body
            console.log(title)
            console.log(description)
            console.log(type)
            console.log(created_by)
            console.log(subject_id)
            console.log(class_id)

            const error = MaterialFieldValidator.validate({ title, description, type, created_by, subject_id })
            if (error) return response.status(422).json({ status: false, message: error })
            
            if(class_id) {
                if (!validator.isInt(class_id + '', { min: 1 })) {
                    return res.status(422).json({ success: false, message: "ID da turma invalido." });
                }
            }

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
            if(class_id) {
                data.class_id = class_id
                data.origin = 2
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

    async delete(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return res.status(422).json({ success: false, message: "ID inválido." });
            }
            const materialExist = await Material.materialExist(id)
            if(!materialExist) {
                return response.status(404).json({ status: false, message: "Material não encontrado." })
            }
            const valid = await Material.deleteById(id) 
            if(!valid) {
                return response.status(500).json({ status: false, message: "Erro ao deletar material." })
            }
            return response.status(200).json({ status: true, message: "Material deletado com sucesso." })
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new MaterialController()
