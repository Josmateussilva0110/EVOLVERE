const Class = require('../models/Class');
const validator = require('validator');
const crypto = require('crypto');
const Invite = require('../models/Invite'); 

function generateInviteCode() {
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${randomPart.substring(0, 3)}-${randomPart.substring(3, 6)}`;
}

/**
 * Controlador para gerir as operações relacionadas a Turmas (Classes).
 * @class
 */
class ClassController {

    /**
     * @summary Cria uma nova turma.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // POST /api/classes
     * // Corpo da requisição (Body):
     * {
     * "name": "Turma C",
     * "period": "2025.1",
     * "subject_id": 1,
     * "course_id": 2
     * }
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "message": "Turma criada com sucesso!",
     * "data": { "id": 3, "name": "Turma C", ... }
     * }
     */
    async create(req, res) {
        try {
            // Agora incluindo 'capacity'
            const { name, period, subject_id, course_id, capacity, expired } = req.body;

            // Adicionando 'capacity' na validação
            if (!name || !period || !subject_id || !course_id || !capacity || !expired) {
                return res.status(400).json({ 
                    status: false, 
                    // Mensagem de erro atualizada
                    message: 'Todos os campos (nome, período, id da disciplina, id do curso, capacidade) são obrigatórios.' 
                });
            }

            const newClass = await Class.create({
                name,
                period,
                subject_id: parseInt(subject_id),
                course_id: parseInt(course_id),
                capacity: parseInt(capacity),
                expired: expired
            });

            if (!newClass) {
                return res.status(500).json({ 
                    status: false, 
                    message: 'Não foi possível criar a turma.' 
                });
            }

            const responseData = {
                id: newClass.id,
                name: newClass.name,
                capacity: newClass.capacity,
                student_count: 0
            }

            res.status(201).json({
                status: true,
                classes: responseData,
                message: 'Turma criada com sucesso!',
            });

        } catch (error) {
            console.error('Erro ao criar turma:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor.' 
            });
        }
    }

    /**
     * @summary Lista todas as turmas de uma disciplina específica.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // GET /api/subjects/1/classes
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "data": [
     * { "id": 1, "name": "A", "period": "2025.1", "student_count": "42" },
     * { "id": 2, "name": "B", "period": "2025.1", "student_count": "38" }
     * ]
     * }
     */
    async listBySubject(req, res) {
        try {
            const { subject_id } = req.params;

            if (!validator.isInt(subject_id + '', { min: 1 })) {
                return res.status(422).json({ status: false, message: "ID da disciplina inválido." });
            }

            const classes = await Class.findBySubjectId(Number(subject_id));

            if (!classes) {
                return res.status(404).json({ status: false, message: 'Nenhuma turma encontrada.' });
            }

            res.status(200).json({
                status: true,
                classes
            });

        } catch (error) {
            console.error('Erro ao listar turmas por disciplina:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor.' 
            });
        }
    }

    /**
     * @summary Busca os detalhes de uma turma específica, incluindo a lista de alunos.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // GET /api/classes/1
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "data": {
     * "id": 1,
     * "name": "A",
     * "period": "2025.1",
     * "alunos": [
     * { "id": 10, "username": "João Silva" },
     * { "id": 15, "username": "Maria Oliveira" }
     * ]
     * }
     * }
     */
    async getDetails(req, res) {
        try {
            const { id } = req.params;

            if (!validator.isInt(id + '', { min: 1 })) {
                return res.status(422).json({ status: false, message: "ID da turma inválido." });
            }

            const classDetails = await Class.getDetails(Number(id));

            if (!classDetails) {
                return res.status(404).json({ status: false, message: 'Turma não encontrada.' });
            }

            res.status(200).json({
                status: true,
                data: classDetails
            });

        } catch (error) {
            console.error('Erro ao buscar detalhes da turma:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor.' 
            });
        }
    }


    /**
     * @summary Obtém o ID da disciplina associada a uma turma específica.
     * @param {import("express").Request} request - O objeto da requisição Express.
     * @param {import("express").Response} response - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // GET /api/classes/1/subject-id
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "subject_id": 5
     * }
     */
    async getIdSubject(request, response) {
        try {
            const {id} = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ status: false, message: "ID da turma inválido." });
            }

            const result = await Class.findIdSubject(id)
            if(!result) {
                return response.status(404).json({ status: false, message: "Id da materia não encontrado." })
            }
            const subject_id = result.subject_id
            return response.status(200).json({status: true, subject_id})

        } catch (err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * @summary Obtém todos os materiais associados a uma turma específica.
     * @param {import("express").Request} request - O objeto da requisição Express.
     * @param {import("express").Response} response - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // GET /api/classes/1/materials
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "materials": [
     * { "id": 1, "name": "Apostila 1", "type": "pdf" },
     * { "id": 2, "name": "Exercícios", "type": "doc" }
     * ]
     * }
     */
    async getAllMateriais(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." });
            }
            const materials = await Class.getMaterialsClass(id)
            if(!materials) {
                return response.status(404).json({ status: false, message: "Nenhum material encontrado." })
            }
            return response.status(200).json({ status: true, materials})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * @summary Gera um novo código de convite para uma turma.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // POST /api/classes/1/generate-invite
     * // Corpo da requisição (Body):
     * {
     * "expiration": "7_days",
     * "maxUses": "unlimited"
     * }
     * // Resposta de sucesso:
     * {
     * "success": true,
     * "message": "Código de convite gerado com sucesso!",
     * "data": {
     * "code": "ABC-123",
     * "expires_at": "2025-01-01T00:00:00.000Z"
     * }
     * }
     */
    async generateInvite(req, res) {
        try {
            const { id: classId } = req.params;
            const { expires_in_minutes, max_uses } = req.body;

            // Lógica de cálculo de data e max_uses (continua no controller)
            let expirationDate;
            if (expires_in_minutes > 0) {
                expirationDate = new Date();
                expirationDate.setMinutes(expirationDate.getMinutes() + expires_in_minutes);
            } else {
                expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 100);
            }
            const dbMaxUses = (max_uses === 0) ? null : max_uses;

            let inviteCode;
            let isCodeUnique = false;
            while (!isCodeUnique) {
                inviteCode = generateInviteCode();
                const existingCode = await Invite.findByCode(inviteCode);
                if (!existingCode) isCodeUnique = true;
            }
            
            const newInvite = await Invite.create({
                code: inviteCode,
                classes_id: parseInt(classId),
                expires_at: expirationDate,
                max_uses: dbMaxUses
            });


            const responseData = {
                code: newInvite.code,
                expires_at: newInvite.expires_at.toISOString(),
                max_uses: newInvite.max_uses === null ? 0 : newInvite.max_uses,
            };
            
            res.status(201).json({
                success: true,
                message: "Código de convite gerado com sucesso!",
                data: responseData
            });

        } catch (error) {
            console.error('Erro ao gerar código de convite:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
        }
    }


    /**
     * Retorna todos os alunos associados a uma turma específica.
     *
     * Essa função valida o `class_id` recebido via parâmetros,
     * consulta os alunos vinculados à turma e retorna a lista.
     * Caso o `class_id` seja inválido ou nenhum aluno seja encontrado,
     * uma resposta com o código de status apropriado é enviada.
     *
     * @async
     * @function getStudent
     * @param {import('express').Request} request - Objeto da requisição Express contendo o parâmetro `class_id`.
     * @param {import('express').Response} response - Objeto da resposta Express usado para retornar dados ou erros.
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON contendo a lista de alunos ou uma mensagem de erro.
     *
     * @example
     * // Rota de exemplo:
     * router.get('/class/:class_id/students', ClassController.getStudent);
     *
     * // Resposta de sucesso (200):
     * {
     *   "status": true,
     *   "students": [
     *     { "id": 1, "name": "Maria Silva" },
     *     { "id": 2, "name": "João Souza" }
     *   ]
     * }
     *
     * // Resposta (422): ID inválido
     * { "success": false, "message": "ID inválido." }
     *
     * // Resposta (404): Nenhum aluno
     * { "status": false, "message": "Nenhum aluno encontrado." }
     */
    async getStudent(request, response) {
        try {
            const {class_id} = request.params
            if (!validator.isInt(class_id + '', { min: 1 })) {
                return response.status(422).json({ success: false, message: "ID inválido." });
            }

            const students = await Class.Students(class_id)
            if(!students) {
                return response.status(404).json({ status: false, message: "Nenhum aluno encontrado." })
            }
            return response.status(200).json({status: true, students})
        } catch(err) {
            return response.status(500).json({ success: false, message: 'Erro interno do servidor.' });
        }
    }


    /**
     * Remove um aluno específico de uma turma.
     *
     * Essa função valida os parâmetros `student_id` e `class_id`,
     * verifica se o aluno está associado à turma e, caso positivo,
     * realiza a exclusão da relação entre o aluno e a turma.
     *
     * @async
     * @function removeStudent
     * @param {import('express').Request} request - Objeto da requisição Express contendo `student_id` nos parâmetros e `class_id` no corpo.
     * @param {import('express').Response} response - Objeto da resposta Express usado para enviar o resultado.
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON informando o sucesso ou falha da operação.
     *
     * @example
     * // Rota de exemplo:
     * router.delete('/students/:student_id', ClassController.removeStudent);
     *
     * // Corpo da requisição:
     * { "class_id": 3 }
     *
     * // Resposta de sucesso (200):
     * { "status": true, "message": "Aluno removido com sucesso." }
     *
     * // Resposta (404): Aluno não encontrado
     * { "status": false, "message": "Aluno não encontrado." }
     *
     * // Resposta (500): Erro no servidor
     * { "status": false, "message": "Erro interno no servidor." }
     */
    async removeStudent(request, response) {
        try {
            const { student_id } = request.params
            const { class_id } = request.body
            if (!validator.isInt(student_id + '', { min: 1 })) {
                return res.status(422).json({ success: false, message: "ID inválido." });
            }
            if (!validator.isInt(class_id + '', { min: 1 })) {
                return res.status(422).json({ success: false, message: "Turma invalida." });
            }

            const studentExist = await Class.studentExist(student_id, class_id)
            if(!studentExist) {
                return response.status(404).json({ status: false, message: "Aluno não encontrado." })
            }
            const valid = await Class.deleteStudentById(student_id, class_id)
            if(!valid) {
                return response.status(500).json({ status: false, message: "Erro ao deletar aluno." })
            }
            return response.status(200).json({ status: true, message: "Aluno removido com sucesso." })
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
     * Obtém todas as turmas associadas a um aluno.
     *
     * Essa função valida o `student_id` recebido via parâmetros e consulta
     * as turmas em que o aluno está matriculado. Caso não encontre nenhuma turma,
     * retorna um erro com código HTTP 404.
     *
     * @async
     * @function getClasses
     * @param {import('express').Request} request - Objeto da requisição Express contendo o parâmetro `student_id`.
     * @param {import('express').Response} response - Objeto da resposta Express.
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON com as turmas encontradas ou uma mensagem de erro.
     *
     * @example
     * // Rota de exemplo:
     * router.get('/students/:student_id/classes', ClassController.getClasses);
     *
     * // Resposta de sucesso (200):
     * {
     *   "status": true,
     *   "classes": [
     *     { "id": 1, "name": "Turma A", "year": 2025 },
     *     { "id": 2, "name": "Turma B", "year": 2025 }
     *   ]
     * }
     *
     * // Resposta (422): ID inválido
     * { "success": false, "message": "ID inválido." }
     *
     * // Resposta (404): Nenhuma turma encontrada
     * { "status": false, "message": "Nenhuma turma encontrada." }
     */
    async getClasses(request, response) {
        try {
            const { student_id } = request.params
            if (!validator.isInt(student_id + '', { min: 1 })) {
                return res.status(422).json({ success: false, message: "ID inválido." });
            }

            const classes = await Class.getClassByIdUser(student_id)
            if(!classes) {
                return response.status(404).json({status: false, message: "Nenhuma turma encontrada."})
            }
            return response.status(200).json({status: true, classes})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    async getKpi(request, response) {
        try {
            const { user_id } = request.params
            if (!validator.isInt(user_id + '', { min: 1 })) {
                return res.status(422).json({ success: false, message: "Usuário invalido." });
            }
            const kpi = await Class.kpi(user_id)
            if(!kpi) {
                return response.status(404).json({ status: false, message: "Nenhum dado encontrado." })
            }

            return response.status(200).json({status: true, kpi})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

    /**
     * @summary Obtém os dados consolidados para o dashboard do ALUNO LOGADO.
     * @description Pega o ID do aluno da SESSÃO e combina a lista de
     * turmas (com filtros) e os KPIs.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // GET /api/dashboard/student?search=ED1&semestre=3º%20Semestre
     * // (O backend pega o ID do aluno da sessão)
     */
    async getStudentDashboard(req, res) {
        try {
            // === MUDANÇA PRINCIPAL ===
            // Pega o ID do usuário diretamente da sessão.
            const student_id = req.session.user.id;

            // 1. Validar se o usuário está logado
            if (!student_id) {
                return res.status(401).json({ 
                    status: false, 
                    message: "Acesso não autorizado. Faça login novamente." 
                });
            }
            // === FIM DA MUDANÇA ===

            const { search, semestre } = req.query; // Filtros

            // 2. Buscar as turmas filtradas (o model não muda)
            const classes = await Class.getClassesForDashboard(Number(student_id), search, semestre);

            // 3. Buscar os KPIs (o model não muda)
            const kpi = await Class.kpi(Number(student_id));
            
            if (classes === undefined || !kpi) {
                return res.status(500).json({ status: false, message: "Erro ao consultar dados do dashboard." });
            }

            // 4. Formatar os KPIs para o frontend
            const stats = {
                totalDisciplinas: kpi.total_classes || 0,
                // TODO: O backend precisa calcular o progresso e a média real.
                progresso: "76%", 
                media: "8.0"
            };

            // 5. Enviar a resposta combinada
            res.status(200).json({
                status: true,
                data: {
                    stats: stats,
                    disciplinas: classes 
                }
            });

        } catch (error) {
            console.error('Erro ao buscar dados do dashboard do aluno:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor.' 
            });
        }
    }

}

module.exports = new ClassController()
