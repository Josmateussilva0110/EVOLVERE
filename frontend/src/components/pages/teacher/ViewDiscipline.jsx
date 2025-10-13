<<<<<<< HEAD
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
=======
// --- IMPORTS NECESSÁRIOS ---
import { Context } from "../../../context/UserContext"; // Verifique se o caminho está correto
import requestData from "../../../utils/requestApi";    // Verifique se o caminho está correto
import useFlashMessage from "../../../hooks/useFlashMessage"; // Verifique se o caminho está correto
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, FileText, Users, X, Plus, Download, Calendar, BookOpen } from "lucide-react";

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
    // --- HOOKS E CONTEXTO ---
    const { id: subjectId } = useParams(); // Pega o ID da disciplina da URL
    const { user } = useContext(Context);
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();

    // --- ESTADOS PARA DADOS DINÂMICOS ---
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- ESTADOS PARA O COMPONENTE (já existentes no seu código) ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAddTurmaPopup, setShowAddTurmaPopup] = useState(false);
    const [nomeTurma, setNomeTurma] = useState("");
    const [capacidade, setCapacidade] = useState("");

    // --- EFEITO PARA BUSCAR DADOS DO BACKEND ---
    useEffect(() => {
        if (subjectId && user) {
            setLoading(true);
            requestData(`/subjects/${subjectId}/details`, 'GET', {}, true)
                .then(response => {
                    if (response.success) {
                        setDetails(response.data);
                    } else {
                        setError(response.message || 'Não foi possível carregar os dados.');
                        setFlashMessage(response.message || 'Erro ao carregar dados.', 'error');
                    }
                })
                .catch(err => {
                    console.error(err);
                    setError('Ocorreu um erro na comunicação com o servidor.');
                    setFlashMessage('Erro de comunicação com o servidor.', 'error');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [subjectId, user]); // Roda sempre que o ID da disciplina ou o usuário mudar

    // --- FUNÇÕES DE LÓGICA (HANDLERS) ---
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

    /**
     * @summary Envia a nova turma para o backend.
     */
    const handleConfirmar = async () => {
        if (!nomeTurma || !capacidade) {
            setFlashMessage("Preencha todos os campos.", "error");
            return;
        }

        const body = {
            name: nomeTurma,
            capacity: parseInt(capacidade),
            period: details.period.split(' • ')[0].replace('Período ', ''), // Ex: "2025.1"
            subject_id: parseInt(subjectId),
            course_id: details.courseId // O backend precisa fornecer este dado
        };

        const response = await requestData('/classes', 'POST', body, true);

        if (response.status) { // O seu controller retorna 'status: true'
            setFlashMessage(response.message, 'success');
            // Atualiza a lista de turmas na tela imediatamente
            setDetails(prevDetails => ({
                ...prevDetails,
                classes: [...prevDetails.classes, response.data]
            }));
            handleCancelar(); // Fecha e limpa o popup
        } else {
            setFlashMessage(response.message || 'Erro ao criar turma.', 'error');
        }
    };

    // --- RENDERIZAÇÃO CONDICIONAL ---
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-[#060060] text-white">Carregando detalhes da disciplina...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen bg-[#060060] text-red-400">Erro: {error}</div>;
    }

    if (!details) {
        return <div className="flex items-center justify-center min-h-screen bg-[#060060] text-white">Disciplina não encontrada.</div>;
    }
    
    // Mapeamento de cores para turmas
    const coresTurma = [
        "from-blue-500 to-indigo-600",
        "from-green-500 to-emerald-600",
        "from-yellow-500 to-amber-600",
        "from-purple-500 to-violet-600",
        "from-pink-500 to-rose-600",
    ];

    return (
        <div className="bg-gradient-to-b from-[#060060] via-[#0a0a7a] to-[#121282] px-4 py-6 pb-24 relative min-h-screen">
            {/* O restante do seu JSX permanece o mesmo, mas usando os dados do estado 'details' */}
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Container Principal */}
            <div className="w-full max-w-6xl mx-auto relative space-y-5">
                
                {/* Header Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
                    <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm border-b border-gray-200">
                        <button onClick={handleVoltar} className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center flex-1">
                            <h1 className="text-xl md:text-2xl font-bold text-[#060060]">{details.name}</h1>
                            <p className="text-sm text-gray-600 mt-0.5">{details.period}</p>
                        </div>

                        <div className="relative">
                            <button onClick={toggleMenu} className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all shadow-sm">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20">
                                    <ul className="py-2">
                                        <li><button onClick={handleAddTurma} className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center gap-3 text-gray-700 transition-colors">
                                            <span className="text-xl">👩‍🏫</span><span className="font-medium">Adicionar turma</span>
                                        </button></li>
                                        {/* Adicione outras opções aqui */}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <p className="text-center text-gray-700 text-sm leading-relaxed flex items-center justify-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-600" />
                            {details.description}
                        </p>
                    </div>
                </div>

                {/* Grid de Conteúdo */}
                <div className="grid lg:grid-cols-2 gap-5">
                    
                    {/* Card Materiais Globais */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-white" /></div>
                                Materiais Globais
                            </h2>
                        </div>
                        <div className="p-5 space-y-3">
                            {details.materials.length > 0 ? details.materials.map((material, idx) => (
                                <div key={idx} className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl p-4 border border-blue-200 transition-all hover:shadow-md cursor-pointer">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{material.uploadDate}</span>
                                                <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-700 rounded-full font-medium">{material.fileType}</span>
                                            </div>
                                            <h3 className="font-semibold text-[#060060] group-hover:text-blue-600 transition-colors flex items-center gap-2">📄 {material.name}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{material.size}</p>
                                        </div>
                                        <button className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-md">
                                            <Download className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-500 py-4">Nenhum material adicionado.</p>}
                            <button className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />Adicionar Material
                            </button>
                        </div>
                    </div>

                    {/* Card Turmas */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><Users className="w-4 h-4 text-white" /></div>
                                Turmas {details.period.split(' • ')[0].replace('Período ', '')}
                            </h2>
                        </div>
                        <div className="p-5 space-y-3">
                            {details.classes.length > 0 ? details.classes.map((turma, index) => (
                                <a key={turma.id} href="#" className={`group relative bg-gradient-to-br ${coresTurma[index % coresTurma.length]} rounded-xl p-5 shadow-md hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden block`}>
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">Turma {turma.name}</h3>
                                            <p className="text-white/90 text-sm font-medium flex items-center gap-1"><Users className="w-4 h-4" />{turma.studentCount} alunos</p>
                                        </div>
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">{turma.name}</span>
                                        </div>
                                    </div>
                                </a>
                            )) : <p className="text-center text-gray-500 py-4">Nenhuma turma criada.</p>}
                            <button onClick={handleAddTurma} className="w-full py-3 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:bg-green-50 transition-all font-medium flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />Adicionar Turma
                            </button>
                        </div>
                    </div>
                </div>
>>>>>>> b2415bd1aabded10d1c6c0a52a30697f5237cbe3
            </div>

            {/* Pop-up Modernizado (sem alterações na lógica) */}
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
    );
}

export default ViewSubjectDetails;