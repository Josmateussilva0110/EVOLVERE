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
    <div className="min-h-[550px] flex flex-col items-center justify-start bg-[#060060] p-4">

      {/* Container principal expandido para as laterais */}
      <div className="w-full max-w-6xl bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-6">

        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white-100 font-bold text-xl text-gray-800">Coordenação Acadêmica</p>
            <p className="text-gray-600 mt-1">
              {userRequest?.course ? (
                <>Olá {userRequest?.username} - Coordenador de {userRequest?.course}</>
              ) : (
                <>Olá {user?.name}</>
              )}
            </p>
          </div>
        </div>

        {/* Cards de navegação */}
        {/*
          Cada card representa uma seção do painel:
          - Relatórios
          - Cursos
          - Alunos
          Contém ícone, título e efeito hover.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Disciplinas */}
          <div
            onClick={() => navigate("/coordinator/discipline/list")}
            className="bg-gray-100 p-4 rounded-lg shadow flex flex-col items-center cursor-pointer hover:shadow-md transition-all border border-gray-300"
          >
            <FaGraduationCap className="text-2xl mb-2" />
            <span className="font-semibold">Disciplinas</span>
          </div>


          {/* professores */}
          <div
            onClick={() => navigate("/coordinator/teacher/manage")}
            className="bg-gray-100 p-4 rounded-lg shadow flex flex-col items-center cursor-pointer hover:shadow-md transition-all border border-gray-300"
          >
            <FaChalkboardTeacher className="text-2xl mb-2" />
            <span className="font-semibold">Professores</span>
          </div>

          {/* Alunos */}
          <div
            onClick={() => navigate("/coordinator/student/list")}
            className="bg-gray-100 p-4 rounded-lg shadow flex flex-col items-center cursor-pointer hover:shadow-md transition-all border border-gray-300"
          >
            <FaUserGraduate className="text-2xl mb-2" />
            <span className="font-semibold">Alunos</span>
          </div>
        </div>


        {/* KPIs */}
        {/*
          Cards de indicadores-chave:
          - Alunos Ativos
          - Cursos Cadastrados
          - Solicitações Pendentes
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-200 p-6 rounded-lg shadow">
            <p className="text-gray-600">Disciplinas Cadastradas</p>
            <p className="font-bold text-2xl">23</p>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg shadow">
            <p className="text-gray-600">Professores Ativos</p>
            <p className="font-bold text-2xl">12</p>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg shadow">
            <p className="text-gray-600">Solicitações pendentes</p>
            <p className="font-bold text-2xl">5</p>
          </div>
        </div>

        {/* Botão de ação */}
        {/*
          Botão principal do painel, direcionado para a tela de solicitações.
          Aumentado em tamanho para destaque visual.
        */}
        <div className="flex justify-center gap-4 mt-4">
          {/* Botão Solicitações */}
          <button
            onClick={() => navigate("/coordinator/requests")}
            className="flex items-center gap-2 bg-yellow-400 px-8 py-4 rounded-xl text-lg font-semibold 
               hover:bg-yellow-500 transform transition-transform hover:-translate-y-1"
          >
            <FaTasks className="text-xl" />
            Solicitações
          </button>

          {/* Botão Relatórios */}
          <button
            onClick={() => navigate("/coordinator/dashboard")}
            className="flex items-center gap-2 bg-blue-500 px-8 py-4 rounded-xl text-lg font-semibold text-white 
               hover:bg-blue-600 transform transition-transform hover:-translate-y-1"
          >
            <FaFileAlt className="text-xl" />
            Relatórios
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPrincipal
