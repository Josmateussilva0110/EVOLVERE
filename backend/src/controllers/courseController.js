const Course = require("../models/Course")
const validator = require('validator')
const User = require("../models/User")
const Account = require("../models/Account")

/**
 * Controlador para gerir operações relacionadas a Cursos.
 * @class
 */
class CourseController {

    /**
     * @summary Retorna todos os cursos registados no sistema.
     * @param {import("express").Request} request - O objeto da requisição Express.
     * @param {import("express").Response} response - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "courses": [
     * { "id": 1, "name": "Sistemas de Informação", "course_code": "102590" },
     * { "id": 2, "name": "Engenharia Civil", "course_code": "102591" }
     * ]
     * }
     */
    async getCourses(request, response) {
        try {
            const courses = await Course.getAll();
            if(!courses) {
                return response.status(404).json({status: false, message: 'Nenhum curso encontrado.'});
            }
            return response.status(200).json({status: true, courses});
        } catch (err) {
            console.error("Erro ao listar cursos:", err);
            return response.status(500).json({ status: false, message: "Erro interno no servidor." });
        }
    }

    /**
     * @summary Busca todos os professores aprovados associados a um curso específico.
     * @param {import("express").Request} request - O objeto da requisição Express.
     * @param {import("express").Response} response - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // GET /api/courses/2/professors
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "professores": [
     * { "id": 5, "username": "Prof. Carlos", "institution": "Universidade X" }
     * ]
     * }
     */
    async getProfessorsByCourse(request, response) {
        try {
            const { id } = request.params;

            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Id inválido."});
            }

            const professores = await Course.findProfessors(Number(id));

            if (!professores || professores.length === 0) {
                return response.status(404).json({
                    status: false,
                    message: 'Nenhum professor encontrado para este curso.'
                });
            }

            return response.status(200).json({
                status: true,
                professores: professores
            });

        } catch (err) {
            console.error("Erro ao listar professores por curso:", err);
            return response.status(500).json({
                status: false,
                message: "Erro interno no servidor."
            });
        }
    }

    /**
     * @summary Encontra todas as disciplinas de um curso específico pelo ID do curso.
     * @param {import("express").Request} request - O objeto da requisição Express.
     * @param {import("express").Response} response - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // GET /api/courses/2/subjects
     * // Resposta de sucesso:
     * {
     * "success": true,
     * "data": {
     * "subjects": [
     * { "id": 10, "name": "Cálculo I", "professor_nome": "Prof. Carlos" }
     * ]
     * }
     * }
     */
    async getSubjectsByCourse(request, response) {
        try {
            const { id } = request.params

            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "Id do curso é inválido." })
            }

            let subjects = []

            const isAdmin = await User.isAdmin(id) 
            if(isAdmin) {
                subjects = await Course.getAllSubjects()
                console.log(subjects)
            }
            else {
                const coordinator = await Account.findCoordinatorById(id)
                if(!coordinator) {
                    return response.status(404).json({status: false, message: "Coordenador não encontrado"})
                }
                subjects = await Course.findSubjectsByCourseId(coordinator.course_id)
            }



            if (!subjects || subjects.length === 0) {
                return response.status(404).json({
                    status: false,
                    message: 'Nenhuma disciplina encontrada para este curso.'
                })
            }

            return response.status(200).json({
                status: true,
                subjects
            })

        } catch (err) {
            console.error("Erro ao listar disciplinas por curso:", err)
            return response.status(500).json({
                status: false,
                message: "Erro interno no servidor."
            })
        }
    }
}

module.exports = new CourseController()

