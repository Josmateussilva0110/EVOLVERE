const Class = require('../models/Class');
const validator = require('validator');
const crypto = require('crypto');
const knex = require("../database/connection"); 


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
            const { name, period, subject_id, course_id, capacity } = req.body;

            // Adicionando 'capacity' na validação
            if (!name || !period || !subject_id || !course_id || !capacity) {
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
                capacity: parseInt(capacity)
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
            console.log(subject_id)

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
     * @summary Remove um aluno de uma turma.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // DELETE /api/classes/1/students/10
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "message": "Aluno removido da turma com sucesso."
     * }
     */
    async removeStudent(req, res) {
        try {
            const { id, studentId } = req.params;

            if (!validator.isInt(id + '', { min: 1 }) || !validator.isInt(studentId + '', { min: 1 })) {
                return res.status(422).json({ status: false, message: "IDs da turma e do aluno devem ser válidos." });
            }

            const success = await Class.removeStudent(Number(id), Number(studentId));

            if (!success) {
                return res.status(404).json({ status: false, message: 'Associação entre aluno e turma não encontrada.' });
            }

            res.status(200).json({
                status: true,
                message: 'Aluno removido da turma com sucesso.'
            });

        } catch (error) {
            console.error('Erro ao remover aluno da turma:', error);
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
                const existingCode = await knex('classes_invites').where({ code: inviteCode }).first();
                if (!existingCode) isCodeUnique = true;
            }
            
            // 4. Salvar no banco (lógica sem alteração)
            const [newInvite] = await knex('classes_invites')
                .insert({
                    code: inviteCode,
                    classes_id: parseInt(classId),
                    expires_at: expirationDate,
                    max_uses: dbMaxUses
                })
                .returning('*');
            
            const responseData = {
                code: newInvite.code, // <-- Enviamos o código
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

}

module.exports = new ClassController();