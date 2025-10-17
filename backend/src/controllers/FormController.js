const MaterialFieldValidator = require("../utils/materialValidator")
const Form = require("../models/Form")
const Subject = require("../models/Subject")
const Class = require("../models/Class")
const validator = require('validator')

class FormController {
    async publish(request, response) {
        try {
            const {title, description, created_by, subject_id, class_id, questions} = request.body
            const error = MaterialFieldValidator.validate({ title, description, created_by, subject_id, class_id})
            if (error) return response.status(422).json({ status: false, message: error })

            const formExist = await Form.formExists(title, class_id)
            if(formExist) {
                return response.status(422).json({ status: false, message: "Titulo de formulário já existe." })
            }

            const data = {
                title, 
                description, 
                created_by, 
                subject_id,
                class_id
            }

            const savedForm = await Form.save(data)
            if(!savedForm.success) {
                return response.status(500).json({ status: false, message: "Erro ao cadastrar formulário." })
            }

            const formId = savedForm.insertId

            for (const q of questions) {
                const questionData = { form_id: formId, text: q.text, points: q.points, type: q.type }
                const savedQuestion = await Form.saveQuestion(questionData)
                const questionId = savedQuestion.insertId

                if (q.options && q.options.length > 0) {
                    for (const opt of q.options) {
                    await Form.saveOption({
                        question_id: questionId,
                        text: opt.text,
                        correct: opt.correct || false
                    })
                    }
                }
            }

            return response.status(200).json({ status: true, message: "Formulário cadastrado com sucesso." })

        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async getRelations(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." });
            }
            const subject_id = await Subject.subjectUser(id)
            if(!subject_id) {
                return response.status(404).json({ status: false, message: "Nenhuma disciplina encontrada." })
            }

            const class_id = await Class.getIdClassBySubject(subject_id.id)
            if(!class_id) {
                return response.status(404).json({ status: false, message: "Nenhuma classe encontrada." })
            }
            return response.status(200).json({ status: true, subject_id, class_id})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async findFormByUser(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." });
            }
            const form = await Form.getFormByUser(id)
            if(!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }
            return response.status(200).json({ status: true, form})
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
            const formExist = await Form.formExist(id)
            if(!formExist) {
                return response.status(404).json({ status: false, message: "Formulário não encontrado." })
            }
            const valid = await Form.deleteById(id)
            if(!valid) {
                return response.status(500).json({ status: false, message: "Erro ao deletar formulário." })
            }
            return response.status(200).json({ status: true, message: "Formulário deletado com sucesso." })
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async view(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." });
            }
            const form = await Form.getFormById(id)
            if(!form) {
                return response.status(404).json({ status: false, message: "Nenhum formulário encontrado." })
            }
            return response.status(200).json({ status: true, form})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


}

module.exports = new FormController()
