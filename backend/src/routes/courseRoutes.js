const express = require("express")
const router = express.Router()
const courseController = require("../controllers/courseController")

/**
 * @module courseRoutes
 * @description Rotas responsáveis por manipulação de cursos e seus relacionamentos (professores e disciplinas).
 */

/**
 * @route GET /courses
 * @group Courses
 * @summary Lista todos os cursos disponíveis no sistema.
 * @returns {Array<Course>} 200 - Lista de cursos
 * @returns {Error} 500 - Erro interno do servidor
 */
router.get('/courses', courseController.getCourses)


/**
 * @route GET /courses/:id/professors
 * @group Courses
 * @summary Retorna os professores associados a um curso específico.
 * @param {string} id.path.required - ID do curso
 * @returns {Array<User>} 200 - Lista de professores
 * @returns {Error} 404 - Curso não encontrado
 */
router.get('/courses/:id/professors', courseController.getProfessorsByCourse)

/**
 * @route GET /courses/:id/subjects
 * @summary Obtém as disciplinas de um curso específico.
 * @param {number} id.path.required - ID do curso.
 * @returns {object} 200 - Lista de disciplinas encontradas para o curso.
 * @returns {object} 404 - Curso não encontrado ou nenhuma disciplina encontrada.
 * @example
 * // GET /courses/2/subjects
 * // Resposta:
 * {
 *   "success": true,
 *   "data": {
 *     "subjects": [
 *       { "id": 15, "name": "Engenharia de Software", "professor_nome": "Carlos Andrade" },
 *       { "id": 18, "name": "Banco de Dados", "professor_nome": "Beatriz Costa" }
 *     ]
 *   }
 * }
 */
router.get('/courses/:id/subjects', courseController.getSubjectsByCourse)

module.exports = router
