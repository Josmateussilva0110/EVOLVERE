import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"


/**
 * Componente principal (Página) para a interface de Gerenciamento de Disciplinas.
 *
 * Oferece uma **visão detalhada e navegável** das disciplinas registradas,
 * incluindo:
 * 1.  **Estatísticas Rápidas:** Exibição do total, ativas e pendentes.
 * 2.  **Controles:** Campos de busca e filtros por curso/status.
 * 3.  **Listagem:** Um grid de cards de disciplinas com ações de acesso, visualização, edição e exclusão.
 *
 * @component
 * @module DisciplineManagement
 *
 * @returns {JSX.Element} O elemento JSX que renderiza a página completa.
 *
 * @example
 * // Utilização em um sistema de roteamento moderno:
 * <Route path="/disciplinas" element={<DisciplineManagement />} />
 *
 * @todo
 * - **Integração Real:** Substituir a lista de disciplinas mockadas por dados obtidos de uma API REST.
 * - **Lógica de Busca/Filtro:** Implementar as funções de manipulação de estado para buscar e filtrar a lista em tempo real.
 * - **Manipuladores de Evento:** Conectar as ações dos botões (Novo, Editar, Deletar) com a lógica de negócio e modais/rotas apropriadas.
 * - **Componentização:** Extrair os cards de disciplina e o bloco de paginação em componentes filhos separados para melhor reuso e manutenção.
 *
 * @see {@link handleVoltar} - Função para retornar à página anterior no histórico.
 */
function DisciplineManagement() {

  const { user } = useContext(Context)
  const [ data, setData ] = useState([])
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchSubjects() {
      const response = await requestData(`/subjects/teacher/${user.id}`, 'GET', {}, true)
      console.log(response)
      if(response.success) {
        setData(response.data.subjects)
      }
    }
    fetchSubjects()
  }, [user])

  
  const handleVoltar = () => {
    window.history.back()
  }

  const total = data.length
  const ativas = data.filter(d => d.status === 1).length
  const pendentes = data.filter(d => d.status === 'Pendente').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-4 pb-10 px-4">
      <div className="max-w-7xl mx-auto py-8">

        {/* Título e botão voltar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleVoltar}
              className="p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">Disciplinas</h1>
          </div>

          {/* Estatísticas rápidas */}
          <div className="flex items-center space-x-8">
            <div className="text-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-blue-400">{total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-emerald-400">{ativas}</div>
              <div className="text-sm text-gray-400">Ativas</div>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-amber-400">{pendentes}</div>
              <div className="text-sm text-gray-400">Pendentes</div>
            </div>
          </div>
        </div>

        {/* Barra de filtros e busca */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-8">
          {/* ... mantenha a barra de filtros como está ... */}
        </div>

        {/* Grid de disciplinas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((discipline) => (
            <div key={discipline.id} className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-3xl hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{discipline.name}</h3>
                  <p className="text-sm text-gray-300">{discipline.course_name}</p>
                </div>
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                      ${discipline.status === 1 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}
                  >
                    {discipline.status === 1 ? 'Ativa' : 'Inativa'}
                  </span>

              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Turma: {discipline.period}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2"></div>
                <button onClick={() => navigate('/teacher/discipline/list')} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25">
                  Acessar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação moderna */}
        <div className="flex items-center justify-between mt-8">
          {/* ... mantenha a paginação como está, mas você pode atualizar os números com `total` ... */}
        </div>

      </div>
    </div>
  )
}

export default DisciplineManagement
