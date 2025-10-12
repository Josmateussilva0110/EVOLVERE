import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MoreVertical, FileText, Users, X, Plus, Download, Calendar, BookOpen, Trash } from "lucide-react";
import requestData from "../../../utils/requestApi";
import formatDateRequests from "../../../utils/formatDateRequests";
import useFlashMessage from "../../../hooks/useFlashMessage";
import { Context } from "../../../context/UserContext";

function ViewSubjectDetails() {
  // --- ESTADO UNIFICADO PARA OS DADOS DA DISCIPLINA ---
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para controle da UI
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAddTurmaPopup, setShowAddTurmaPopup] = useState(false);
  const [nomeTurma, setNomeTurma] = useState("");
  const [capacidade, setCapacidade] = useState("");
  
  // Hooks
  const navigate = useNavigate();
  const { id: subjectId } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const { user } = useContext(Context);

  // --- EFEITO PARA BUSCAR TODOS OS DADOS DA DISCIPLINA ---
  useEffect(() => {
    if (subjectId && user) {
      setLoading(true);
      requestData(`/subjects/teacher/${subjectId}/details`, 'GET', {}, true)
        .then(response => {
          if (response.success) {
            console.log("DADOS DOS MATERIAIS RECEBIDOS:", response.data.data.materials);
            setDetails(response.data.data);
          } else {
            setError(response.message || "Não foi possível carregar os dados.");
          }
        })
        .catch(err => {
          console.error(err);
          setError("Ocorreu um erro na comunicação com o servidor.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [subjectId, user]);

  // --- FUNÇÕES DE MANIPULAÇÃO DE DADOS ---

  // Função para deletar material
  async function deleteMaterial(materialId) {
    const response = await requestData(`/materials/${materialId}`, 'DELETE', {}, true);
    if (response.success) {
      setDetails(prevDetails => ({
        ...prevDetails,
        materials: prevDetails.materials.filter(m => m.id !== materialId)
      }));
      setFlashMessage(response.message || 'Material deletado com sucesso.', 'success');
    } else {
      setFlashMessage(response.message, 'error');
    }
  }

  // Função para criar turma
  const handleConfirmar = async () => {
    if (!nomeTurma || !capacidade) {
      setFlashMessage("Preencha todos os campos.", "error");
      return;
    }
    const body = {
      name: nomeTurma,
      capacity: parseInt(capacidade),
      period: details.period.split(' • ')[0].replace('Período ', ''),
      subject_id: parseInt(subjectId),
      course_id: details.courseId,
    };
    const response = await requestData('/classes', 'POST', body, true);
    if (response.status) {
      setFlashMessage(response.message, 'success');
      setDetails(prevDetails => ({
        ...prevDetails,
        classes: [...prevDetails.classes, response.data]
      }));
      handleCancelar();
    } else {
      setFlashMessage(response.message || 'Erro ao criar turma.', 'error');
    }
  };

  // Funções de UI
  const handleVoltar = () => window.history.back();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleAddTurma = () => {
    setShowAddTurmaPopup(true);
    setIsMenuOpen(false);
  };
  const handleCancelar = () => {
    setShowAddTurmaPopup(false);
    setNomeTurma("");
    setCapacidade("");
  };

  // Função para determinar cor baseada no tipo de arquivo
  function getColorByType(type) {
    if (!type) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    switch (type.toLowerCase()) {
      case "pdf": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "doc": 
      case "docx": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "ppt":
      case "pptx": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "xlsx":
      case "xls": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  }

  // --- RENDERIZAÇÃO CONDICIONAL ---
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Carregando detalhes...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">Erro: {error}</div>;
  }
  if (!details) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Não foi possível encontrar a disciplina.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-4 pb-10 px-4">
      <div className="max-w-7xl mx-auto py-8 space-y-8">

        {/* Header */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-6 bg-gray-800/90 border-b border-gray-700/50">
            <button onClick={handleVoltar} className="p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">{details.name}</h1>
              <p className="text-sm text-gray-400 mt-1">{details.period}</p>
            </div>
            <div className="relative">
              <button onClick={toggleMenu} className="p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50">
                <MoreVertical className="w-6 h-6" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden z-20">
                  <ul className="py-2">
                    <li>
                      <button className="w-full text-left px-5 py-3 hover:bg-gray-700/50 flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200" onClick={() => navigate("/teacher/simulated/list")}>
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"><span className="text-sm">📝</span></div>
                        <span className="font-medium">Corrigir simulados</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-700/30 border-b border-gray-700/50">
            <p className="text-center text-gray-300 text-sm leading-relaxed flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              {details.description}
            </p>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-2 gap-5">
          
          {/* Materiais Globais - TOTALMENTE DINÂMICO */}
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
              {details.materials && details.materials.length > 0 ? (
                details.materials.map(material => (
                  <div key={material.id} className="group bg-gray-700/40 hover:bg-gray-700/60 rounded-xl p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateRequests(material.uploadDate || material.updated_at)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-lg font-medium border ${getColorByType(material.fileType || material.type_file)}`}>
                            {material.fileType || material.type_file}
                          </span>
                        </div>
                        <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {material.name || material.title}
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteMaterial(material.id)} 
                        className="w-10 h-10 bg-red-600/80 hover:bg-red-500 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-lg border border-red-500/30"
                      >
                        <Trash className="w-4 h-4 text-white" />
                      </button>
                      <a 
                        href={`${import.meta.env.VITE_BASE_URL}/${material.file_path || material.archive}?download=true`} 
                        className="w-10 h-10 bg-blue-600/80 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-lg border border-blue-500/30"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-6">Nenhum material disponível para esta disciplina.</p>
              )}
              <button 
                onClick={() => navigate(`/teacher/material/register/${subjectId}`)} 
                className="w-full py-4 border-2 border-dashed border-gray-600/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-500/50 hover:bg-gray-700/30 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />Adicionar Material
              </button>
            </div>
          </div>

          {/* Turmas - TOTALMENTE DINÂMICO */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-5 border-b border-gray-700/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                Turmas {details.period ? details.period.split(' • ')[0].replace('Período ', '') : ''}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {details.classes && details.classes.length > 0 ? (
                details.classes.map((turma) => (
                  <div 
                    key={turma.id} 
                    className="group relative bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] overflow-hidden block border border-gray-600/30 hover:border-gray-500/50 cursor-pointer" 
                    onClick={() => navigate(`/teacher/class/view/${turma.id}`)}
                  >
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Turma {turma.name}</h3>
                        <p className="text-gray-300 text-sm font-medium flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {turma.studentCount} alunos matriculados
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm py-6">Nenhuma turma criada para esta disciplina.</p>
              )}
              <button 
                onClick={handleAddTurma} 
                className="w-full py-4 border-2 border-dashed border-gray-600/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-500/50 hover:bg-gray-700/30 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />Adicionar Turma
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
              <button onClick={handleCancelar} className="w-10 h-10 bg-gray-600/50 hover:bg-gray-500/50 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-600/30">
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-5">
              <p className="text-center text-gray-400 text-sm">Preencha as informações abaixo</p>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Nome da turma</label>
                <input 
                  type="text" 
                  placeholder="Ex: Turma D" 
                  value={nomeTurma} 
                  onChange={(e) => setNomeTurma(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-400 transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Capacidade</label>
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

export default ViewSubjectDetails;