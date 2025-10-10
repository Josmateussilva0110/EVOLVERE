const MaterialFieldValidator = require("../utils/materialValidator")
const Material = require("../models/Material")


class MaterialController {
    async register(request, response) {
        try {
            const {title, description, type, archive, created_by, subject_id} = request.body
            const error = MaterialFieldValidator.validate({ title, description, type, archive, created_by, subject_id })
            if (error) return response.status(422).json({ status: false, message: error })
            const data = {
                title, 
                description, 
                type, 
                archive, 
                created_by, 
                subject_id
            }
            const valid = await Material.save(data)
            if(!valid) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar material"})
            }
            return response.status(200).json({status: true, message: "Material Cadastrado com sucesso"})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new MaterialController()
