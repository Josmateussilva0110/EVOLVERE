import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"
import { FaEye } from "react-icons/fa"


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
  // Função que lida com a navegação de volta no histórico do navegador
  const handleVoltar = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-4 pb-10 px-4">
      {/* Conteúdo principal */}
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
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">Gerenciar Disciplinas</h1>
          </div>
          
          {/* Estatísticas rápidas */}
          <div className="flex items-center space-x-8">
            <div className="text-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-blue-400">12</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-emerald-400">10</div>
              <div className="text-sm text-gray-400">Ativas</div>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-amber-400">2</div>
              <div className="text-sm text-gray-400">Pendentes</div>
            </div>
          </div>
        </div>
        
        {/* Barra de filtros e busca */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Campo de busca */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar disciplinas..."
                  className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/70 outline-none transition-all duration-200"
                />
              </div>

              {/* Filtros */}
              <div className="flex gap-3">
                <select className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/70 outline-none transition-all duration-200">
                  <option className="bg-gray-700 text-white">Todos os cursos</option>
                  <option className="bg-gray-700 text-white">Sistemas de Informação</option>
                  <option className="bg-gray-700 text-white">Ciência da Computação</option>
                  <option className="bg-gray-700 text-white">Engenharia de Software</option>
              </select>

                <select className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-700/70 outline-none transition-all duration-200">
                  <option className="bg-gray-700 text-white">Todos os status</option>
                  <option className="bg-gray-700 text-white">Ativo</option>
                  <option className="bg-gray-700 text-white">Inativo</option>
                  <option className="bg-gray-700 text-white">Pendente</option>
              </select>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3">
              <button className="px-6 py-3 text-gray-300 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-200 font-medium">
                Limpar filtros
            </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25">
                Nova Disciplina
              </button>
            </div>
          </div>
        </div>

        {/* Grid de disciplinas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de disciplina 1 */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-3xl hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Estrutura de Dados</h3>
                <p className="text-sm text-gray-300">Sistemas de Informação</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-300">
                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Turma: 2022.1
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                45 alunos matriculados
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="p-2.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25">
                Acessar
              </button>
            </div>
          </div>

          {/* Card de disciplina 2 */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-3xl hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Banco de Dados</h3>
                <p className="text-sm text-gray-300">Sistemas de Informação</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-300">
                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Turma: 2022.1
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                38 alunos matriculados
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="p-2.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25">
                Acessar
              </button>
            </div>
          </div>

          {/* Card de disciplina 3 */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:shadow-3xl hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Algoritmos Avançados</h3>
                <p className="text-sm text-gray-300">Ciência da Computação</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Pendente
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-300">
                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Turma: 2023.1
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                52 alunos matriculados
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="p-2.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <button className="px-4 py-2 bg-gray-600 text-gray-300 text-sm rounded-xl cursor-not-allowed font-medium">
                Aguardando
              </button>
            </div>
          </div>
        </div>

        {/* Paginação moderna */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-300">
            Mostrando <span className="font-medium text-white">1</span> a <span className="font-medium text-white">3</span> de <span className="font-medium text-white">12</span> resultados
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
              Anterior
            </button>
            
            <div className="flex space-x-1">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-xl shadow-lg">
                1
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-200">
                2
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-200">
                3
              </button>
              <span className="px-4 py-2 text-sm text-gray-400">...</span>
              <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-200">
                5
              </button>
            </div>
            
            <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-200">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisciplineManagement
