import { Eye, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { useState } from "react"

const simuladosMock = [
  {
    nome: "Prova Ed1",
    disciplina: "Estrutura de dados",
    status: "Corrigido"
  },
  {
    nome: "Laços de repetições",
    disciplina: "Algoritmos 1",
    status: "Pendente"
  },
  {
    nome: "Funções",
    disciplina: "Algoritmos 1",
    status: "Corrigido"
  },
  {
    nome: "Vetores",
    disciplina: "Estrutura de dados",
    status: "Pendente"
  },
  {
    nome: "Recursividade",
    disciplina: "Algoritmos 2",
    status: "Corrigido"
  }
]

export default function SimuladosList() {
  const [simulados] = useState(simuladosMock)
  const [filtroDisciplina, setFiltroDisciplina] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 4

  // Filtro simples (mock)
  const simuladosFiltrados = simulados.filter(s =>
    (!filtroDisciplina || s.disciplina.toLowerCase().includes(filtroDisciplina.toLowerCase())) &&
    (!filtroStatus || s.status.toLowerCase().includes(filtroStatus.toLowerCase()))
  )

  const totalPages = Math.ceil(simuladosFiltrados.length / ITEMS_PER_PAGE)
  const pageSimulados = simuladosFiltrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const limparFiltros = () => {
    setFiltroDisciplina("")
    setFiltroStatus("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060060] via-[#060060] to-[#121282] flex items-center justify-center py-6 px-2 relative">
      {/* Fundo decorativo */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[38rem] h-[38rem] bg-yellow-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl bg-white/95 rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 sm:p-16 relative flex flex-col items-center mb-16">
        <h1 className="text-4xl font-extrabold text-[#060060] text-center mb-10 tracking-tight drop-shadow-lg">
          <span className="inline-flex items-center gap-2 px-6 py-5 rounded-3xl bg-gradient-to-r ext-[#060060]">
            <span className="text-3xl">🏆</span> Simulados
          </span>
        </h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-6 items-center justify-center mb-12 w-full">
          <input
            type="text"
            placeholder="Disciplinas"
            className="border border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-300 outline-none w-56 shadow transition text-base"
            value={filtroDisciplina}
            onChange={e => setFiltroDisciplina(e.target.value)}
          />
          <select
            className="border border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-300 outline-none w-56 shadow transition text-base"
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Corrigido">Corrigido</option>
            <option value="Pendente">Pendente</option>
          </select>
          <button
            className="bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-[#060060] font-bold px-8 py-3 rounded-xl shadow transition-all border border-yellow-200 text-base"
            onClick={limparFiltros}
          >
            Limpar filtros
          </button>
        </div>

        {/* Cards de Simulados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full">
          {pageSimulados.length === 0 && (
            <div className="col-span-2 text-center text-gray-300 py-16 text-xl">
              Nenhum simulado encontrado.
            </div>
          )}
          {pageSimulados.map((sim, idx) => (
            <div
              key={sim.nome}
              className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100 rounded-2xl shadow-lg p-7 flex flex-col gap-4 hover:scale-[1.015] hover:shadow-2xl transition group"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-blue-200 rounded-full p-4 shadow">
                  <BookOpen className="w-10 h-10 text-blue-700" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#060060]">{sim.nome}</div>
                  <div className="text-sm text-blue-900/80">{sim.disciplina}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                {sim.status === "Corrigido" ? (
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-green-500/90 text-white text-sm font-bold shadow">
                    <span className="text-lg">✔️</span> Corrigido
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-yellow-300/90 text-[#060060] text-sm font-bold shadow">
                    <span className="text-lg">⏳</span> Pendente
                  </span>
                )}
                <button className="ml-auto p-2 hover:bg-blue-200 rounded-full transition group" title="Visualizar">
                  <Eye className="w-7 h-7 text-[#060060] group-hover:scale-110 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-end w-full mt-2 gap-2 items-center">
            <button
              className="p-2 rounded-full hover:bg-[#060060]/10 transition disabled:opacity-40"
              onClick={() => setPage(page => Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-7 h-7 text-[#060060]" />
            </button>
            <span className="inline-flex items-center gap-1 px-5 py-2 rounded-full bg-[#060060] text-white text-lg font-bold select-none shadow border-2 border-white">
              {page}
            </span>
            <button
              className="p-2 rounded-full hover:bg-[#060060]/10 transition disabled:opacity-40"
              onClick={() => setPage(page => Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              aria-label="Próxima página"
            >
              <ChevronRight className="w-7 h-7 text-[#060060]" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}