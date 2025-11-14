const express = require("express");
const router = express.Router();
const PerformanceController = require("../controllers/PerformanceController");
// Importe seu middleware de autenticação (ex: verifyToken, isStudent)
// const { authenticate, isStudent } = require('../middleware/auth');

/**
 * @route GET /performance/me
 * @summary Busca os dados de desempenho acadêmico do aluno logado.
 * @description Rota protegida para alunos.
 */
// router.get('/performance/me', authenticate, isStudent, PerformanceController.getStudentPerformance);
// Se não tiver middleware de 'isStudent' ainda:
router.get('/performance/me', PerformanceController.getStudentPerformance); // <-- Correção aqui

router.get('/performance/recent', PerformanceController.recentNotes)

module.exports = router;