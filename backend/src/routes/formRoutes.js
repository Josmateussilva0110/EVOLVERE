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
 * // Exemplo de requisição
 * GET /form/relations/5
 *
 * // Exemplo de resposta
 * {
 *   "status": true,
 *   "data": {
 *     "class": { "id": 5, "name": "3º Ano A" },
 *     "subjects": [...],
 *     "students": [...]
 *   }
 * }
 */
router.get("/form/relations/:class_id", formController.getRelations)

/**
 * @route POST /form/publish
 * @description Publica um novo formulário no sistema. O formulário inclui suas questões e
 * opções, sendo vinculado a uma turma e disciplina.
 *
 * @body {Object} formData - Dados completos do formulário a ser publicado.
 * @body {string} formData.title - Título do formulário.
 * @body {string} formData.description - Descrição ou instruções gerais.
 * @body {number} formData.subject_id - ID da disciplina relacionada.
 * @body {number} formData.class_id - ID da turma destinatária.
 * @body {Array<Object>} formData.questions - Lista de questões com suas opções.
 *
 * @returns {Object} Mensagem indicando sucesso ou erro da publicação.
 *
 * @example
 * // Exemplo de requisição
 * POST /form/publish
 * {
 *   "title": "Avaliação de Matemática",
 *   "description": "Prova sobre equações do 2º grau",
 *   "subject_id": 2,
 *   "class_id": 4,
 *   "questions": [
 *     {
 *       "question": "Resolva a equação x² - 5x + 6 = 0",
 *       "type": "multipla_escolha",
 *       "options": ["x = 2 e x = 3", "x = 1 e x = 6", "x = 4 e x = 5"],
 *       "correct_option": 0
 *     }
 *   ]
 * }
 *
 * // Exemplo de resposta
 * {
 *   "status": true,
 *   "message": "Formulário publicado com sucesso."
 * }
 */
router.post("/form/publish", formController.publish)

/**
 * @route GET /form/:id
 * @description Retorna todos os formulários criados por um determinado usuário (professor).
 *
 * @param {number} id - ID do usuário criador dos formulários.
 * @returns {Array<Object>} Lista de formulários com informações básicas.
 *
 * @example
 * // Exemplo de requisição
 * GET /form/12
 *
 * // Exemplo de resposta
 * {
 *   "status": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "title": "Prova de História",
 *       "class": "2º Ano B",
 *       "created_at": "2025-05-10"
 *     }
 *   ]
 * }
 */
router.get("/form/:id", formController.findFormByUser)

/**
 * @route GET /form/view/:id
 * @description Retorna os dados completos de um formulário, incluindo questões e opções,
 * para fins de visualização ou edição.
 *
 * @param {number} id - ID do formulário.
 * @returns {Object} Dados completos do formulário.
 *
 * @example
 * GET /form/view/8
 *
 * // Exemplo de resposta
 * {
 *   "status": true,
 *   "form": {
 *     "id": 8,
 *     "title": "Simulado de Geografia",
 *     "questions": [
 *       {
 *         "id": 21,
 *         "text": "Qual é o maior continente?",
 *         "options": ["Ásia", "África", "América do Sul"]
 *       }
 *     ]
 *   }
 * }
 */
router.get("/form/view/:id", formController.view)

/**
 * @route DELETE /form/:id
 * @description Exclui um formulário e todas as suas dependências (questões e respostas).
 *
 * @param {number} id - ID do formulário.
 * @returns {Object} Mensagem de confirmação ou erro.
 *
 * @example
 * DELETE /form/3
 *
 * // Exemplo de resposta
 * {
 *   "status": true,
 *   "message": "Formulário excluído com sucesso."
 * }
 */
router.delete("/form/:id", formController.delete)

/**
 * @route POST /form/class/:class_id
 * @description Retorna todos os formulários disponíveis para uma turma específica.
 *
 * @param {number} class_id - ID da turma.
 * @returns {Array<Object>} Lista de formulários da turma.
 *
 * @example
 * POST /form/class/2
 */
router.post("/form/class/:class_id", formController.getFormByClassId)

/**
 * @route POST /form/answers
 * @description Salva as respostas enviadas por um aluno a um formulário.
 *
 * @body {Object} data - Dados da submissão.
 * @body {number} data.form_id - ID do formulário respondido.
 * @body {number} data.student_id - ID do aluno que respondeu.
 * @body {Array<Object>} data.answers - Lista de respostas (questão → resposta).
 *
 * @returns {Object} Resultado do salvamento.
 *
 * @example
 * POST /form/answers
 * {
 *   "form_id": 5,
 *   "student_id": 23,
 *   "answers": [
 *     { "question_id": 1, "answer": "x = 2 e x = 3" }
 *   ]
 * }
 */
router.post("/form/answers", formController.saveAnswers)

/**
 * @route GET /form/correction/:class_id
 * @description Retorna todos os formulários pendentes de correção de uma turma.
 *
 * @param {number} class_id - ID da turma.
 * @returns {Array<Object>} Lista de formulários aguardando correção.
 *
 * @example
 * GET /form/correction/4
 */
router.get("/form/correction/:subject_id", formController.formCorrection)



/**
 * @route GET /form/answers/:form_id
 * @description Retorna todas as respostas dos alunos associadas a um formulário.
 *
 * @param {number} form_id - ID do formulário.
 * @returns {Array<Object>} Lista de respostas por aluno.
 *
 * @example
 * GET /form/answers/7
 */
router.get("/form/answers/:form_id", formController.answersStudents)

/**
 * @route POST /form/save/correction
 * @description Salva as correções realizadas por um professor nas respostas dos alunos.
 *
 * @body {Array<Object>} corrections - Lista de correções.
 * @body {number} corrections[].answer_id - ID da resposta corrigida.
 * @body {number} corrections[].teacher_id - ID do professor.
 * @body {string} [corrections[].comment] - Comentário opcional do professor.
 * @body {string} corrections[].status - Status da resposta (correto/incorreto/parcial).
 *
 * @returns {Object} Resultado da operação.
 *
 * @example
 * POST /form/save/correction
 * [
 *   { "answer_id": 1, "teacher_id": 5, "comment": "Boa resposta!", "status": "correto" }
 * ]
 */
router.post("/form/save/correction", formController.saveCorrection)

/**
 * @route GET /form/student/pending
 * @description Retorna as atividades pendentes (formulários ainda não respondidos) de um aluno logado.
 *
 * @returns {Object} Total de pendências e as atividades mais próximas do prazo.
 *
 * @example
 * GET /form/student/pending
 *
 * // Exemplo de resposta
 * {
 *   "status": true,
 *   "data": {
 *     "pendingCount": 3,
 *     "upcomingActivities": [
 *       { "id": 1, "title": "Prova de Biologia", "daysRemaining": 2, "urgency": "alta" }
 *     ]
 *   }
 * }
 */
router.get("/form/student/pending", formController.getStudentPendingForms)

module.exports = router
