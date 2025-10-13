const Class = require('../models/Class');
const validator = require('validator');

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
            console.log(name)
            console.log(period)
            console.log(subject_id)
            console.log(course_id)
            console.log(capacity)

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

            res.status(201).json({
                status: true,
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
            const { subjectId } = req.params;

            if (!validator.isInt(subjectId + '', { min: 1 })) {
                return res.status(422).json({ status: false, message: "ID da disciplina inválido." });
            }

            const classes = await Class.findBySubjectId(Number(subjectId));

            if (!classes) {
                return res.status(500).json({ status: false, message: 'Ocorreu um erro ao buscar as turmas.' });
            }

            res.status(200).json({
                status: true,
                data: classes
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
}

module.exports = new ClassController();

