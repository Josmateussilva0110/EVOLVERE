// Dentro do seu EnrollmentController.js

const knex = require("../database/connection");
const Invite = require("../models/Invite");

class EnrollmentController {

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
            res.status(200).json({
                success: true,
                message: `Matrícula na turma ${classInfo?.name || ''} realizada com sucesso!`,
                data: { classId: classId, className: classInfo?.name }
            });

        } catch (error) {
            console.error('Erro ao entrar na turma com código:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
        }
    }
}

module.exports = new EnrollmentController();