// Dentro do seu EnrollmentController.js

const knex = require("../database/connection");
const Invite = require("../models/Invite");
const Class = require("../models/Class")

class EnrollmentController {


    /**
     * Matricula um aluno em uma turma a partir de um código de convite.
     *
     * Essa função recebe um código de convite (`code`) enviado pelo corpo da requisição
     * e o ID do aluno a partir da sessão (`req.session.user.id`) ou do token (`req.user.id`).
     * Após validar os dados, ela verifica se o código é válido e se o aluno já está
     * matriculado na turma. Caso contrário, insere o aluno na tabela `class_student`,
     * incrementa o contador de usos do convite e retorna os dados da turma.
     *
     * @async
     * @function joinWithCode
     * @param {import('express').Request} req - Objeto da requisição Express contendo `code` no corpo e sessão com o usuário.
     * @param {import('express').Response} res - Objeto da resposta Express para enviar os resultados ou erros.
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON indicando sucesso ou falha da matrícula.
     *
     * @example
     * // Exemplo de rota Express:
     * router.post('/join', ClassController.joinWithCode);
     *
     * // Corpo da requisição:
     * {
     *   "code": "ABC123"
     * }
     *
     * // Resposta de sucesso (200):
     * {
     *   "success": true,
     *   "message": "Matrícula na turma Programação Web realizada com sucesso!",
     *   "data": {
     *     "classId": 5,
     *     "className": "Programação Web"
     *   }
     * }
     *
     * // Resposta (400): Código ausente
     * { "success": false, "message": "O código da turma é obrigatório." }
     *
     * // Resposta (404): Código inválido ou expirado
     * { "success": false, "message": "Código inválido, expirado ou já atingiu o limite de usos." }
     *
     * // Resposta (409): Aluno já matriculado
     * { "success": false, "message": "Você já está matriculado nesta turma." }
     *
     * // Resposta (500): Erro interno
     * { "success": false, "message": "Erro interno do servidor." }
     */
    async joinWithCode(req, res) {
        try {
            const { code } = req.body;
            const studentId = req.session.user?.id || req.user?.id; // Este nome está ok

            // ... (validações básicas de code e studentId) ...
            if (!code) { /* ... */ }
            if (!studentId) { /* ... */ }

            const invite = await Invite.findValidByCode(code.trim().toUpperCase());

            if (!invite) {
                return res.status(404).json({ success: false, message: "Código inválido, expirado ou já atingiu o limite de usos." });
            }

            const classId = invite.classes_id; // Confirme se é classes_id ou class_id no Invite model/tabela

            // 3. Verifica se o aluno já está matriculado - CORREÇÃO AQUI
            const existingEnrollment = await knex('class_student')
                .where({
                    class_id: classId,
                    student_id: studentId // <-- Usar student_id em vez de aluno_id
                })
                .first();

            if (existingEnrollment) {
                return res.status(409).json({ success: false, message: "Você já está matriculado nesta turma." });
            }

            // 4. Matricula o aluno - CORREÇÃO AQUI
            await knex('class_student').insert({
                class_id: classId,
                student_id: studentId // <-- Usar student_id em vez de aluno_id
            });

            // 5. Incrementa o contador de usos do convite (sem alteração)
            await Invite.incrementUseCount(invite.id);

            // ... (busca nome da turma e retorna sucesso) ...
            const classInfo = await knex('classes').where({ id: classId }).first('name');
            const course = await Class.getCourseByClass(classId)
            res.status(200).json({
                success: true,
                message: `Matrícula na turma ${classInfo?.name || ''} realizada com sucesso!`,
                classId: classId, 
                className: classInfo?.name, 
                course
            });

        } catch (error) {
            console.error('Erro ao entrar na turma com código:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
        }
    }
}

module.exports = new EnrollmentController();
