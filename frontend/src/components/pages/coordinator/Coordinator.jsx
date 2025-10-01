import { FaChalkboardTeacher, FaFileAlt, FaGraduationCap, FaUserGraduate, FaTasks } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
 
/**
 * Componente DashboardPrincipal
 * 
 * Exibe o painel principal da Coordenação Acadêmica, contendo:
 * - Cabeçalho com saudação e função do usuário
 * - Cards de navegação (Relatórios, Cursos, Alunos)
 * - KPIs (Alunos Ativos, Cursos Cadastrados, Solicitações Pendentes)
 * - Botão de ação para Solicitações
 * 
 * @component
 * @example
 * return <DashboardPrincipal />
 */
function DashboardPrincipal() {
  const navigate = useNavigate()
  const [ userRequest, setUserRequest ] = useState({})
  const { user } = useContext(Context)
  const displayName = userRequest?.username || user?.name || 'Usuário'
  const initials = (displayName?.charAt(0) || 'U').toUpperCase()
  const [ menuOpen, setMenuOpen ] = useState(false)

  useEffect(() => {
  /**
   * useEffect para buscar informações detalhadas do usuário coordenador.
   * 
   * Executa quando o objeto 'user' do contexto é definido ou atualizado.
   * - Se o usuário estiver disponível, faz uma requisição GET para a API 
   *   `/user/coordinator/{user.id}` para obter os dados do coordenador.
   * - Atualiza o estado 'userRequest' com os dados retornados da API.
   * - Caso a requisição falhe, define 'userRequest' como null.
   * 
   * Dependências:
   * - [user]: garante que a busca só ocorre quando 'user' estiver disponível ou mudar.
   */
    if(user) {
      async function fetchUser() {
        const response = await requestData(`/user/coordinator/${user.id}`, 'GET', {}, true)
        if(response.success) {
          console.log(response.data)
          setUserRequest(response.data.user)
        }
        else {
          setUserRequest(null)
        }
      }
      fetchUser()
  }
  }, [user])

  return (
    <div className="min-h-screen w-full bg-[#060060] flex items-center">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 flex justify-center">
        {/* Container principal */}
        <div className="w-full max-w-6xl bg-white rounded-3xl p-6 md:p-10 shadow-xl flex flex-col gap-8">

          {/* Cabeçalho */}
          <div className="flex items-start md:items-center justify-between gap-6 flex-col md:flex-row">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#060060] font-semibold">Área administrativa</p>
              <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-gray-900">Coordenação Acadêmica</h1>
              <p className="mt-2 text-gray-600">
                {userRequest?.course ? (
                  <>Olá <span className="font-semibold text-gray-900">{userRequest?.username}</span> — Coordenador de {userRequest?.course}</>
                ) : (
                  <>Olá <span className="font-semibold text-gray-900">{user?.name}</span></>
                )}
              </p>
            </div>

            {/* Perfil e ações dentro do card branco */}
            <div className="flex items-center gap-3 md:gap-4">
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#060060]/10 text-[#060060] px-3 py-1 text-sm font-medium ring-1 ring-[#060060]/20">
                <FaChalkboardTeacher />
                Coordenação
              </span>
              <div className="relative" tabIndex={0} onBlur={() => setMenuOpen(false)}>
                <button onClick={() => setMenuOpen((v) => !v)} className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#060060] text-white flex items-center justify-center font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-[#060060]/40">
                  {initials}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg ring-1 ring-black/5 p-1 z-10">
                    <button onMouseDown={() => navigate('/coordinator/profile')} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Perfil</button>
                    <button onMouseDown={() => navigate('/coordinator/settings')} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Configurações</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cards de navegação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Disciplinas */}
            <div
              onClick={() => navigate("/coordinator/discipline/list")}
              className="group relative overflow-hidden rounded-2xl cursor-pointer bg-indigo-50 p-5 shadow-sm ring-1 ring-indigo-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-100/70 blur-2xl" />
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#060060] text-white flex items-center justify-center shadow-md">
                  <FaGraduationCap className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Disciplinas</p>
                  <p className="text-sm text-gray-600">Listar e gerenciar disciplinas</p>
                </div>
              </div>
            </div>

            {/* Professores */}
            <div
              onClick={() => navigate("/coordinator/teacher/manage")}
              className="group relative overflow-hidden rounded-2xl cursor-pointer bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100/70 blur-2xl" />
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <FaChalkboardTeacher className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Professores</p>
                  <p className="text-sm text-gray-600">Gerenciar docentes e permissões</p>
                </div>
              </div>
            </div>

            {/* Alunos */}
            <div
              onClick={() => navigate("/coordinator/student/list")}
              className="group relative overflow-hidden rounded-2xl cursor-pointer bg-amber-50 p-5 shadow-sm ring-1 ring-amber-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-100/70 blur-2xl" />
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <FaUserGraduate className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Alunos</p>
                  <p className="text-sm text-gray-600">Consultar e acompanhar matrículas</p>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="rounded-2xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disciplinas Cadastradas</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">23</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-[#060060]/10 text-[#060060] flex items-center justify-center">
                  <FaGraduationCap />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Atualizado diariamente</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Professores Ativos</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">12</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FaChalkboardTeacher />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Últimos 30 dias</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solicitações pendentes</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">5</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <FaTasks />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Aguardando aprovação</p>
            </div>
          </div>

          {/* Ações principais */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-2">
            <button
              onClick={() => navigate("/coordinator/requests")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-base font-semibold text-[#151200] shadow-sm hover:bg-yellow-400 hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <FaTasks className="text-lg" />
              Solicitações
            </button>
            <button
              onClick={() => navigate("/coordinator/dashboard")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-blue-700 hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <FaFileAlt className="text-lg" />
              Relatórios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPrincipal
