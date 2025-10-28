import {
  BookOpen, Users, Folder, FileText, BarChart3, Award, Settings, HelpCircle, LogOut, ClipboardList, Zap, Clock, ChevronRight, User, GraduationCap
} from "lucide-react";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import useFlashMessage from "../../../hooks/useFlashMessage";
import { Context } from "../../../context/UserContext";
import Image from "../../form/Image";


/**
 * ManagementStudents / Dashboard (componente)
 *
 * Painel principal do estudante que agrega:
 *  - Sidebar de navegação (Meu curso, Turmas, Materiais, Atividades/Simulados, Desempenho, Medalhas);
 *  - Header com informações do usuário e acesso rápido à turma atual;
 *  - Cards de estatísticas, lista de atividades pendentes e área de atualizações/simulados.
 *
 * Comportamento / efeitos colaterais:
 *  - Mantém estado local `activeSection` via useState para controlar a seção ativa;
 *  - Usa `useNavigate` do React Router para roteamento ao alterar a seção;
 *  - Não faz fetchs por conta própria (dados atualmente mockados); pode ser adaptado para consumir
 *    dados de contexto, hooks ou props para uso em produção.
 *
 * Tipos e formato esperados:
 * @typedef {Object} MenuItem
 * @property {string} id - Identificador único da opção (ex: 'curso', 'turmas')
 * @property {string} label - Texto exibido no menu
 * @property {React.ComponentType} icon - Componente de ícone (lucide-react)
 *
 * Estado local relevante:
 * @property {string} activeSection - seção atualmente selecionada no menu
 *
 * Acessibilidade / notas de implementação:
 *  - Recomenda-se adicionar aria-current="true" no item ativo do menu para melhorar a experiência de leitores de tela;
 *  - Ao navegar via `navigate()`, garantir gerenciamento de foco (ex.: foco no título da nova rota) se necessário;
 *  - Componentes interativos são botões; verifique contraste de cores em variações de tema.
 *
 * Exemplo de uso:
 * <ManagementStudents /> // componente autônomo que pode ser usado em uma rota de estudante
 *
 * Observações para desenvolvedores:
 *  - Para testes unitários, simular `useNavigate` e verificar mudanças no `activeSection` ao clicar nos itens do menu;
 *  - Para integração/prod, extraia dados mockados para props ou para um provider/context para facilitar testes e SSR.
 *
 * @component
 * @returns {JSX.Element} Painel do estudante com navegação e widgets informativos.
 */

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate(); 
  const { logout, user } = useContext(Context)


  // Modal para acessar turma por código
  const [showClassModal, setShowClassModal] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [classError, setClassError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const inputRef = useRef(null);
  const { setFlashMessage } = useFlashMessage();
  const [requestUser, setRequestUser] = useState(null)
  const [course_id, setCourse] = useState(null)

  useEffect(() => {
    if (showClassModal) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setClassError("");
      setClassCode("");
    }
  }, [showClassModal]);


  useEffect(() => {
    if (user) {
      async function fetchUser() {
        const response = await requestData(`/user/${user.id}`, "GET", {}, true)
        if (response.success) setRequestUser(response.data.user)
        else setRequestUser(null)
      }
      fetchUser()
    }
  }, [user])

  useEffect(() => {
    const onKey = (e) => {
      if (!showClassModal || isJoining) return;
      if (e.key === "Escape") setShowClassModal(false);
      if (e.key === "Enter") handleEnterClass();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showClassModal, classCode, isJoining]);

  // 🔹 Função que define rota de cada item
  const handleNavigation = (id) => {
    setActiveSection(id);

    switch (id) {
      case "curso":
        navigate("/student/courses/list");
        break;
      case "turmas":
        navigate("/student/classes/view");
        break;
      case "materiais":
        navigate("/student/materials/view");
        break;
      case "atividades":
        navigate("/student/activities/view");
        break;
      case "desempenho":
        navigate("/student/performance/view");
        break;
      case "medalhas":
        navigate("/student/medals/view");
        break;
      default:
        break;
    }
  };

  const handleEnterClass = async () => {
    const code = classCode.trim().toUpperCase();
    if (!code) {
      setClassError("Insira o código da turma.");
      inputRef.current?.focus();
      return;
    }

    setIsJoining(true); 
    setClassError(""); 

    try {
      const response = await requestData("/enrollments/join-with-code", "POST", { code }, true);

      if (response.success) {
        // Guarda o resultado da matrícula
        setFlashMessage(response.message || "Matrícula realizada com sucesso!", "success");
        setShowClassModal(false);
        setClassCode("");
        setCourse(response.data?.course?.id)

        // Mostra o novo modal de decisão
        setShowConfirmModal(true);

      } else {
        setClassError(response.message || "Código inválido ou erro ao processar.");
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error("Erro ao tentar entrar na turma:", error);
      setClassError("Erro de comunicação com o servidor. Tente novamente.");
      inputRef.current?.focus();
    } finally {
      setIsJoining(false);
    }
  };

  async function handleJoinCourse() {
    try {
      const data = {
        user_id: user.id,
        course_id,
      }
      const response = await requestData("/user/join/course", "PATCH", data, true);
      if (response.success) {
        setFlashMessage(response.data.message, "success");
      } else {
        setFlashMessage(response.message || "Erro ao vincular ao curso.", "error");
      }
    } catch (err) {
      console.error(err);
      setFlashMessage("Erro ao se vincular ao curso.", "error");
    } finally {
      setShowConfirmModal(false);
      navigate("/student/classes/view");
    }              
  }


  const menuItems = [
    { icon: BookOpen, label: "Meu curso", id: "curso" },
    { icon: Users, label: "Turmas", id: "turmas" },
    { icon: Folder, label: "Materiais", id: "materiais" },
    { icon: ClipboardList, label: "Atividades/Simulados", id: "atividades" },
    { icon: BarChart3, label: "Desempenho", id: "desempenho" },
    { icon: Award, label: "Medalhas", id: "medalhas" },
  ];

  return (
    <div className="flex h-screen bg-linear-to-br from-blue-950 via-indigo-950 to-blue-900">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b border-blue-800">
          <div className="relative">
            <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-blue-500/50">

              {requestUser?.photo ? (
                <Image
                  src={`${import.meta.env.VITE_BASE_URL}/${requestUser.photo}`}
                  alt={requestUser.username || "Foto do usuário"}
                  size={55}
                  className="rounded-full border-2 border-white/30 -rotate-15"
                />
              ) : (
                <User className="text-white transform -rotate-12" size={32} strokeWidth={2.5} />
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)} // 🔹 Chama a navegação
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeSection === item.id
                    ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "text-blue-200 hover:bg-blue-900/50 hover:text-white hover:translate-x-1"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 space-y-1 border-t border-blue-800 mt-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all text-sm font-medium hover:translate-x-1">
              <Settings size={20} />
              <span>Configurações</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all text-sm font-medium hover:translate-x-1">
              <HelpCircle size={20} />
              <span>Ajuda</span>
            </button>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-blue-800">
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm hover:scale-105">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-linear-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Bem vindo, <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{requestUser?.username}</span>
              </h2>
              <p className="text-gray-600">Continue sua jornada de aprendizado hoje! 🚀</p>
            </div>

            {/* Right controls: Access current class button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setShowClassModal(true); }}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-md hover:opacity-95 transition-all"
                aria-label="Acessar Turma Atual"
              >
                <GraduationCap size={16} />
                Acessar Turma Atual
              </button>
            </div>
          </div>
        </header>

        {/* Modal: Inserir código da turma (com ajustes no botão)*/}
        {showClassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"> {/* <--- VERIFIQUE ESTAS CLASSES */}
            {/* Overlay de fundo */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm" // <--- E ESTAS CLASSES PARA O OVERLAY
              onClick={() => setShowClassModal(false)}
            ></div>

            {/* Conteúdo do Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl z-10 animate-fade-in-up"> {/* <--- Conteúdo do Modal */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Acessar Turma</h3>
              <p className="text-gray-600 mb-5">
                Digite o código da turma que deseja acessar.
              </p>
              <label className="block">
                <input
                  ref={inputRef}
                  value={classCode}
                  onChange={(e) => {
                    setClassCode(e.target.value);
                    setClassError("");
                  }}
                  placeholder="Ex: ABC-123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  disabled={isJoining}
                  aria-label="Código da turma"
                />
              </label>
              {classError && (
                <p className="mt-2 text-sm text-red-600">{classError}</p>
              )}

              <div className="mt-6 flex justify-end gap-3"> {/* <--- E TAMBÉM ESTAS CLASSES PARA OS BOTÕES */}
                <button
                  onClick={() => setShowClassModal(false)}
                  className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isJoining}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEnterClass}
                  className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-md hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isJoining}
                >
                  {isJoining ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </div>
          </div>
        )}


        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl z-10 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Vincular ao Curso?</h3>
              <p className="text-gray-600 mb-6">
                Deseja se vincular ao curso completo para ter acesso a todas as matérias relacionadas?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    navigate("/student/classes/view");
                  }}
                  className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Apenas esta turma
                </button>
                <button onClick={handleJoinCourse}
                  className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:opacity-95 transition-all"
                >
                  Sim, vincular ao curso
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Notas Recentes</h3>
                  <p className="text-sm text-gray-500">Últimas avaliações</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">9.5</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">8.7</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-semibold">9.0</span>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-linear-to-br from-orange-100 to-orange-200 rounded-xl">
                  <ClipboardList className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Atividades Pendentes</h3>
                  <p className="text-sm text-gray-500">Para fazer</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-orange-600">2</span>
                  <span className="text-gray-500 text-sm">urgentes</span>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="text-red-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            {/* Atividades Pendentes */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Atividades Pendentes</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-linear-to-r from-red-50 to-orange-50 rounded-xl p-5 border-l-4 border-red-500 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <FileText className="text-red-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wide">Urgente</span>
                        </div>
                        <h4 className="text-gray-900 font-bold text-lg mb-2">Prova</h4>
                        <p className="text-gray-600 text-sm mb-3">Deve ser feita até dia 20 de maio</p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Clock size={16} />
                            5 dias restantes
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:translate-x-2 group-hover:text-red-600 transition-all" size={24} />
                  </div>
                </div>

                <div className="bg-linear-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border-l-4 border-amber-500 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <ClipboardList className="text-amber-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold uppercase tracking-wide">Importante</span>
                        </div>
                        <h4 className="text-gray-900 font-bold text-lg mb-2">Entrega de trabalho</h4>
                        <p className="text-gray-600 text-sm mb-3">Deve ser feita até dia 22 de maio</p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Clock size={16} />
                            7 dias restantes
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:translate-x-2 group-hover:text-amber-600 transition-all" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Atualizações e Simulado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Atualizações Recentes</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all cursor-pointer group border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                      <Folder className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">Professor adicionou um novo material</p>
                      <p className="text-gray-500 text-sm">Química Orgânica - Prof. Silva</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:translate-x-2 group-hover:text-blue-600 transition-all" size={24} />
                </div>

                <div className="flex items-center justify-between p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all cursor-pointer group border border-green-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                      <BookOpen className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">Curso atualizado</p>
                      <p className="text-gray-500 text-sm">Novas aulas disponíveis</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:translate-x-2 group-hover:text-green-600 transition-all" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl p-6 shadow-xl flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Simulado Disponível!</h3>
                <p className="text-amber-50 mb-6">Teste seus conhecimentos 🎯</p>
              </div>
              <button className="relative w-full bg-white hover:bg-gray-50 text-amber-600 font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 hover:-translate-y-1">
                <span className="flex items-center justify-center gap-2">
                  Realizar Simulado
                  <ChevronRight size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}