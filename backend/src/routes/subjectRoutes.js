const express = require("express")
const router = express.Router()
const subjectController = require("../controllers/subjectController")
const TeacherController = require("../controllers/teacherController")
const teacherController = require("../controllers/teacherController")

/**
 * @module subjectRoutes
 * @description Rotas responsáveis pela manipulação de disciplinas.
 */

/**
 * @route GET /subjects
 * @group Subjects
 * @summary Lista todas as disciplinas disponíveis.
 * @returns {Array<Subject>} 200 - Lista de disciplinas
 * @returns {Error} 500 - Erro interno do servidor
 */
router.get('/subjects', subjectController.list)

/**
 * @route GET /subjects/:id
 * @group Subjects
 * @summary Retorna os detalhes de uma disciplina pelo ID.
 * @param {string} id.path.required - ID da disciplina
 * @returns {Subject.model} 200 - Detalhes da disciplina
 * @returns {Error} 404 - Disciplina não encontrada
 */
router.get('/subjects/:id', subjectController.getById)

/**
 * @route POST /subjects
 * @group Subjects
 * @summary Cria uma nova disciplina.
 * @param {object} request.body.required - Dados da disciplina
 * @param {string} request.body.name - Nome da disciplina
 * @param {string} request.body.code - Código identificador da disciplina
 * @param {string} request.body.courseId - ID do curso associado
 * @returns {Subject.model} 201 - Disciplina criada
 * @returns {Error} 400 - Dados inválidos
 */
router.post('/subjects', subjectController.create)

/**
 * @route PUT /subjects/:id
 * @group Subjects
 * @summary Atualiza uma disciplina existente.
 * @param {string} id.path.required - ID da disciplina
 * @param {object} request.body.required - Dados da disciplina
 * @param {string} request.body.name - Nome atualizado
 * @param {string} request.body.code - Código atualizado
 * @returns {Subject.model} 200 - Disciplina atualizada
 * @returns {Error} 404 - Disciplina não encontrada
 */
router.put('/subjects/:id', subjectController.update)

/**
 * @route DELETE /subjects/:id
 * @group Subjects
 * @summary Remove uma disciplina do sistema.
 * @param {string} id.path.required - ID da disciplina
 * @returns {object} 200 - Mensagem de sucesso
 * @returns {Error} 404 - Disciplina não encontrada
 */
router.delete('/subjects/:id', subjectController.delete)


router.get("/subjects/teacher/:id", teacherController.getAllSubjects)

module.exports = router
