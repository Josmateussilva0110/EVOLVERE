const Subject = require('../models/Subject');
const validator = require('validator');

/**
 * Controlador para gerir as operações CRUD de disciplinas.
 * @class
 */
const subjectController = {
    /**
     * @summary Lista todas as disciplinas.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "subjects": [
     * { "id": 1, "name": "Cálculo I", "professor_nome": "Ana Silva", "curso_nome": "Engenharia Civil" }
     * ]
     * }
     */
    async list(req, res) {
        try {
            const subjects = await Subject.getAll();
            
            if (!subjects) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Nenhuma disciplina encontrada' 
                });
            }
            
            res.status(200).json({ 
                status: true, 
                subjects 
            });
        } catch (error) {
            console.error('Erro ao listar disciplinas:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    /**
     * @summary Cria uma nova disciplina.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // Corpo da requisição (Body):
     * {
     * "name": "Álgebra Linear",
     * "professional_id": 5,
     * "course_valid_id": 2
     * }
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "message": "Disciplina criada com sucesso",
     * "data": { "id": 3, "name": "Álgebra Linear", ... }
     * }
     */
    async create(req, res) {
        try {
            const { name, professional_id, course_valid_id } = req.body;
            
            if (!name || !professional_id || !course_valid_id) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Todos os campos são obrigatórios' 
                });
            }
            
            const subject = await Subject.create({
                name,
                professional_id: parseInt(professional_id),
                course_valid_id: parseInt(course_valid_id)
            });
            
            if (!subject) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Erro ao criar disciplina' 
                });
            }
            
            res.status(201).json({ 
                status: true, 
                message: 'Disciplina criada com sucesso',
                data: subject 
            });
        } catch (error) {
            console.error('Erro ao criar disciplina:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    /**
     * @summary Obtém uma disciplina específica pelo seu ID.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // GET /api/subjects/1
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "data": { "id": 1, "name": "Cálculo I", "professor_nome": "Ana Silva", ... }
     * }
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!validator.isInt(id + '', { min: 1 })) {
                return res.status(422).json({ status: false, message: "ID inválido." });
            }

            const subject = await Subject.getById(parseInt(id));
            
            if (!subject) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Disciplina não encontrada' 
                });
            }
            
            res.json({ 
                status: true, 
                data: subject 
            });
        } catch (error) {
            console.error('Erro ao buscar disciplina:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    /**
     * @summary Atualiza os dados de uma disciplina.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // PUT /api/subjects/1
     * // Corpo da requisição (Body): { "name": "Cálculo I Avançado" }
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "message": "Disciplina atualizada com sucesso",
     * "data": { "id": 1, "name": "Cálculo I Avançado", ... }
     * }
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!validator.isInt(id + '', { min: 1 })) {
                return res.status(422).json({ status: false, message: "ID inválido." });
            }

            const subject = await Subject.update(parseInt(id), req.body);
            
            if (!subject) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Disciplina não encontrada' 
                });
            }
            
            res.json({ 
                status: true, 
                message: 'Disciplina atualizada com sucesso',
                data: subject 
            });
        } catch (error) {
            console.error('Erro ao atualizar disciplina:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    /**
     * @summary Apaga uma disciplina.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // DELETE /api/subjects/1
     * // Resposta de sucesso:
     * {
     * "status": true,
     * "message": "Disciplina excluída com sucesso."
     * }
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!validator.isInt(id + '', { min: 1 })) {
                return res.status(422).json({ status: false, message: "ID inválido." });
            }

            const deleted = await Subject.delete(parseInt(id));
            
            if (!deleted) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Disciplina não encontrada' 
                });
            }
            
            res.status(200).json({status: true, message: "Disciplina excluída com sucesso."});
        } catch (error) {
            console.error('Erro ao excluir disciplina:', error);
            res.status(500).json({ 
                status: false, 
                message: 'Erro interno do servidor' 
            });
        }
    }
};

module.exports = subjectController;

