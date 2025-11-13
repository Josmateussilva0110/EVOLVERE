const knex = require("../database/connection"); // Ajuste o caminho se necessário

class Performance {

    /**
     * Busca e calcula todos os dados de desempenho para um aluno.
     * @param {number} studentId - O ID do aluno (da tabela 'users').
     * @returns {Promise<Object>} Um objeto contendo { overallAverage, bestGrade, disciplines }
     */
    static async getStudentReport(studentId) {
        try {
            // Consulta 1: Calcula a Média Geral (Esta consulta está correta e não muda)
            const overallAverageQuery = knex('results_form')
                .where({ student_id: studentId })
                .avg('points as average')
                .first();

            // Consulta 2: Calcula a média por disciplina
            const subjectGradesQuery = knex('results_form as rf')
                .leftJoin('form as f', 'rf.form_id', 'f.id') 
                .leftJoin('subjects as s', 'f.subject_id', 's.id')
                .where('rf.student_id', studentId)
                .groupBy('s.id', 's.name') 
                .select(
                    knex.raw('COALESCE(s.name, ?) as "subjectName"', ['Disciplina Desconhecida']),
                    knex.raw('AVG(rf.points) as "averageGrade"')
                );

            // --- CORREÇÃO: NOVA CONSULTA ---
            // Consulta 3: Busca a melhor nota individual e o nome da disciplina associada
            const bestGradeQuery = knex('results_form as rf')
                .leftJoin('form as f', 'rf.form_id', 'f.id')
                .leftJoin('subjects as s', 'f.subject_id', 's.id')
                .where('rf.student_id', studentId)
                .orderBy('rf.points', 'desc') // Ordena pela nota individual
                .select(
                    'rf.points as grade',
                    's.name as subjectName'
                )
                .first(); // Pega apenas a maior
            // --- FIM DA CORREÇÃO ---

            // Executa as TRÊS consultas em paralelo
            const [overallResult, subjectGrades, bestGradeResult] = await Promise.all([
                overallAverageQuery,
                subjectGradesQuery,
                bestGradeQuery // Adiciona a nova consulta
            ]);

            // --- Processamento dos Dados ---

            // 1. Média Geral
            const overallAverage = Number(overallResult?.average || 0).toFixed(1);

            // 2. Lista de Disciplinas
            const disciplines = subjectGrades.map(d => ({
                name: d.subjectName,
                grade: Number(d.averageGrade || 0).toFixed(1)
            })).sort((a, b) => parseFloat(b.grade) - parseFloat(a.grade));

            // 3. Melhor Nota (Agora usa o resultado da Consulta 3)
            const bestGrade = bestGradeResult 
                ? { 
                    name: bestGradeResult.subjectName || 'Disciplina Desconhecida', 
                    grade: Number(bestGradeResult.grade || 0).toFixed(1) 
                  }
                : { name: "N/A", grade: "0.0" };
            
            return {
                overallAverage,
                bestGrade,
                disciplines
            };

        } catch (error) {
            console.error("Erro ao buscar relatório de desempenho:", error);
            throw new Error("Falha ao buscar dados de desempenho.");
        }
    }
}

module.exports = Performance;