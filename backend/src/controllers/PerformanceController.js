const Performance = require("../models/Performance"); // Importa o model

class PerformanceController {

    /**
     * @summary Busca os dados de desempenho (notas, médias) do aluno logado.
     */
    async getStudentPerformance(req, res) {
        try {
            // Pega o ID do aluno da sessão (mais seguro)
            const studentId = req.session.user?.id; // Ajuste se 'req.user.id' for o correto

            if (!studentId) {
                return res.status(401).json({ success: false, message: "Usuário não autenticado." });
            }
            
            // Chama o método do model para buscar e calcular os dados
            const report = await Performance.getStudentReport(studentId);

            res.status(200).json({ success: true, data: report });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: "Erro interno do servidor." });
        }
    }
}

module.exports = new PerformanceController();