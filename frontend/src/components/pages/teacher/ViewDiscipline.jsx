import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MoreVertical, FileText, Users, X, Plus, Download, Calendar, BookOpen, Trash } from "lucide-react"
import requestData from "../../../utils/requestApi"
import formatDateRequests from "../../../utils/formatDateRequests"
import useFlashMessage from "../../../hooks/useFlashMessage"
import RegisterClasses from "./AddClasses"


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
  const [course_id, setCourseId] = useState(null)
  const [materials, setMaterials] = useState([])
  const [classes, setClasses] = useState([])
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    async function fetchSubject() {
      const response = await requestData(`/subject/materiais/${id}`, 'GET', {}, true)
      console.log(response)

      if (response.success) {
        const mats = response.data.materials
        setMaterials(mats)

        if (mats.length > 0) {
          setCourseId(mats[0].course_id)
        }
      }
    }
    fetchSubject()
  }, [id])

  useEffect(() => {
    async function fetchClasses() {
      const response = await requestData(`/classes/${id}`, 'GET', {}, true)
      console.log('turmas: ', response)

      if (response.success) {
        setClasses(response.data.classes)
      }
    }
    fetchClasses()
  }, [id])


  async function deleteMaterial(id) {
    const response = await requestData(`/material/${id}`, 'DELETE', {}, true)
    if (response.success) {
      setMaterials(prev => prev.filter(d => d.id !== id))
      setFlashMessage(response.data.message, 'success')
    }
    else {
      setFlashMessage(response.message, 'error')
    }
  }


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

  async function registerClass(e) {
    e.preventDefault()
    const body = {
      name: nomeTurma,
      capacity: capacidade,
      period: materials[0].period,
      course_id,
      subject_id: id
    }

    const response = await requestData('/classes', 'POST', body, true)
    if (response.success) {
      setFlashMessage(response.data.message, 'success')
      setShowAddTurmaPopup(false)
      setNomeTurma("")
      setCapacidade("")

      setClasses(prev => [...prev, response.data.classes])
    }
    else {
      setFlashMessage(response.message, 'error')
    }
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
              onClick={() => navigate('/teacher/discipline/manage')}
              className="p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="text-center flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                {materials.length > 0 ? materials[0].subject_name : "Carregando..."}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {materials.length > 0 ? materials[0].period : "Carregando..."} • {materials.length > 0 ? materials[0].course_name : "Carregando..."}
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
              Aqui você encontra os conteúdos desta disciplina: materiais para download, datas importantes e turmas vinculadas.
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
                Materiais
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
                          <a
                            href={`${import.meta.env.VITE_BASE_URL}/${material.archive}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2 mb-1"
                          >
                            <FileText className="w-4 h-4 text-gray-400" />
                            {material.title}
                          </a>
                        </div>
                        <button onClick={() => deleteMaterial(material.id)}
                          href={`${import.meta.env.VITE_BASE_URL}/${material.archive}?download=true`}
                          className="w-10 h-10 bg-red-600/80 hover:bg-red-500 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-lg border border-red-500/30"
                        >
                          <Trash className="w-4 h-4 text-white" />
                        </button>
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
                onClick={() => navigate(`/teacher/material/register/${id}`, { state: { origin: "subject" } })}

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
                Turmas {materials.length > 0 ? materials[0].period : ""}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {classes.length > 0 ? (
                classes.map((classe) => (
                  <div
                    key={classe.id}
                    className={`group relative bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] overflow-hidden block border border-gray-600/30 hover:border-gray-500/50`}
                    onClick={() => navigate(`/teacher/class/view/${classe.id}`)}
                  >
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {classe.name}
                        </h3>
                        <p className="text-gray-300 text-sm font-medium flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {classe.student_count || 0} aluno{classe.student_count === 1 ? "" : "s"} matriculado{classe.student_count === 1 ? "" : "s"}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Capacidade: {classe.capacity} alunos
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-6">
                  Nenhuma turma cadastrada para esta disciplina.
                </p>
              )}

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
      <RegisterClasses
        show={showAddTurmaPopup}
        onCancel={handleCancelar}
        onConfirm={registerClass}
        nomeTurma={nomeTurma}
        setNomeTurma={setNomeTurma}
        capacidade={capacidade}
        setCapacidade={setCapacidade}
      />
    </div>
  )
}

export default ViewSubjectDetails
