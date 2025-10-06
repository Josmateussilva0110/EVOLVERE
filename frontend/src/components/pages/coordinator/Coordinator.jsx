import { FaChalkboardTeacher, FaFileAlt, FaGraduationCap, FaUserGraduate, FaTasks } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
import Image from "../../form/Image"

/**
 * DashboardPrincipal
 *
 * Componente responsável por exibir o painel principal da **Coordenação Acadêmica**.
 *
 * O que faz:
 * - Renderiza cabeçalho com saudação e informações do coordenador.
 * - Mostra cards de navegação para Disciplinas, Professores e Alunos.
 * - Apresenta indicadores (KPIs) como número de disciplinas cadastradas,
 *   professores ativos e solicitações pendentes.
 * - Possui botões de ação rápidos para Solicitações e Relatórios.
 * - Exibe menu de perfil com acesso a configurações e dados do usuário.
 *
 * Entradas:
 * - Não recebe props diretamente.
 * - Consome dados do usuário pelo contexto `Context`.
 *
 * Saída:
 * - Retorna um elemento JSX com a interface do painel administrativo.
 *
 * Exemplo de uso:
 * ```jsx
 * <DashboardPrincipal />
 * ```
 */
function DashboardPrincipal() {
  const navigate = useNavigate()
  const [ userRequest, setUserRequest ] = useState({})
  const [kpi, setKpi] = useState({})
  const { user } = useContext(Context)
  const displayName = userRequest?.username || user?.name || 'Usuário'
  const [ menuOpen, setMenuOpen ] = useState(false)
  const [ photo, setPhoto] = useState(null)

  /**
   * Efeito: Buscar informações detalhadas do coordenador.
   *
   * O que faz:
   * - Executa chamada GET para `/user/coordinator/{user.id}`.
   * - Armazena no estado `userRequest` os dados retornados.
   * - Define `userRequest` como `null` caso a requisição falhe.
   *
   * Entradas:
   * - `user` (do contexto) → utilizado para compor a URL da requisição.
   *
   * Saída:
   * - Atualiza o estado local `userRequest`.
   *
   * Dependências:
   * - Executa novamente sempre que `user` mudar.
   */
  useEffect(() => {
    if(user) {
      async function fetchUser() {
        const response = await requestData(`/user/coordinator/${user.id}`, 'GET', {}, true)
        console.log(response)
        if(response.success) {
          setUserRequest(response.data.user)
        } else {
          setUserRequest(null)
        }
      }
      fetchUser()
    }
  }, [user])

  useEffect(() => {
    if(user) {
        async function fetchPhoto() {
        const response = await requestData(`/user/photo/${user.id}`, 'GET', {}, true)
        //console.log('response da foto: ', response)
        if(response.success) {
          setPhoto(response.data.photo.photo)
        }
      }
      fetchPhoto()
    } 
  }, [user])

  /**
   * Efeito: Buscar indicadores (KPIs) do coordenador.
   *
   * O que faz:
   * - Executa chamada GET para `/user/coordinator/kpi/{user.id}`.
   * - Armazena no estado `kpi` os valores retornados pela API.
   *
   * Entradas:
   * - `user` (do contexto) → utilizado para compor a URL da requisição.
   *
   * Saída:
   * - Atualiza o estado local `kpi` com os indicadores.
   *
   * Dependências:
   * - Executa novamente sempre que `user` mudar.
   */
  useEffect(() => {
    if(user) {
      async function fetchKpi() {
        const response = await requestData(`/user/coordinator/kpi/${user.id}`, 'GET', {}, true)
        if(response.success) {
          //console.log(response.data.kpi)
          setKpi(response.data.kpi)
        }
      }
      fetchKpi()
    }
  }, [user])

  const getAvatarColor = (name) => {
    const colors = ["bg-yellow-400", "bg-indigo-400", "bg-pink-400", "bg-green-400", "bg-blue-400"]
    const index = name ? name.charCodeAt(0) % colors.length : 0
    return colors[index]
  }

  return (
    <div className="min-h-screen w-full bg-[#060060] flex items-center">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 flex justify-center">
        {/* Container principal */}
        <div className="w-full max-w-6xl bg-white rounded-3xl p-6 md:p-10 shadow-xl flex flex-col gap-8">

          {/* Cabeçalho */}
          {/* Exibe título da área administrativa, saudação ao coordenador e menu de perfil */}
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

            {/* Perfil e menu suspenso */}
            <div className="flex items-center gap-3 md:gap-4">
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#060060]/10 text-[#060060] px-3 py-1 text-sm font-medium ring-1 ring-[#060060]/20">
                <FaChalkboardTeacher />
                Coordenação
              </span>
              <div className="relative" tabIndex={0} onBlur={() => setMenuOpen(false)}>
                <button onClick={() => setMenuOpen((v) => !v)}>
                  {photo ? (
                    <Image
                      src={`${import.meta.env.VITE_BASE_URL}/${photo}`}
                      alt={userRequest.username || "Foto do usuário"}
                      size={70}
                    />
                  ) : (
                    <div className={`h-[70px] w-[70px] rounded-full ${getAvatarColor(userRequest?.username)} flex items-center justify-center text-white text-3xl font-bold`}>
                      {userRequest.username ? userRequest.username.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}

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
          {/* Cada card redireciona para uma seção administrativa */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Disciplinas */}
            {/* Card para gerenciar disciplinas */}
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
            {/* Card para gerenciamento de professores */}
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
            {/* Card para consulta e acompanhamento de alunos */}
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
          {/* Exibição dos indicadores principais da coordenação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* KPI Disciplinas */}
            <div className="rounded-2xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disciplinas Cadastradas</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{kpi.subjects?.count || '-'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-[#060060]/10 text-[#060060] flex items-center justify-center">
                  <FaGraduationCap />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Atualizado diariamente</p>
            </div>

            {/* KPI Professores */}
            <div className="rounded-2xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Professores Ativos</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{kpi.teachers?.count || '-'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FaChalkboardTeacher />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Últimos 30 dias</p>
            </div>

            {/* KPI Solicitações */}
            <div className="rounded-2xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solicitações pendentes</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{kpi.requests?.count || '-'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <FaTasks />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Aguardando aprovação</p>
            </div>
          </div>

          {/* Ações principais */}
          {/* Botões de navegação para Solicitações e Relatórios */}
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
