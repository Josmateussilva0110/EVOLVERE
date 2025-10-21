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
 * @route POST /
 * @summary rota para chamar a função de criação de convite de turma.
 */

router.post('/classes/:id/invites', classController.generateInvite);



/**
 * @route GET /:id
 * @summary Busca os detalhes de uma turma específica, incluindo a lista de alunos.
 * @param {number} id.path.required - ID da turma.
 * @returns {object} 200 - Detalhes da turma e lista de alunos.
 */
router.get('/classes/detail/:id', classController.getDetails);

/**
 * @route DELETE /:id/students/:studentId
 * @summary Remove um aluno de uma turma.
 * @param {number} id.path.required - ID da turma.
 * @param {number} studentId.path.required - ID do aluno a ser removido.
 * @returns {object} 200 - Mensagem de sucesso.
 */
router.delete('/classes/students/:student_id', classController.removeStudent)

/**
 * @route GET /classes/:subject_id
 * @description Lista todas as turmas associadas a uma disciplina específica.
 * 
 * Esta rota aciona o método `listBySubject` do `classController`, que retorna 
 * todas as turmas relacionadas ao ID da disciplina informado no parâmetro da rota.
 * 
 * @param {number} subject_id - ID da disciplina cujas turmas devem ser listadas.
 * @returns {Object[]} 200 - Lista de turmas relacionadas à disciplina.
 * @returns {Object} 404 - Caso nenhuma turma seja encontrada.
 * @returns {Object} 500 - Em caso de erro interno no servidor.
 * 
 * @example
 * // Requisição:
 * GET /classes/3
 * 
 * // Resposta de sucesso:
 * [
 *   { id: 1, name: "Turma A", year: 2024 },
 *   { id: 2, name: "Turma B", year: 2024 }
 * ]
 */
router.get('/classes/:subject_id', classController.listBySubject)


/**
 * @route GET /classes/subject_id/:id
 * @description Retorna o ID da disciplina associada a uma determinada turma.
 * 
 * Esta rota chama o método `getIdSubject` do `classController`, responsável por 
 * localizar a disciplina vinculada a uma turma específica.
 * 
 * @param {number} id - ID da turma para buscar a disciplina associada.
 * @returns {Object} 200 - Objeto contendo o `subject_id` da disciplina.
 * @returns {Object} 404 - Caso a turma ou disciplina não sejam encontrados.
 * @returns {Object} 422 - Caso o ID informado seja inválido.
 * @returns {Object} 500 - Em caso de erro interno no servidor.
 * 
 * @example
 * // Requisição:
 * GET /classes/subject_id/8
 * 
 * // Resposta de sucesso:
 * { "subject_id": 5 }
 */
router.get('/classes/subject_id/:id', classController.getIdSubject)

/**
 * @route GET /classes/materials/:id
 * @description Retorna todos os materiais associados a uma turma específica.
 * 
 * Esta rota utiliza o método `getAllMateriais` do `classController`, que busca 
 * no banco todos os materiais cadastrados com origem associada à turma informada.
 * 
 * @param {number} id - ID da turma para buscar os materiais.
 * @returns {Object[]} 200 - Lista de materiais relacionados à turma.
 * @returns {Object} 404 - Caso não existam materiais associados.
 * @returns {Object} 422 - Caso o ID informado seja inválido.
 * @returns {Object} 500 - Em caso de erro interno no servidor.
 * 
 * @example
 * // Requisição:
 * GET /classes/materials/2
 * 
 * // Resposta de sucesso:
 * [
 *   { id: 10, title: "Aula 1 - Introdução", type: "PDF", created_by: 1 },
 *   { id: 11, title: "Aula 2 - Exercícios", type: "DOC", created_by: 1 }
 * ]
 */
router.get('/classes/materials/:id', classController.getAllMateriais)


router.get('/classes/students/:class_id', classController.getStudent)

module.exports = router;

