const Subject = require('../models/Subject');
const validator = require('validator');

/**
 * Controlador para gerir as operações CRUD de disciplinas.
 */
const subjectController = {
    /**
     * @summary Lista todas as disciplinas com informações adicionais.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // Resposta de sucesso:
     * {
     * "success": true,
     * "data": {
     * "subjects": [
     * { "id": 1, "name": "Cálculo I", "professor_nome": "Ana Silva", "curso_nome": "Engenharia Civil" }
     * ]
     * }
     * }
     */
    async list(req, res) {
        try {
            const subjects = await Subject.getAll();
            
            if (!subjects) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Nenhuma disciplina encontrada' 
                });
            }
            
            res.status(200).json({ 
                success: true, 
                data: { subjects } 
            });
        } catch (error) {
            console.error('Erro ao listar disciplinas:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    /**
     * @summary Cria uma nova disciplina após validar os dados de entrada.
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
     * "success": true,
     * "message": "Disciplina criada com sucesso",
     * "data": { "subject": { "id": 3, "name": "Álgebra Linear", ... } }
     * }
     */
    async create(req, res) {
        const { name, professional_id, course_valid_id } = req.body;
        const errors = [];

        // --- BLOCO DE VALIDAÇÃO ---
        if (!name || validator.isEmpty(name, { ignore_whitespace: true })) {
            errors.push("O nome da disciplina é obrigatório.");
        } else if (!validator.isLength(name, { min: 3, max: 100 })) {
            errors.push("O nome da disciplina deve ter entre 3 e 100 caracteres.");
        }

        if (!professional_id || !validator.isInt(String(professional_id), { min: 1 })) {
            errors.push("O ID do professor é inválido.");
        }

        if (!course_valid_id || !validator.isInt(String(course_valid_id), { min: 1 })) {
            errors.push("O ID do curso é inválido.");
        }
        
        if (errors.length > 0) {
            return res.status(422).json({ success: false, errors: errors });
        }
        // --- FIM DA VALIDAÇÃO ---
        
        try {
            // Sanitiza o nome para remover caracteres perigosos antes de salvar
            const sanitizedName = validator.escape(name.trim());

            const subject = await Subject.create({
                name: sanitizedName,
                professional_id: parseInt(professional_id),
                course_valid_id: parseInt(course_valid_id)
            });
            
            res.status(201).json({ 
                success: true, 
                message: 'Disciplina criada com sucesso',
                data: { subject } 
            });
        } catch (error) {
            console.error('Erro ao criar disciplina:', error);
            res.status(500).json({ 
                success: false, 
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
     * "success": true,
     * "data": { "subject": { "id": 1, "name": "Cálculo I", "professor_nome": "Ana Silva", ... } }
     * }
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            // ... sua validação de ID ...

            // Use o novo método que busca com os dados do curso
            const subjectDetails = await Subject.findByIdWithCourse(Number(id));

            if (!subjectDetails) {
                return res.status(404).json({ status: false, message: 'Disciplina não encontrada.' });
            }
            
            // Agora a resposta inclui os dados do curso
            res.status(200).json({
                status: true,
                data: subjectDetails 
            });

        } catch (error) {
            console.error('Erro ao buscar disciplina:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    /**
     * @summary Atualiza os dados de uma disciplina após validar os dados.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // PUT /api/subjects/1
     * // Corpo da requisição (Body): { "name": "Cálculo I Avançado" }
     * // Resposta de sucesso:
     * {
     * "success": true,
     * "message": "Disciplina atualizada com sucesso",
     * "data": { "subject": { "id": 1, "name": "Cálculo I Avançado", ... } }
     * }
     */
    async update(req, res) {
        const { id } = req.params;
        const { name, professional_id, course_valid_id } = req.body;
        const errors = [];
        const dataToUpdate = {};

        // --- BLOCO DE VALIDAÇÃO ---
        if (!validator.isInt(String(id), { min: 1 })) {
            return res.status(422).json({ success: false, message: "ID da disciplina é inválido." });
        }

        // Valida o nome, se ele foi enviado
        if (name !== undefined) {
            if (validator.isEmpty(name, { ignore_whitespace: true })) {
                errors.push("O nome da disciplina não pode ser vazio.");
            } else if (!validator.isLength(name, { min: 3, max: 100 })) {
                errors.push("O nome da disciplina deve ter entre 3 e 100 caracteres.");
            } else {
                dataToUpdate.name = validator.escape(name.trim());
            }
        }
        
        // Valida o ID do professor, se ele foi enviado
        if (professional_id !== undefined) {
            if (!validator.isInt(String(professional_id), { min: 1 })) {
                errors.push("O ID do professor é inválido.");
            } else {
                dataToUpdate.professional_id = parseInt(professional_id);
            }
        }

        // (Opcional) Adicione validação para course_valid_id se ele puder ser atualizado
        if (course_valid_id !== undefined) {
             if (!validator.isInt(String(course_valid_id), { min: 1 })) {
                errors.push("O ID do curso é inválido.");
            } else {
                dataToUpdate.course_valid_id = parseInt(course_valid_id);
            }
        }
        
        if (errors.length > 0) {
            return res.status(422).json({ success: false, errors: errors });
        }
        // --- FIM DA VALIDAÇÃO ---

        try {
            const subject = await Subject.update(parseInt(id), dataToUpdate);
            
            if (!subject) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Disciplina não encontrada para atualizar' 
                });
            }
            
            res.json({ 
                success: true, 
                message: 'Disciplina atualizada com sucesso',
                data: { subject }
            });
        } catch (error) {
            console.error('Erro ao atualizar disciplina:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    /**
     * @summary Apaga uma disciplina pelo seu ID.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     * @example
     * // DELETE /api/subjects/1
     * // Resposta de sucesso:
     * {
     * "success": true,
     * "message": "Disciplina excluída com sucesso."
     * }
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!validator.isInt(String(id), { min: 1 })) {
                return res.status(422).json({ success: false, message: "ID inválido." });
            }

            const deleted = await Subject.delete(parseInt(id));
            
            if (!deleted) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Disciplina não encontrada para excluir' 
                });
            }
            
            res.status(200).json({success: true, message: "Disciplina excluída com sucesso."});
        } catch (error) {
            console.error('Erro ao excluir disciplina:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },
        /**
     * @summary Obtém todos os dados de uma disciplina para a tela de gerenciamento do coordenador.
     * @description Retorna os detalhes da disciplina, a lista de materiais globais e a lista de turmas com a contagem de alunos.
     * @param {import("express").Request} req - O objeto da requisição Express.
     * @param {import("express").Response} res - O objeto da resposta Express.
     * @returns {Promise<void>}
     */
    async getScreenDetails(req, res) {
        try {
            const { id } = req.params;
            // Assumindo que um middleware de autenticação anexa o usuário em req.user
            const coordinator = req.user; 

            if (!coordinator) {
                return res.status(401).json({ success: false, message: "Acesso não autorizado. Faça login novamente." });
            }

            if (!validator.isInt(String(id), { min: 1 })) {
                return res.status(422).json({ success: false, message: "ID da disciplina é inválido." });
            }

            // --- 1. Checagem de Permissão ---
            const hasPermission = await Subject.isCoordinatorOfSubject(Number(id), coordinator.id);
            if (!hasPermission) {
                return res.status(403).json({ success: false, message: "Você não tem permissão para acessar os detalhes desta disciplina." });
            }

            // --- 2. Busca dos Dados ---
            const details = await Subject.findScreenDetailsById(Number(id));

            if (!details) {
                return res.status(404).json({ success: false, message: 'Disciplina não encontrada.' });
            }
            
            res.status(200).json({ success: true, data: details });

        } catch (error) {
            console.error('Erro ao buscar detalhes da disciplina para a tela:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }
    },

    
};

module.exports = subjectController;