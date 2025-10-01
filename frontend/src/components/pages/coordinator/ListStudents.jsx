import { useMemo, useState } from "react"
import { FaEye, FaTrash, FaArrowLeft } from "react-icons/fa"
import { FiSearch, FiUsers, FiUserCheck, FiPause, FiX } from "react-icons/fi"

/**
 * Componente principal de listagem de estudantes.
 * 
 * Permite:
 * - Buscar alunos por nome, e-mail ou turma
 * - Filtrar por turma e status
 * - Paginar resultados
 * - Excluir usuários da lista
 * - Voltar para a tela anterior
 */
function ListStudents() {
  // Estado da barra de busca
  const [busca, setBusca] = useState("")

  // Estado do filtro de turma
  const [turma, setTurma] = useState("")

  // Estado do filtro de status (Ativo/Inativo)
  const [status, setStatus] = useState("")

  // Estado da página atual da paginação
  const [pagina, setPagina] = useState(1)

  // Lista de opções de turmas
  const turmas = ["2022.1", "2022.2", "2023.1"]

  // Lista de opções de status
  const statusList = ["Ativo", "Inativo"]

  // Estado inicial da lista de usuários
  const [usuarios, setUsuarios] = useState([
    { nome: "Lucas", email: "lucasema@gmail.com", inicio: "2022.1", status: "Ativo" },
    { nome: "Maria", email: "maria@gmail.com", inicio: "2022.2", status: "Inativo" },
    { nome: "João", email: "joao@gmail.com", inicio: "2023.1", status: "Ativo" },
    { nome: "Ana", email: "ana@gmail.com", inicio: "2022.1", status: "Inativo" },
    { nome: "Pedro", email: "pedro@gmail.com", inicio: "2022.1", status: "Inativo" }
  ])

  // Estado para cadastro de novo usuário (não utilizado neste código ainda)
  const [novo, setNovo] = useState({ nome: "", email: "", inicio: "", status: "Ativo" })

  /**
   * Aplica filtros de busca, turma e status à lista de usuários.
   * 
   * @returns {Array} Lista de usuários filtrados
   */
  const usuariosFiltrados = usuarios.filter(u => {
    const buscaLower = busca.toLowerCase()

    // Busca por nome, email ou turma
    const matchBusca =
      u.nome.toLowerCase().includes(buscaLower) ||
      u.email.toLowerCase().includes(buscaLower) ||
      u.inicio.toLowerCase().includes(buscaLower)

    // Verifica filtro de turma
    const matchTurma = turma ? u.inicio === turma : true

    // Verifica filtro de status
    const matchStatus = status ? u.status === status : true

    return matchBusca && matchTurma && matchStatus
  })

  // Métricas derivadas para resumo visual
  const { totalRegistros, totalAtivos, totalInativos } = useMemo(() => {
    const total = usuariosFiltrados.length
    const ativos = usuariosFiltrados.filter(u => u.status === "Ativo").length
    return { totalRegistros: total, totalAtivos: ativos, totalInativos: total - ativos }
  }, [usuariosFiltrados])

  // Configuração da paginação
  const [itensPorPagina, setItensPorPagina] = useState(5)
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina)
  const inicioIndex = (pagina - 1) * itensPorPagina
  const usuariosPagina = usuariosFiltrados.slice(inicioIndex, inicioIndex + itensPorPagina)

  // Utilitários visuais
  const getInitials = (fullName) => {
    const parts = fullName.trim().split(" ")
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  const colorFromName = (name) => {
    const colors = [
      "bg-indigo-100 text-indigo-700 ring-indigo-200",
      "bg-blue-100 text-blue-700 ring-blue-200",
      "bg-emerald-100 text-emerald-700 ring-emerald-200",
      "bg-amber-100 text-amber-700 ring-amber-200",
      "bg-rose-100 text-rose-700 ring-rose-200",
      "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200",
    ]
    let sum = 0
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
    return colors[sum % colors.length]
  }

  /**
   * Reseta todos os filtros aplicados (busca, turma, status).
   */
  const handleLimparFiltros = () => {
    setBusca("")
    setTurma("")
    setStatus("")
    setPagina(1)
  }

  /**
   * Retorna para a página anterior do navegador.
   */
  const handleVoltar = () => {
    window.history.back()
  }

  /**
   * Exclui um usuário da lista de acordo com o índice.
   * 
   * @param {number} index - Índice do usuário na lista
   */
  const handleExcluir = (index) => {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      setUsuarios(usuarios.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="min-h-screen bg-[#060060] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl ring-1 ring-white/20 p-6 md:p-8">
          {/* Header com voltar e título + métricas */}
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={handleVoltar}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-[#060060] font-medium"
            >
              <FaArrowLeft /> Voltar
            </button>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-[#060060]/80 font-semibold">Administração</p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">Lista de Estudantes</h1>
              <p className="text-sm text-slate-600">Gerencie e visualize estudantes cadastrados.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Total</p>
                <p className="text-2xl font-extrabold text-slate-900">{totalRegistros}</p>
              </div>
              <div className="text-[#060060] text-2xl"><FiUsers /></div>
            </div>
            <div className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Ativos</p>
                <p className="text-2xl font-extrabold text-slate-900">{totalAtivos}</p>
              </div>
              <div className="text-slate-600 text-2xl"><FiUserCheck /></div>
            </div>
            <div className="rounded-2xl bg-amber-50/80 ring-1 ring-amber-200/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-700">Inativos</p>
                <p className="text-2xl font-extrabold text-amber-800">{totalInativos}</p>
              </div>
              <div className="text-amber-600 text-2xl"><FiPause /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl ring-1 ring-white/20 p-6 md:p-8">
          {/* Barra de busca */}
          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm">
            <span className="mr-2 text-slate-500"><FiSearch /></span>
            <input
              type="text"
              placeholder="Buscar nome, e-mail ou turma"
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
              value={busca}
              onChange={e => { setBusca(e.target.value); setPagina(1) }}
            />
            {busca && (
              <button onClick={() => setBusca("")} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"><FiX /> Limpar</button>
            )}
          </div>

          {/* Filtros */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select
              className="flex-1 min-w-[180px] rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700"
              value={turma}
              onChange={e => { setTurma(e.target.value); setPagina(1) }}
            >
              <option value="">Turma</option>
              {turmas.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>

            <select
              className="flex-1 min-w-[180px] rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700"
              value={status}
              onChange={e => { setStatus(e.target.value); setPagina(1) }}
            >
              <option value="">Status</option>
              {statusList.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={handleLimparFiltros}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg hover:from-amber-500 hover:to-yellow-600 transition transform hover:scale-105"
            >
              Limpar filtros
            </button>
          </div>

          {/* Chips de filtros ativos */}
          {(busca || turma || status) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {busca && (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 text-xs px-3 py-1">
                  Busca: "{busca}"
                  <button onClick={() => { setBusca(""); setPagina(1) }} className="text-slate-500 hover:text-slate-800"><FiX /></button>
                </span>
              )}
              {turma && (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 text-xs px-3 py-1">
                  Turma: {turma}
                  <button onClick={() => { setTurma(""); setPagina(1) }} className="text-slate-600 hover:text-slate-800"><FiX /></button>
                </span>
              )}
              {status && (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-xs px-3 py-1">
                  Status: {status}
                  <button onClick={() => { setStatus(""); setPagina(1) }} className="text-amber-700 hover:text-amber-900"><FiX /></button>
                </span>
              )}
            </div>
          )}

          {/* Caixa da tabela + paginação */}
          <div className="mt-6 overflow-x-auto bg-white shadow rounded-2xl ring-1 ring-slate-200">
            {usuariosFiltrados.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center ring-1 ring-slate-200 text-slate-500">
                  <FiSearch />
                </div>
                <p className="text-slate-900 font-semibold">Nenhum resultado encontrado</p>
                <p className="text-slate-600 text-sm mt-1">Ajuste os filtros ou tente outra busca.</p>
                <div className="mt-4">
                  <button onClick={handleLimparFiltros} className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 px-4 py-2 text-sm font-semibold shadow-lg hover:from-amber-500 hover:to-yellow-600 transition transform hover:scale-105">Limpar filtros</button>
                </div>
              </div>
            ) : (
              <>
                <table className="w-full border-separate border-spacing-y-1 text-slate-700">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">Aluno</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">E-mail</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">Início</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosPagina.map((u, i) => (
                      <tr key={i} className="bg-white hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-sm text-slate-900">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ${colorFromName(u.nome)}`}>
                              <span className="text-xs font-bold">{getInitials(u.nome)}</span>
                            </span>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{u.nome}</span>
                              <span className="text-[11px] text-slate-500">Turma {u.inicio}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                        <td className="px-4 py-3 text-sm">{u.inicio}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${
                              u.status === "Ativo"
                                ? "bg-slate-50 text-slate-700 ring-slate-200"
                                : "bg-amber-50 text-amber-700 ring-amber-200"
                            }`}
                          >
                            <span className={`h-2 w-2 rounded-full ${u.status === "Ativo" ? "bg-slate-500" : "bg-amber-500"}`}></span>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-3">
                            <button className="text-slate-500 hover:text-[#060060] text-base" title="Ver">
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleExcluir(i + inicioIndex)}
                              className="text-slate-500 hover:text-red-600 text-base"
                              title="Excluir"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Linha + paginação dentro da caixa */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t px-3 py-2">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-500">Página {pagina} de {totalPaginas || 1}</p>
                    <div className="inline-flex items-center gap-2 text-xs text-slate-600">
                      <span>Itens por página</span>
                      <select value={itensPorPagina} onChange={(e)=>{ setItensPorPagina(Number(e.target.value)); setPagina(1) }} className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={pagina === 1}
                      onClick={() => setPagina(pagina - 1)}
                      className={`px-3 py-2 text-sm rounded-lg ring-1 ${
                        pagina === 1 ? "text-slate-300 ring-slate-200 cursor-not-allowed" : "text-slate-700 ring-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      Anterior
                    </button>
                    <span className="px-3 py-2 bg-[#060060] text-white rounded-lg font-semibold text-sm">
                      {pagina}
                    </span>
                    <button
                      disabled={pagina === totalPaginas || totalPaginas === 0}
                      onClick={() => setPagina(pagina + 1)}
                      className={`px-3 py-2 text-sm rounded-lg ring-1 ${
                        pagina === totalPaginas || totalPaginas === 0
                          ? "text-slate-300 ring-slate-200 cursor-not-allowed"
                          : "text-slate-700 ring-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListStudents