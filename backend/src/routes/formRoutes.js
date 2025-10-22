const express = require("express")
const router = express.Router()
const formController = require("../controllers/FormController")

/**
 * @file formRoutes.js
 * @description Define as rotas relacionadas à manipulação de formulários no sistema.
 * Cada rota é responsável por operações de criação, listagem, visualização e exclusão de formulários,
 * sendo delegada ao controlador `FormController`.
 */

/**
 * @route GET /form/relations/:id
 * @description Retorna as relações (turma, disciplina, etc.) associadas a um formulário.
 * @param {number} id - ID do formulário.
 * @returns {Object} Dados relacionados ao formulário solicitado.
 * @example
 * GET /form/relations/5
 */
router.get("/form/relations/:id", formController.getRelations)

/**
 * @route POST /form/publish
 * @description Publica um novo formulário, salvando suas questões e opções associadas.
 * @body {Object} formData - Dados completos do formulário a ser publicado.
 * @returns {Object} Mensagem de sucesso ou erro da operação.
 * @example
 * POST /form/publish
 * {
 *   "title": "Avaliação de Matemática",
 *   "description": "Prova sobre equações do 2º grau",
 *   "subject_id": 2,
 *   "class_id": 4,
 *   "questions": [...]
 * }
 */
router.post("/form/publish", formController.publish)

/**
 * @route GET /form/:id
 * @description Busca todos os formulários criados por um usuário específico.
 * @param {number} id - ID do usuário criador do formulário.
 * @returns {Array<Object>} Lista de formulários com suas questões e opções.
 * @example
 * GET /form/12
 */
router.get("/form/:id", formController.findFormByUser)

/**
 * @route GET /form/view/:id
 * @description Retorna os dados completos de um formulário específico para visualização.
 * @param {number} id - ID do formulário.
 * @returns {Object} Dados do formulário, incluindo questões e opções.
 * @example
 * GET /form/view/8
 */
router.get("/form/view/:id", formController.view)

/**
 * @route DELETE /form/:id
 * @description Exclui permanentemente um formulário do banco de dados.
 * @param {number} id - ID do formulário a ser deletado.
 * @returns {Object} Resultado da operação (sucesso ou erro).
 * @example
 * DELETE /form/3
 */
router.delete("/form/:id", formController.delete)

module.exports = router
