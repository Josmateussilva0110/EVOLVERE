const MaterialFieldValidator = require("../utils/materialValidator")
const Form = require("../models/Form")
const Subject = require("../models/Subject")
const Class = require("../models/Class")
const validator = require('validator');
const Question = require("../models/Question")
const Option = require("../models/Option")

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
                const questionData = { form_id: formId, text: q.text, type: q.type }
                const savedQuestion = await Question.save(questionData)
                const questionId = savedQuestion.insertId

                if (q.options && q.options.length > 0) {
                    for (const opt of q.options) {
                    await Option.save({
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
}

module.exports = new FormController()
