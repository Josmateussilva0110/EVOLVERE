const express = require("express");
const router = express.Router();
const EnrollmentController = require("../controllers/EnrollmentController");
// Importe seu middleware de autenticação/verificação se o usuário é aluno
// const { authenticate, isStudent } = require('../middleware/auth'); 

/**
 * @route POST /enrollments/join-with-code
 * @summary Matricula o aluno logado em uma turma usando um código de convite.
 */
// router.post('/enrollments/join-with-code', authenticate, isStudent, EnrollmentController.joinWithCode);
// Se não tiver middleware ainda:
router.post('/enrollments/join-with-code', EnrollmentController.joinWithCode);

module.exports = router;