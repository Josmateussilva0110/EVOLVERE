const Course = require("../models/Course")
const validator = require('validator')

/**
 * Controlador de Cursos.
 * Responsável por operações de listagem de cursos.
 * @class
 */
class CourseController {

    /**
     * Retorna todos os cursos cadastrados no sistema.
     *
     * @async
     * @param {import("express").Request} request - Objeto de requisição do Express.
     * @param {import("express").Response} response - Objeto de resposta do Express.
     * @returns {Promise<Object>} JSON com status e lista de cursos ou mensagem de erro.
     *
     * @throws {404} Caso nenhum curso seja encontrado.
     * @throws {500} Em caso de erro interno no servidor.
     *
     * @example
     * // Requisição GET /courses
     * {}
     *
     * @example
     * // Resposta em caso de sucesso
     * {
     *   "status": true,
     *   "courses": [
     *     { "id": 1, "name": "Matemática", "code": "123456" },
     *     { "id": 2, "name": "Física", "code": "234567" }
     *   ]
     * }
     *
     * @example
     * // Resposta em caso de erro (nenhum curso)
     * {
     *   "status": false,
     *   "message": "Nenhum curso encontrado."
     * }
     */
    async getCourses(request, response) {
        try {
            const courses = await Course.getAll()
            if(!courses) {
                return response.status(404).json({status: false, message: 'Nenhum curso encontrado.'})
            }
            return response.status(200).json({status: true, courses})
        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

        
    async getProfessorsByCourse(request, response) {
        try {
            const { id } = request.params;

            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Id inválido."})
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
}

module.exports = new CourseController()
