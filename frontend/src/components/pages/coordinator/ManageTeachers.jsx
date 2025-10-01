import { useState, useEffect, useContext, useMemo } from "react";
import { FiArrowLeft, FiSearch, FiEdit2, FiTrash2, FiUsers, FiUserCheck, FiPause, FiX } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import requestData from "../../../utils/requestApi";
import { Context } from "../../../context/UserContext"
import useFlashMessage from "../../../hooks/useFlashMessage";

/**
 * Componente de gerenciamento de professores.
 * Exibe uma tabela com os professores e suas disciplinas,
 * incluindo busca, ações de editar e excluir, e botão de voltar.
 *
 * @component
 * @example
 * return <ProfessoresManagement />
 */
function ProfessoresManagement() {
  /**
   * Estado que armazena o valor do campo de busca.
   * @type {[string, Function]}
   */
  const [search, setSearch] = useState("")
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(8)
  const { setFlashMessage } = useFlashMessage()
  const { user } = useContext(Context)

  useEffect(() => {
    async function fetchTeachers() {
      const response = await requestData(`/user/teachers/${user.id}`, 'GET', {}, true) 
      if(response.success) {
        setTeachers(response.data.teachers)
      }
    }
    if (user) {
      fetchTeachers()
    }
  }, [user])


  /**
   * Filtra a lista de professores com base no termo de busca.
   * Inclui busca pelo nome ou disciplina do professor.
   */
  const filterTeacher = useMemo(() => {
    return teachers.filter(
      (prof) =>
        (prof?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (prof?.disciplina ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [teachers, search]);

  const showCourseColumn = user?.id >= 1 && user?.id <= 4

  // Configuração da paginação
  const totalPaginas = Math.ceil(filterTeacher.length / itensPorPagina)
  const inicioIndex = (pagina - 1) * itensPorPagina
  const professoresPagina = filterTeacher.slice(inicioIndex, inicioIndex + itensPorPagina)

  // Métricas para cards de resumo
  const { total, comDisciplina, semDisciplina } = useMemo(() => {
    const t = teachers.length
    const c = teachers.filter(p => Boolean(p.disciplina)).length
    return { total: t, comDisciplina: c, semDisciplina: t - c }
  }, [teachers])

  // Utilitários visuais
  const getInitials = (text = '') => {
    const cleaned = String(text).trim()
    if (!cleaned) return 'NA'
    const parts = cleaned.split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  
  const colorFromString = (str = '') => {
    const palette = [
      'bg-indigo-100 text-indigo-700 ring-indigo-200',
      'bg-sky-100 text-sky-700 ring-sky-200',
      'bg-emerald-100 text-emerald-700 ring-emerald-200',
      'bg-amber-100 text-amber-700 ring-amber-200',
      'bg-rose-100 text-rose-700 ring-rose-200',
      'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200',
    ]
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i)
    const idx = Math.abs(hash) % palette.length
    return palette[idx]
  }


  /**
   * Função para voltar à página anterior no histórico do navegador.
   */
  const handleVoltar = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060060] flex items-center justify-center">
        <div className="inline-flex items-center gap-3 text-white/80 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl">
          <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
          <span className="font-medium">Carregando professores...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060060] flex items-center justify-center p-6">
        <div className="max-w-lg w-full mx-auto bg-white/95 backdrop-blur-sm ring-1 ring-red-200/50 rounded-3xl p-6 text-red-700 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <FiPause className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-lg">Não foi possível carregar os dados</p>
              <p className="text-sm mt-1 text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060060] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl ring-1 ring-white/20 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={handleVoltar}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-[#060060] font-medium"
            >
              <FiArrowLeft /> Voltar
            </button>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-[#060060]/80 font-semibold">Administração</p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">Gerenciar Professores</h1>
              <p className="text-sm text-slate-600">Buscar, editar e remover docentes.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200/50 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600">Total</p>
                    <p className="text-2xl font-extrabold text-slate-900">{total}</p>
                  </div>
                  <div className="text-[#060060] text-2xl"><FiUsers /></div>
                </div>
                <div className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200/50 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600">Com disciplina</p>
                    <p className="text-2xl font-extrabold text-slate-900">{comDisciplina}</p>
                  </div>
                  <div className="text-slate-600 text-2xl"><FiUserCheck /></div>
                </div>
                <div className="rounded-2xl bg-amber-50/80 ring-1 ring-amber-200/50 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-700">Sem disciplina</p>
                    <p className="text-2xl font-extrabold text-amber-800">{semDisciplina}</p>
                  </div>
                  <div className="text-amber-600 text-2xl"><FiPause /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl ring-1 ring-white/20 p-6 md:p-8">
          {/* Campo de busca */}
          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm">
            <span className="mr-2 text-slate-500"><FiSearch /></span>
            <input
              type="text"
              placeholder="Pesquisar por nome ou disciplina"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagina(1) }}
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"><FiX /> Limpar</button>
            )}
          </div>

          {/* Tabela */}
          <div className="mt-6 overflow-x-auto bg-white shadow rounded-2xl ring-1 ring-slate-200">
            {filterTeacher.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center ring-1 ring-slate-200 text-slate-500">
                  <FaChalkboardTeacher />
                </div>
                <p className="text-slate-900 font-semibold">Nenhum professor encontrado</p>
                <p className="text-slate-600 text-sm mt-1">Ajuste os filtros ou tente outra busca.</p>
              </div>
            ) : (
              <>
                <table className="w-full border-separate border-spacing-y-1 text-slate-700">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">Professor</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">Disciplina</th>
                      {showCourseColumn && (
                        <th className="px-4 py-3 text-xs font-semibold text-slate-600">Curso</th>
                      )}
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professoresPagina.map((prof) => (
                      <tr key={prof.professional_id} className="bg-white hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-sm text-slate-900">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ${colorFromString(prof?.username || 'Professor')}`}>
                              <span className="text-xs font-bold">{getInitials(prof?.username || 'Professor')}</span>
                            </span>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{prof?.username}</span>
                              <span className="text-[11px] text-slate-500">ID {prof?.professional_id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <div className="flex items-center gap-2">
                            <span>{prof?.disciplina || 'Não atribuída'}</span>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${prof?.disciplina ? 'bg-slate-50 text-slate-700 ring-slate-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
                              {prof?.disciplina ? 'Atribuída' : 'Sem disciplina'}
                            </span>
                          </div>
                        </td>
                        {showCourseColumn && (
                          <td className="px-4 py-3 text-sm text-slate-700">{prof?.course || '-'}</td>
                        )}
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button className="inline-flex items-center gap-2 rounded-lg bg-amber-50 text-amber-800 px-3 py-2 text-xs font-medium ring-1 ring-amber-200 hover:bg-amber-100 transition">
                              <FiEdit2 /> Editar
                            </button>
                            <button className="inline-flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-xs font-medium ring-1 ring-red-200 hover:bg-red-100 transition">
                              <FiTrash2 /> Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginação */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t px-3 py-2">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-500">Página {pagina} de {totalPaginas || 1}</p>
                    <div className="inline-flex items-center gap-2 text-xs text-slate-600">
                      <span>Itens por página</span>
                      <select value={itensPorPagina} onChange={(e)=>{ setItensPorPagina(Number(e.target.value)); setPagina(1) }} className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1">
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
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
  );
}

export default ProfessoresManagement;
