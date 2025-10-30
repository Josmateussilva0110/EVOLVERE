const express = require('express');
const router = express.Router();

const ClassController = require("../controllers/classController"); 

// Middleware para checar se está logado (exemplo)
// Se você já tem um middleware que checa 'req.session.user', 
// pode adicioná-lo aqui para proteger a rota.
// const authMiddleware = require('../middleware/auth'); 
// router.use(authMiddleware); 

/**
 * @route GET /dashboard/student
 * @description Rota para buscar os dados do dashboard do aluno logado.
 * @access Privada (requer login/sessão)
 */
router.get(
    '/dashboard/student', 
   ClassController.getStudentDashboard
);

module.exports = router;