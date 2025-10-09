import { useState } from "react"
import { ArrowLeft, MoreVertical, FileText, Users, X, Plus, Download, Calendar, BookOpen } from "lucide-react"

/**
 * ViewSubjectDetails
 *
 * Componente React que exibe os detalhes de uma disciplina específica, incluindo:
 * - Informações gerais da disciplina (nome, período, curso)
 * - Turmas vinculadas à disciplina
 * - Materiais globais disponíveis para download
 * - Pop-up para adicionar nova turma
 * - Menu de ações rápidas
 *
 * Funcionalidades principais:
 * - Botão de voltar para a página anterior
 * - Menu flutuante com opções (corrigir simulados, adicionar turma)
 * - Exibição de cartões para turmas e materiais
 * - Download de materiais
 * - Adição de nova turma via pop-up interativo
 * - Animações de hover, escala e transições
 * - Background moderno com círculos animados e blur
 *
 * Estados internos:
 * - isMenuOpen: controla a abertura/fechamento do menu de ações
 * - showAddTurmaPopup: controla a exibição do pop-up de adição de turma
 * - nomeTurma: armazena o nome digitado para a nova turma
 * - capacidade: armazena a capacidade de alunos da nova turma
 *
 * Constantes internas:
 * - turmas: array de objetos com informações das turmas (nome, cor, quantidade de alunos)
 * - materiais: array de objetos com informações dos materiais (título, data, tipo, tamanho)
 *
 * Funções internas:
 * - handleVoltar(): volta para a página anterior usando window.history
 * - toggleMenu(): alterna a abertura do menu flutuante
 * - handleAddTurma(): abre o pop-up para adicionar uma nova turma
 * - handleConfirmar(): confirma a criação da nova turma (aqui apenas log no console)
 * - handleCancelar(): fecha o pop-up e limpa os campos de entrada
 *
 * Entrada:
 * - Nenhuma entrada externa; dados das turmas e materiais são mockados internamente
 *
 * Saída:
 * - JSX que renderiza:
 *   - Cabeçalho com botão de voltar, título da disciplina e menu de ações
 *   - Banner de informações gerais da disciplina
 *   - Grid com dois cartões:
 *     1. Materiais Globais
 *        - Lista de materiais com data, tipo, título e tamanho
 *        - Botão de download
 *        - Botão para adicionar novo material
 *     2. Turmas
 *        - Lista de turmas com nome, número de alunos e destaque visual com cor
 *        - Botão para adicionar nova turma
 *   - Pop-up para criação de nova turma:
 *        - Campos de nome e capacidade
 *        - Botões de confirmar ou cancelar
 *   - Efeitos visuais:
 *        - Background com círculos animados e blur
 *        - Hover, transições, escala e sombras nos cards e botões
 *
 * Observações:
 * - Pop-up de adicionar turma é moderno e centralizado
 * - Botões possuem feedback visual consistente (hover, scale, sombra)
 * - Cards de materiais e turmas usam gradientes e efeitos de group-hover
 * - Integração futura pode substituir console.log por chamadas de API para criar turmas
 */

function ViewSubjectDetails() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAddTurmaPopup, setShowAddTurmaPopup] = useState(false)
  const [nomeTurma, setNomeTurma] = useState("")
  const [capacidade, setCapacidade] = useState("")

  const handleVoltar = () => window.history.back()
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  
  const handleAddTurma = () => {
    setShowAddTurmaPopup(true)
    setIsMenuOpen(false)
  }
  
  const handleConfirmar = () => {
    console.log("Nova turma:", { nome: nomeTurma, capacidade })
    setShowAddTurmaPopup(false)
    setNomeTurma("")
    setCapacidade("")
  }
  
  const handleCancelar = () => {
    setShowAddTurmaPopup(false)
    setNomeTurma("")
    setCapacidade("")
  }

  const turmas = [
    { nome: "A", cor: "from-blue-500 to-indigo-600", alunos: 42 },
    { nome: "B", cor: "from-green-500 to-emerald-600", alunos: 38 },
    { nome: "C", cor: "from-yellow-500 to-amber-600", alunos: 45 },
  ]

  const materiais = [
    { titulo: "Prova ED", data: "06/09/2025", tipo: "PDF", tamanho: "2.4 MB" },
    { titulo: "Simulado PAA", data: "06/09/2025", tipo: "PDF", tamanho: "1.8 MB" },
  ]

  return (
    <div className="bg-gradient-to-b from-[#060060] via-[#0a0a7a] to-[#121282] px-4 py-6 pb-24 relative min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 sm:w-80 sm:h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-80 sm:h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Container Principal */}
      <div className="w-full max-w-6xl mx-auto relative space-y-5">
        
        {/* Header Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm border-b border-gray-200">
            <button
              onClick={handleVoltar}
              className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-[#060060]">
                Estrutura de Dados
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">Período 2025.1 • SI</p>
            </div>

            <div className="relative">
              <button
                onClick={toggleMenu}
                className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all shadow-sm"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20">
                  <ul className="py-2">
                    <li>
                      <button className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-3 text-gray-700 transition-colors">
                        <span className="text-xl">📝</span>
                        <span className="font-medium">Corrigir simulados</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={handleAddTurma}
                        className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-3 text-gray-700 transition-colors"
                      >
                        <span className="text-xl">👩‍🏫</span>
                        <span className="font-medium">Adicionar turma</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-3 text-gray-700 transition-colors">
                        <span className="text-xl">📝</span>
                        <span className="font-medium">Corrigir simulado</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Info Banner */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-center text-gray-700 text-sm leading-relaxed flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Aqui você encontra os conteúdos globais desta disciplina: materiais para download, datas importantes e turmas vinculadas.
            </p>
          </div>
        </div>

        {/* Grid de Conteúdo */}
        <div className="grid lg:grid-cols-2 gap-5">
          
          {/* Card Materiais Globais */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Materiais Globais
              </h2>
            </div>
            
            <div className="p-5 space-y-3">
              {materiais.map((material, idx) => (
                <div 
                  key={idx}
                  className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl p-4 border border-blue-200 transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {material.data}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-700 rounded-full font-medium">
                          {material.tipo}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#060060] group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        📄 {material.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{material.tamanho}</p>
                    </div>
                    <button className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-md">
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Material
              </button>
            </div>
          </div>

          {/* Card Turmas */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                Turmas 2025.1
              </h2>
            </div>
            
            <div className="p-5 space-y-3">
              {turmas.map((turma) => (
                <a
                  key={turma.nome}
                  href="#"
                  className={`group relative bg-gradient-to-br ${turma.cor} rounded-xl p-5 shadow-md hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden block`}
                >
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Turma {turma.nome}</h3>
                      <p className="text-white/90 text-sm font-medium flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {turma.alunos} alunos
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{turma.nome}</span>
                    </div>
                  </div>
                </a>
              ))}
              
              <button 
                onClick={handleAddTurma}
                className="w-full py-3 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:bg-green-50 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Turma
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Pop-up Modernizado */}
      {showAddTurmaPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-blue-200">
            {/* Header do Pop-up */}
            <div className="bg-gradient-to-r from-[#060060] to-[#0a0a7a] px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">Adicionar Turma</h3>
                <p className="text-blue-200 text-sm mt-0.5">Crie uma nova turma para a disciplina</p>
              </div>
              <button
                onClick={handleCancelar}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Conteúdo do Pop-up */}
            <div className="px-6 py-6 space-y-5">
              <p className="text-center text-gray-600 text-sm">
                Preencha as informações abaixo
              </p>

              {/* Campo Nome da turma */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da turma
                </label>
                <input
                  type="text"
                  placeholder="Ex: Turma D"
                  value={nomeTurma}
                  onChange={(e) => setNomeTurma(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
                />
              </div>

              {/* Campo Capacidade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacidade
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Número de alunos"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                    className="w-full px-4 py-3 pr-14 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
                  />
                  <button
                    onClick={() => setCapacidade((prev) => String(Number(prev || 0) + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg flex items-center justify-center transition-all hover:scale-105 shadow-md"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Botões */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleConfirmar}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✓</span> Confirmar
                </button>
                <button
                  onClick={handleCancelar}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✗</span> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewSubjectDetails