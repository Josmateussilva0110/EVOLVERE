import { useState } from "react";

/**
 * Componente PerformanceReports
 * 
 * Exibe o painel de Relatórios de Desempenho com filtros de Curso, Turma e Período,
 * além de métricas como média da turma, tempo médio de estudo, evolução do desempenho
 * e gráficos de distribuição de notas e comparação entre turmas.
 * 
 * @component
 */
function PerformanceReports() {
  const [curso, setCurso] = useState("");
  const [turma, setTurma] = useState("");
  const [periodo, setPeriodo] = useState("");

  return (
    <div className="min-h-[550px] flex flex-col items-center justify-start bg-[#060060] pt-1 py-20">
      {/* Container principal */}
      <div className="w-full max-w-6xl bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-6">
        {/* Título */}
        <h2 className="text-[#1B1464] font-bold text-xl">Relatórios de Desempenho</h2>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <select
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Curso</option>
            <option value="curso1">Curso 1</option>
            <option value="curso2">Curso 2</option>
          </select>
          <select
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Turma</option>
            <option value="turmaA">Turma A</option>
            <option value="turmaB">Turma B</option>
          </select>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Período</option>
            <option value="jan-jun">Jan - Jun</option>
            <option value="jul-dez">Jul - Dez</option>
          </select>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow flex flex-col items-center">
            <p className="text-gray-600 mb-2">Média geral da turma</p>
            <p className="text-3xl font-bold text-[#1B1464]">78%</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow flex flex-col items-center">
            <p className="text-gray-600 mb-2">Tempo médio de estudo</p>
            <p className="text-3xl font-bold text-[#1B1464]">1h 30min</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Evolução do Desempenho */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <p className="text-gray-600 mb-2">Evolução do Desempenho</p>
            <div className="h-40 flex items-center justify-center text-gray-400">
              {/* Aqui você pode integrar Chart.js ou outra lib */}
              [Gráfico de linha]
            </div>
          </div>

          {/* Distribuição de notas */}
          <div className="bg-gray-100 p-4 rounded-lg shadow flex flex-col gap-4">
            <div>
              <p className="text-gray-600 mb-2">Distribuição de Notas</p>
              <div className="h-24 flex items-center justify-center text-gray-400">
                [Gráfico de barras]
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Comparação entre Turmas</p>
              <div className="h-24 flex items-center justify-center text-gray-400">
                [Gráfico de pizza]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceReports;
