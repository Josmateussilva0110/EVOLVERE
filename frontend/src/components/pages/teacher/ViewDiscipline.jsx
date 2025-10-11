import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MoreVertical, FileText, Users, X, Plus, Download, Calendar, BookOpen } from "lucide-react"
import requestData from "../../../utils/requestApi"
import formatDateRequests from "../../../utils/formatDateRequests"

/**
 * ViewSubjectDetails
 *
 * Tela de detalhes da disciplina que reúne:
 * - Cabeçalho com título da disciplina e menu de ações.
 * - Banner informativo.
 * - Cards com Materiais Globais e Turmas vinculadas.
 * - Popup para criação rápida de uma nova turma.
 *
 * Comportamento:
 * - Gerencia estados locais para abertura de menu, exibição do pop-up de adicionar turma,
 *   campos do formulário (nome da turma, capacidade) e ações de confirmar/cancelar.
 * - Dados de `turmas` e `materiais` são exemplos estáticos; em produção, devem vir de uma API/props.
 *
 * Observações de integração:
 * - `handleConfirmar` atualmente apenas loga no console e reseta os campos; substitua pela lógica
 *   de persistência (fetch/axios) para enviar ao backend.
 * - O componente usa estilos utilitários (Tailwind) e ícones do lucide-react.
 *
 * Retorno:
 * @returns {JSX.Element} Layout completo da página de detalhes da disciplina.
 */
function ViewSubjectDetails() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAddTurmaPopup, setShowAddTurmaPopup] = useState(false)
  const [nomeTurma, setNomeTurma] = useState("")
  const [capacidade, setCapacidade] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()
  const [materials, setMaterials] = useState([])

  useEffect(() => {
    async function fetchSubject() {
      const response = await requestData(`/subject/materiais/${id}`)
      console.log(response)
      if (response.success) {
        setMaterials(response.data.materials)
      }
    }
    fetchSubject()
  }, [id])

  /**
   * handleVoltar
   *
   * Volta à página anterior usando o histórico do browser.
   * Uso: chamado pelo botão de voltar no cabeçalho.
   */
  const handleVoltar = () => window.history.back()

  /**
   * toggleMenu
   *
   * Alterna a visibilidade do menu de ações (mais opções) no cabeçalho.
   */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  /**
   * handleAddTurma
   *
   * Abre o pop-up de adicionar turma e fecha o menu (caso esteja aberto).
   * Uso: item do menu "Adicionar turma".
   */
  const handleAddTurma = () => {
    setShowAddTurmaPopup(true)
    setIsMenuOpen(false)
  }

  /**
   * handleConfirmar
   *
   * Confirmar criação de turma.
   * Atualmente:
   * - Loga o objeto { nome, capacidade } no console.
   * - Fecha o pop-up e limpa os campos.
   *
   * Em produção: substitua por chamada à API que cria a turma e trate erros.
   */
  const handleConfirmar = () => {
    console.log("Nova turma:", { nome: nomeTurma, capacidade })
    setShowAddTurmaPopup(false)
    setNomeTurma("")
    setCapacidade("")
  }

  /**
   * handleCancelar
   *
   * Fecha o pop-up de adicionar turma e reseta os campos do formulário.
   */
  const handleCancelar = () => {
    setShowAddTurmaPopup(false)
    setNomeTurma("")
    setCapacidade("")
  }

  /**
   * Dados de exemplo: turmas
   *
   * Estrutura de cada item:
   * - nome: string — identificador curto da turma (ex.: "A")
   * - cor: string — classes utilitárias para gradiente de fundo (Tailwind)
   * - alunos: number — quantidade de alunos matriculados
   *
   * Em produção: substituir por dados carregados do backend.
   */
  const turmas = [
    { nome: "Turma de Algoritmos Avançados", cor: "from-gray-700 to-gray-600", alunos: 42 },
    { nome: "B", cor: "from-gray-700 to-gray-600", alunos: 38 },
    { nome: "C", cor: "from-gray-700 to-gray-600", alunos: 45 },
  ]

  function getColorByType(type) {
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "doc":
      case "docx":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "ppt":
      case "pptx":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "xlsx":
      case "xls":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-4 pb-10 px-4">
      <div className="max-w-7xl mx-auto py-8 space-y-8">

        {/* Header */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-6 bg-gray-800/90 border-b border-gray-700/50">
            <button
              onClick={handleVoltar}
              className="p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="text-center flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                {materials.length > 0 ? materials[0].subject_name : "Carregando..."}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Período 2025.1 • Sistemas de Informação
              </p>
            </div>

            {/* Menu de ações */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
              >
                <MoreVertical className="w-6 h-6" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden z-20">
                  <ul className="py-2">
                    <li>
                      <button
                        className="w-full text-left px-5 py-3 hover:bg-gray-700/50 flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200"
                        onClick={() => navigate("/teacher/simulated/list")}
                      >
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm">📝</span>
                        </div>
                        <span className="font-medium">Corrigir simulados</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Banner */}
          <div className="px-6 py-4 bg-gray-700/30 border-b border-gray-700/50">
            <p className="text-center text-gray-300 text-sm leading-relaxed flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Aqui você encontra os conteúdos globais desta disciplina: materiais para download, datas importantes e turmas vinculadas.
            </p>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Materiais Globais */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-5 border-b border-gray-700/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                Materiais Globais
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {materials.length > 0 && materials.some(m => m.archive) ? (
                materials
                  .filter(m => m.archive) // só os materiais com arquivo
                  .map(material => (
                    <div
                      key={material.id}
                      className="group bg-gray-700/40 hover:bg-gray-700/60 rounded-xl p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDateRequests(material.updated_at)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-lg font-medium border
    ${getColorByType(material.type_file)}
  `}
                            >
                              {material.type_file}
                            </span>

                          </div>
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {material.title || material.name}
                          </h3>
                        </div>
                        <a
                          href={`${import.meta.env.VITE_BASE_URL}/${material.archive}?download=true`}
                          className="w-10 h-10 bg-blue-600/80 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-lg border border-blue-500/30"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-6">
                  Nenhum material disponível para esta disciplina.
                </p>
              )}

              <button
                onClick={() => navigate(`/teacher/material/register/${id}`)}
                className="w-full py-4 border-2 border-dashed border-gray-600/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-500/50 hover:bg-gray-700/30 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Material
              </button>
            </div>
          </div>


          {/* Turmas */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-5 border-b border-gray-700/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                Turmas 2025.1
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {turmas.map((turma) => (
                <div
                  key={turma.nome}
                  className={`group relative bg-gradient-to-br ${turma.cor} rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] overflow-hidden block border border-gray-600/30 hover:border-gray-500/50`}
                  onClick={() => navigate("/teacher/class/view")}
                >
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Turma {turma.nome}</h3>
                      <p className="text-gray-300 text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {turma.alunos} alunos matriculados
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddTurma}
                className="w-full py-4 border-2 border-dashed border-gray-600/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-500/50 hover:bg-gray-700/30 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Turma
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Adicionar Turma */}
      {showAddTurmaPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700/50">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-5 flex items-center justify-between border-b border-gray-700/50">
              <div>
                <h3 className="text-white font-bold text-xl">Adicionar Turma</h3>
                <p className="text-gray-300 text-sm mt-0.5">Crie uma nova turma para a disciplina</p>
              </div>
              <button
                onClick={handleCancelar}
                className="w-10 h-10 bg-gray-600/50 hover:bg-gray-500/50 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-600/30"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              <p className="text-center text-gray-400 text-sm">
                Preencha as informações abaixo
              </p>

              {/* Campo nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nome da turma
                </label>
                <input
                  type="text"
                  placeholder="Ex: Turma D"
                  value={nomeTurma}
                  onChange={(e) => setNomeTurma(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-400 transition-all duration-200"
                />
              </div>

              {/* Campo capacidade */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Capacidade
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Número de alunos"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                    className="w-full px-4 py-3 pr-14 bg-gray-700/50 border border-gray-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-400 transition-all duration-200"
                  />
                  <button
                    onClick={() => setCapacidade((prev) => String(Number(prev || 0) + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600/80 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg border border-blue-500/30"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Botões */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleConfirmar}
                  className="flex-1 bg-blue-600/80 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 border border-blue-500/30"
                >
                  <span className="text-lg">✓</span> Confirmar
                </button>
                <button
                  onClick={handleCancelar}
                  className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 border border-gray-600/30"
                >
                  <span className="text-lg">✗</span> Cancelar
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
