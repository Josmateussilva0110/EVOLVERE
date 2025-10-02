import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiBarChart2, FiTrendingUp, FiClock, FiUsers, FiBookOpen, FiRefreshCw, FiDownload, FiX, FiArrowLeft, FiSettings } from "react-icons/fi";

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
  const [turma, setTurma] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  const filtrosAtivos = useMemo(() => {
    return {
      turma: turma || null,
      periodo: periodo || null,
      busca: busca || null,
    };
  }, [turma, periodo, busca]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[0600#60] py-12 px-4">
      <div className="w-full max-w-7xl bg-white rounded-2xl p-6 md:p-8 shadow-xl ring-1 ring-gray-200 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
              >
                <FiArrowLeft /> Voltar
              </button>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Painel do Coordenador</h2>
            </div>
            <p className="text-sm text-gray-600">Acompanhe desempenho, engajamento e distribuições por curso e turma.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"><FiRefreshCw /> Atualizar</button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#060060] text-white px-3 py-2 text-sm hover:bg-[#0a0aa3]"><FiDownload /> Exportar</button>
            <button onClick={()=>navigate('/coordinator/settings')} className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"><FiSettings /> Configurações</button>
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-1">
              <select value={turma} onChange={(e)=>setTurma(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                <option value="">Turma</option>
                <option value="turmaA">Turma A</option>
                <option value="turmaB">Turma B</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-1">
              <select value={periodo} onChange={(e)=>setPeriodo(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                <option value="">Período</option>
                <option value="jan-jun">Jan - Jun</option>
                <option value="jul-dez">Jul - Dez</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
                <FiFilter className="text-gray-500 mr-2" />
                <input value={busca} onChange={(e)=>setBusca(e.target.value)} placeholder="Buscar por aluno/turma" className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400" />
                {busca && <button onClick={()=>setBusca("")} className="text-gray-400 hover:text-gray-600"><FiX /></button>}
              </div>
            </div>
          </div>
          <div className="xl:col-span-1">
            <div className="h-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 flex items-center gap-2">
              <FiBarChart2 className="text-gray-500" />
              Dados atualizados diariamente às 02:00.
            </div>
          </div>
        </div>

        {/* Chips de filtros ativos */}
        {(filtrosAtivos.turma || filtrosAtivos.periodo || filtrosAtivos.busca) && (
          <div className="flex flex-wrap items-center gap-2">
            {filtrosAtivos.turma && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-xs px-3 py-1">
                Turma: {turma}
                <button onClick={()=>setTurma("")} className="text-emerald-700 hover:text-emerald-900"><FiX /></button>
              </span>
            )}
            {filtrosAtivos.periodo && (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-xs px-3 py-1">
                Período: {periodo}
                <button onClick={()=>setPeriodo("")} className="text-amber-700 hover:text-amber-900"><FiX /></button>
              </span>
            )}
            {filtrosAtivos.busca && (
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-700 text-xs px-3 py-1">
                Busca: "{busca}"
                <button onClick={()=>setBusca("")} className="text-gray-600 hover:text-gray-800"><FiX /></button>
              </span>
            )}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Média geral</p>
              <p className="text-2xl font-extrabold text-gray-900">78%</p>
              <p className="text-xs text-emerald-600 inline-flex items-center gap-1"><FiTrendingUp /> +2.1% vs período anterior</p>
            </div>
            <div className="text-[#060060] text-2xl"><FiBarChart2 /></div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Tempo médio de estudo</p>
              <p className="text-2xl font-extrabold text-gray-900">1h 30m</p>
              <p className="text-xs text-gray-500">Dia útil</p>
            </div>
            <div className="text-[#060060] text-2xl"><FiClock /></div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Alunos ativos</p>
              <p className="text-2xl font-extrabold text-gray-900">1.248</p>
              <p className="text-xs text-gray-500">Últimos 7 dias</p>
            </div>
            <div className="text-[#060060] text-2xl"><FiUsers /></div>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Disciplinas</p>
              <p className="text-2xl font-extrabold text-gray-900">86</p>
              <p className="text-xs text-gray-500">Ativas neste período</p>
            </div>
            <div className="text-[#060060] text-2xl"><FiBookOpen /></div>
          </div>
        </div>

        {/* Gráficos e insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-2xl bg-white ring-1 ring-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-2">Evolução do desempenho</p>
            <div className="h-72 rounded-xl bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center text-gray-400">
              [Placeholder para gráfico de linha]
            </div>
          </div>
          <div className="xl:col-span-1 rounded-2xl bg-white ring-1 ring-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-2">Distribuição e comparação</p>
            <div className="space-y-3">
              <div className="h-28 rounded-xl bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center text-gray-400">[Gráfico de barras]</div>
              <div className="h-28 rounded-xl bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center text-gray-400">[Gráfico de pizza]</div>
            </div>
          </div>
        </div>

        {/* Atividades recentes e alertas */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-2xl bg-white ring-1 ring-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-700">Atividades recentes</p>
              <button className="text-xs text-gray-600 hover:text-gray-800">Ver todas</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-gray-500 px-3 py-1">Data</th>
                    <th className="text-left text-xs text-gray-500 px-3 py-1">Evento</th>
                    <th className="text-left text-xs text-gray-500 px-3 py-1">Responsável</th>
                    <th className="text-right text-xs text-gray-500 px-3 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {data: '2025-09-27 10:21', evento: 'Disciplina criada', resp: 'Coordenação', status: 'Concluído'},
                    {data: '2025-09-27 09:02', evento: 'Professor atribuído', resp: 'Coordenação', status: 'Concluído'},
                    {data: '2025-09-26 18:44', evento: 'Pedido de acesso', resp: 'Docente', status: 'Pendente'},
                  ].map((r, i) => (
                    <tr key={i} className="bg-white ring-1 ring-gray-200">
                      <td className="px-3 py-2 text-sm text-gray-700">{r.data}</td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">{r.evento}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{r.resp}</td>
                      <td className="px-3 py-2 text-sm text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${r.status === 'Concluído' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="xl:col-span-1 rounded-2xl bg-white ring-1 ring-gray-200 p-4">
            <p className="text-sm text-gray-700 mb-3">Insights</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="rounded-xl bg-gray-50 ring-1 ring-gray-200 px-3 py-2">Turmas noturnas tiveram +5% de média vs manhã.</li>
              <li className="rounded-xl bg-gray-50 ring-1 ring-gray-200 px-3 py-2">Maior engajamento em cursos de exatas nas últimas 2 semanas.</li>
              <li className="rounded-xl bg-gray-50 ring-1 ring-gray-200 px-3 py-2">3 disciplinas sem professor atribuído neste período.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceReports;
