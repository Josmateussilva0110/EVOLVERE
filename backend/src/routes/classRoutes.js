const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

/**
 * @module classRoutes
 * @description Define as rotas para operações com Turmas (Classes).
 */

/**
 * @route POST /
 * @summary Cria uma nova turma.
 */
router.post('/classes', classController.create);

/**
 * @route GET /:id
 * @summary Busca os detalhes de uma turma específica, incluindo a lista de alunos.
 * @param {number} id.path.required - ID da turma.
 * @returns {object} 200 - Detalhes da turma e lista de alunos.
 */
router.get('/classes/:id', classController.getDetails);

/**
 * @route DELETE /:id/students/:studentId
 * @summary Remove um aluno de uma turma.
 * @param {number} id.path.required - ID da turma.
 * @param {number} studentId.path.required - ID do aluno a ser removido.
 * @returns {object} 200 - Mensagem de sucesso.
 */
router.delete('/classes/:id/students/:studentId', classController.removeStudent);

module.exports = router;

