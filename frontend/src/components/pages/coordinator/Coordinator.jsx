import React from "react"
import { FaUser, FaFileAlt, FaGraduationCap, FaUserGraduate } from "react-icons/fa"

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
  return (
    <div className="min-h-[550px] flex flex-col items-center justify-start bg-[#060060] p-4">
      
      {/* Container principal expandido para as laterais */}
      <div className="w-full max-w-6xl bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-6">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white-100 font-bold text-xl text-gray-800">Coordenação Acadêmica</p>
            <p className="text-gray-600 mt-1">
              Olá Lucas Emanuel - Coordenador de sistemas de informações
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
          <div className="bg-gray-100 p-4 rounded-lg shadow flex flex-col items-center cursor-pointer hover:shadow-md transition-all border border-gray-300">
            <FaFileAlt className="text-2xl mb-2" />
            <span className="font-semibold">Relatórios</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow flex flex-col items-center cursor-pointer hover:shadow-md transition-all border border-gray-300">
            <FaGraduationCap className="text-2xl mb-2" />
            <span className="font-semibold">Curso(s)</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow flex flex-col items-center cursor-pointer hover:shadow-md transition-all border border-gray-300">
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
            <p className="text-gray-600">Alunos Ativos</p>
            <p className="font-bold text-2xl">320</p>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg shadow">
            <p className="text-gray-600">Cursos Cadastrados</p>
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
        <div className="flex justify-center mt-4">
          <button className="bg-yellow-400 px-30.5 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-500 transition-all">
            Solicitações
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPrincipal
