/**
 * @file formRoutes.js
 * @description Define as rotas relacionadas à manipulação de formulários no sistema.
 * Cada rota é responsável por operações de criação, listagem, visualização, correção e exclusão
 * de formulários, sendo delegada ao controlador `FormController`.
 *
 * @module routes/formRoutes
 */

const express = require("express")
const router = express.Router()
const formController = require("../controllers/FormController")

/**
 * @route GET /form/relations/:class_id
 * @description Retorna as relações associadas a uma turma específica, como disciplinas,
 * formulários disponíveis e alunos vinculados.
 *
 * @param {number} class_id - ID da turma a ser consultada.
 * @returns {Object} Objeto contendo as relações da turma (disciplinas, formulários, alunos, etc.).
 *
 * @example
 * GET /form/relations/5
 */
router.get("/form/relations/:class_id", formController.getRelations)

/**
 * @route POST /form/publish
 * @description Publica um novo formulário no sistema, incluindo suas questões e opções.
 *
 * @body {Object} formData - Dados completos do formulário.
 * @returns {Object} Status da operação.
 *
 * @example
 * POST /form/publish
 */
router.post("/form/publish", formController.publish)

/**
 * @route GET /form/:id
 * @description Retorna todos os formulários criados por um usuário (professor).
 *
 * @param {number} id - ID do professor.
 * @returns {Array<Object>} Lista de formulários.
 *
 * @example
 * GET /form/12
 */
router.get("/form/:id", formController.findFormByUser)

/**
 * @route GET /form/view/:id
 * @description Retorna as informações completas de um formulário, incluindo questões e opções.
 *
 * @param {number} id - ID do formulário.
 * @returns {Object} Dados completos do formulário.
 *
 * @example
 * GET /form/view/8
 */
router.get("/form/view/:id", formController.view)

/**
 * @route DELETE /form/:id
 * @description Exclui um formulário e suas dependências.
 *
 * @param {number} id - ID do formulário.
 * @returns {Object} Status da exclusão.
 *
 * @example
 * DELETE /form/3
 */
router.delete("/form/:id", formController.delete)

/**
 * @route POST /form/class/:class_id
 * @description Retorna todos os formulários disponíveis para uma turma específica.
 *
 * @param {number} class_id - ID da turma.
 * @returns {Array<Object>} Lista de formulários.
 *
 * @example
 * POST /form/class/2
 */
router.post("/form/class/:class_id", formController.getFormByClassId)

/**
 * @route POST /form/answers
 * @description Salva as respostas enviadas por um aluno.
 *
 * @body {Object} data - Dados da submissão.
 * @returns {Object} Resultado do salvamento.
 *
 * @example
 * POST /form/answers
 */
router.post("/form/answers", formController.saveAnswers)

/**
 * @route GET /form/correction/:subject_id
 * @description Retorna todos os formulários pendentes de correção de uma disciplina.
 *
 * @param {number} subject_id - ID da disciplina.
 * @returns {Array<Object>} Lista de formulários pendentes.
 *
 * @example
 * GET /form/correction/4
 */
router.get("/form/correction/:subject_id", formController.formCorrection)

/**
 * @route GET /form/answers/:form_id
 * @description Retorna todas as respostas enviadas por alunos de um formulário específico.
 *
 * @param {number} form_id - ID do formulário.
 * @returns {Array<Object>} Respostas agrupadas por aluno.
 *
 * @example
 * GET /form/answers/7
 */
router.get("/form/answers/:form_id", formController.answersStudents)

/**
 * @route POST /form/save/correction
 * @description Salva as correções feitas pelo professor nas respostas dos alunos.
 *
 * @body {Array<Object>} corrections - Correções aplicadas.
 * @returns {Object} Resultado da operação.
 *
 * @example
 * POST /form/save/correction
 */
router.post("/form/save/correction", formController.saveCorrection)

/**
 * @route GET /form/student/pending
 * @description Retorna os formulários pendentes do aluno logado.
 *
 * @returns {Object} Dados de pendências.
 *
 * @example
 * GET /form/student/pending
 */
router.get("/form/student/pending", formController.getStudentPendingForms)

/**
 * @route GET /form/results/:form_id
 * @description Retorna os resultados consolidados de um formulário.
 *
 * @param {number} form_id - ID do formulário.
 * @returns {Object} Resultado geral.
 *
 * @example
 * GET /form/results/10
 */
router.get("/form/results/:form_id", formController.getResultForm)

module.exports = router
