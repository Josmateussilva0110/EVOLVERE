const validator = require('validator')
const Subject = require("../models/Subject")

class TeacherController {
    async getAllSubjects(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Id inválido."})
            }
            const subjects = await Subject.getByProfessor(id)
            if(!subjects) {
                return response.status(404).json({status: false, message: "Nenhuma disciplina encontrada."})
            }
            return response.status(200).json({status: true, subjects})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }
}

module.exports = new TeacherController()
