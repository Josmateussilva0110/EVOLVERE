const express = require("express");
const pdfUpload = require("../middleware/Archive");
const router = express.Router();
const userController = require("../controllers/userController");
const courseController = require("../controllers/courseController");
const accountController = require("../controllers/accountController");
const subjectController = require("../controllers/subjectController");

/**
 * @module routes
 * @description Define todas as rotas da API para utilizadores, contas, cursos e disciplinas.
 */

// =============================================
// ROTAS DE UTILIZADORES E CONTAS
// =============================================

/**
 * @route POST /login
 * @summary Realiza o login do utilizador.
 * @param {string} email.body.required - Email do utilizador.
 * @param {string} password.body.required - Senha do utilizador.
 * @returns {object} 200 - Utilizador autenticado e sessão criada.
 * @returns {object} 422 - Erro de validação (senha incorreta ou campos inválidos).
 * @returns {object} 404 - Utilizador não encontrado.
 */
router.post('/login', userController.login);

/**
 * @route POST /user/register
 * @summary Regista um novo utilizador.
 * @param {string} username.body.required - Nome do utilizador.
 * @param {string} email.body.required - Email do utilizador.
 * @param {string} password.body.required - Senha.
 * @param {string} confirm_password.body.required - Confirmação de senha.
 * @returns {object} 200 - Utilizador registado e sessão criada.
 * @returns {object} 422 - Erro de validação ou email já existente.
 */
router.post('/user/register', userController.register);

/**
 * @route POST /user/logout
 * @summary Encerra a sessão do utilizador.
 * @returns {object} 200 - Logout realizado com sucesso.
 * @returns {object} 500 - Erro interno ao encerrar a sessão.
 */
router.post('/user/logout', userController.logout);

/**
 * @route GET /user/session
 * @summary Retorna informações da sessão atual do utilizador.
 * @returns {object} 200 - Dados do utilizador logado.
 * @returns {object} 401 - Utilizador não autenticado.
 */
router.get('/user/session', userController.session);

/**
 * @route GET /user/:id
 * @summary Obtém dados de um utilizador pelo ID.
 * @param {number} id.path.required - ID do utilizador.
 * @returns {object} 200 - Dados do utilizador.
 * @returns {object} 404 - Utilizador não encontrado.
 */
router.get('/user/:id', userController.getUserById);

/**
 * @route POST /user/account
 * @summary Registo de conta de profissional com upload de diploma PDF.
 * @param {string} role.body.required - Papel do profissional (ex: 2 para coordenador, 3 para professor).
 * @param {string} institution.body.required - Nome da instituição.
 * @param {string} access_code.body.required - Código de acesso do curso.
 * @param {file} diploma.formData.required - Arquivo PDF do diploma (máx 5MB).
 * @returns {object} 200 - Conta registada com sucesso.
 * @returns {object} 400 - Erro no upload do ficheiro.
 * @returns {object} 422 - Dados inválidos ou utilizador já possui conta.
 */
router.post("/user/account", (request, response, next) => {
    pdfUpload.single("diploma")(request, response, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return response.status(400).json({ status: false, message: "O ficheiro excede 5 MB." });
            }
            return response.status(400).json({ status: false, message: err.message });
        }
        next();
    });
}, accountController.addRole);

/**
 * @route GET /user/requests/:id
 * @summary Retorna as solicitações de professores pendentes para um coordenador.
 * @param {number} id.path.required - ID do coordenador.
 * @returns {object} 200 - Lista de solicitações pendentes.
 * @returns {object} 404 - Nenhuma solicitação encontrada.
 */
router.get('/user/requests/:id', accountController.requests);

/**
 * @route DELETE /user/request/:id_user
 * @summary Remove uma solicitação de aprovação de profissional.
 * @param {number} id_user.path.required - ID do utilizador cuja solicitação será removida.
 * @returns {object} 200 - Solicitação removida com sucesso.
 * @returns {object} 404 - Solicitação não encontrada.
 */
router.delete('/user/request/:id_user', accountController.removeRequest);

/**
 * @route PATCH /user/request/approved/:id_user
 * @summary Aprova a solicitação de um profissional (professor/coordenador).
 * @param {number} id_user.path.required - ID do utilizador a ser aprovado.
 * @returns {object} 200 - Conta aprovada com sucesso.
 * @returns {object} 404 - Solicitação não encontrada.
 */
router.patch('/user/request/approved/:id_user', accountController.approve);

/**
 * @route GET /users/professores
 * @summary Lista todos os professores validados, sem filtro de curso.
 * @returns {object} 200 - Lista de todos os professores validados.
 * @returns {object} 404 - Nenhum professor encontrado.
 */
router.get('/users/professores', userController.getProfessoresValidados);

/**
 * @route GET /user/teachers/:id
 * @summary Retorna todos os professores aprovados associados a um coordenador/curso.
 * @param {number} id.path.required - ID do coordenador.
 * @returns {object} 200 - Lista de professores.
 * @returns {object} 404 - Nenhum professor encontrado.
 * @example
 * // GET /api/user/teachers/5
 * {
 * "status": true,
 * "data": [ { "id": 6, "username": "Carlos Silva" } ]
 * }
 */
router.get('/user/teachers/:id', accountController.getTeachers);

/**
 * @route DELETE /user/teacher/:id
 * @summary Remove um professor do sistema.
 * @param {number} id.path.required - ID do professor a ser removido.
 * @returns {object} 200 - Professor removido com sucesso.
 * @returns {object} 404 - Professor não encontrado.
 */
router.delete('/user/teacher/:id', accountController.deleteTeacher);

/**
 * @route GET /user/coordinator/:id
 * @summary Retorna os dados de um coordenador específico pelo ID.
 * @param {number} id.path.required - ID do coordenador.
 * @returns {object} 200 - Dados do coordenador.
 * @returns {object} 404 - Coordenador não encontrado.
 */
router.get('/user/coordinator/:id', accountController.getCoordinatorData);

/**
 * @route GET /user/coordinator/kpi/:id
 * @summary Retorna os KPIs (indicadores) para o dashboard do coordenador.
 * @param {number} id.path.required - ID do coordenador.
 * @returns {object} 200 - Objeto com os KPIs (professores, disciplinas, solicitações).
 * @returns {object} 404 - Coordenador não encontrado.
 */
router.get('/user/coordinator/kpi/:id', accountController.getKpis);

/**
 * @route GET /users/students
 * @summary Lista todos os utilizadores que são alunos.
 * @returns {object} 200 - Lista de alunos.
 * @returns {object} 404 - Nenhum aluno encontrado.
 */
router.get('/users/students', userController.getStudents);

/**
 * @route DELETE /users/students/:id
 * @summary Apaga um aluno pelo ID.
 * @param {number} id.path.required - ID do aluno a ser apagado.
 * @returns {object} 200 - Aluno apagado com sucesso.
 * @returns {object} 404 - Aluno não encontrado.
 */
router.delete('/users/students/:id', userController.deleteStudent);


// =============================================
// ROTAS DE CURSOS
// =============================================

/**
 * @route GET /courses
 * @summary Obtém todos os cursos registados.
 * @returns {object} 200 - Lista de cursos.
 * @returns {object} 404 - Nenhum curso encontrado.
 */
router.get('/courses', courseController.getCourses);

/**
 * @route GET /courses/:id/professors
 * @summary Obtém os professores validados de um curso específico.
 * @param {number} id.path.required - ID do curso.
 * @returns {object} 200 - Lista de professores.
 * @returns {object} 404 - Nenhum professor encontrado para este curso.
 */
router.get('/courses/:id/professors', courseController.getProfessorsByCourse);

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
router.get('/courses/:id/subjects', courseController.getSubjectsByCourse);

// =============================================
// ROTAS DE DISCIPLINAS (SUBJECTS)
// =============================================

/**
 * @route GET /subjects
 * @summary Obtém todas as disciplinas registadas.
 * @returns {object} 200 - Lista de disciplinas.
 * @returns {object} 404 - Nenhuma disciplina encontrada.
 */
router.get('/subjects', subjectController.list);

/**
 * @route POST /subjects
 * @summary Cria uma nova disciplina.
 * @param {string} name.body.required - Nome da disciplina.
 * @param {number} professional_id.body.required - ID do professor.
 * @param {number} course_valid_id.body.required - ID do curso.
 * @returns {object} 201 - Disciplina criada com sucesso.
 * @returns {object} 400 - Dados inválidos.
 */
router.post('/subjects', subjectController.create);

/**
 * @route GET /subjects/:id
 * @summary Obtém uma disciplina pelo ID.
 * @param {number} id.path.required - ID da disciplina.
 * @returns {object} 200 - Dados da disciplina.
 * @returns {object} 404 - Disciplina não encontrada.
 */
router.get('/subjects/:id', subjectController.getById);

/**
 * @route PUT /subjects/:id
 * @summary Atualiza uma disciplina.
 * @param {number} id.path.required - ID da disciplina.
 * @param {string} name.body.optional - Nome da disciplina.
 * @param {number} professional_id.body.optional - ID do professor.
 * @param {number} course_valid_id.body.optional - ID do curso.
 * @returns {object} 200 - Disciplina atualizada com sucesso.
 * @returns {object} 404 - Disciplina não encontrada.
 */
router.put('/subjects/:id', subjectController.update);

/**
 * @route DELETE /subjects/:id
 * @summary Apaga uma disciplina.
 * @param {number} id.path.required - ID da disciplina.
 * @returns {object} 204 - Disciplina apagada com sucesso.
 * @returns {object} 404 - Disciplina não encontrada.
 */
router.delete('/subjects/:id', subjectController.delete);


module.exports = router;
// =============================================
// FIM DAS ROTAS
// =============================================