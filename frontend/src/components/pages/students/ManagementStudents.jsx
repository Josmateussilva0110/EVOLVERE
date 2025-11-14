import {
  BookOpen, Users, Folder, FileText, BarChart3, Award, Settings, HelpCircle, LogOut, ClipboardList, Zap, Clock, ChevronRight, User, GraduationCap
} from "lucide-react";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import useFlashMessage from "../../../hooks/useFlashMessage";
import { Context } from "../../../context/UserContext";
import Image from "../../form/Image";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate(); 
  const { logout, user } = useContext(Context)

  const [showClassModal, setShowClassModal] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [classError, setClassError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const inputRef = useRef(null);
  const { setFlashMessage } = useFlashMessage();
  const [requestUser, setRequestUser] = useState(null)
  const [course_id, setCourse] = useState(null)
  const [class_id, setClassId] = useState(null)
  const [countClass, setCountClass] = useState(0)
  
  const [pendingCount, setPendingCount] = useState(0);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

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
    async function fetchPendingActivities() {
      setIsLoadingActivities(true);
      try {
        const response = await requestData(
          '/form/student/pending', 
          "GET",
          {},
          true
        );

        console.log(response)

        if (response.success === true && response.data && response.data.status === true && response.data.data) {
          const activities = response.data.data.upcomingActivities;
          setPendingCount(response.data.data.pendingCount);
          setUpcomingActivities(activities);
          setCountClass(response.data.data.countClass)

          if (activities.length > 0) {
            setClassId(activities[0].class_id);
          }
        } else {
          throw new Error(response.message || "Erro ao buscar atividades");
        }
      } catch (error) {
        console.error("Erro ao buscar atividades pendentes:", error.message);
        setPendingCount(0);
        setUpcomingActivities([]);
      } finally {
        setIsLoadingActivities(false);
      }
    }

    if (user) {
      fetchPendingActivities();
    }
  }, [user]); 

  useEffect(() => {
    const onKey = (e) => {
      if (!showClassModal || isJoining) return;
      if (e.key === "Escape") setShowClassModal(false);
      if (e.key === "Enter") handleEnterClass();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showClassModal, classCode, isJoining]);

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
      case "desempenho":
        navigate("/student/performance/view");
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
        setFlashMessage(response.message || "Matrícula realizada com sucesso!", "success");
        setShowClassModal(false);
        setClassCode("");
        setCourse(response.data?.course?.id)
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

  const menuItems = [
    { icon: BookOpen, label: "Meu curso", id: "curso" },
    { icon: Users, label: "Turmas", id: "turmas" },
    { icon: Folder, label: "Materiais", id: "materiais" },
    { icon: BarChart3, label: "Desempenho", id: "desempenho" }
  ];

  const getUrgencyClasses = (color) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-linear-to-r from-red-50 to-orange-50",
          border: "border-red-500",
          iconBg: "text-red-600",
          badge: "bg-red-500",
          groupHover: "group-hover:text-red-600"
        };
      case "amber":
        return {
          bg: "bg-linear-to-r from-amber-50 to-yellow-50",
          border: "border-amber-500",
          iconBg: "text-amber-600",
          badge: "bg-amber-500",
          groupHover: "group-hover:text-amber-600"
        };
      default: 
        return {
          bg: "bg-linear-to-r from-blue-50 to-cyan-50",
          border: "border-blue-500",
          iconBg: "text-blue-600",
          badge: "bg-blue-500",
          groupHover: "group-hover:text-blue-600"
        };
    }
  };

  return (
    <div className="flex h-screen bg-linear-to-br from-blue-950 via-indigo-950 to-blue-900">
      <aside className="w-64 bg-blue-950 flex flex-col shadow-2xl">
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

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)} 
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

        <div className="p-3 border-t border-blue-800">
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm hover:scale-105">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-linear-to-br from-gray-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Bem vindo, <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{requestUser?.username}</span>
              </h2>
              <p className="text-gray-600">Continue sua jornada de aprendizado hoje! 🚀</p>
            </div>
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

        {showClassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowClassModal(false)}
            ></div>
            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl z-10 animate-fade-in-up">
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

              <div className="mt-6 flex justify-end gap-3">
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

        <div className="p-8">
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
                  <span className="text-4xl font-bold text-orange-600">
                    {isLoadingActivities ? "..." : pendingCount}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {pendingCount === 1 ? "atividade" : "atividades"}
                  </span>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="text-red-600" size={20} />
                </div>
              </div>
            </div>
            
            <div onClick={() => navigate("/student/courses/list")}  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
               <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-linear-to-br from-green-100 to-green-200 rounded-xl">
                   <Users className="text-green-600" size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 text-lg">Minhas Turmas</h3>
                   <p className="text-sm text-gray-500">Ver progresso</p>
                 </div>
               </div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-green-600">{countClass}</span>
                 <ChevronRight className="text-gray-400" size={20} />
               </div>
            </div>

          </div>

          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Atividades Pendentes</h3>
              </div>
              
              {isLoadingActivities ? (
                <div className="text-center py-8 text-gray-600">
                  <Clock className="mx-auto animate-spin" size={24} />
                  <p className="mt-2">Buscando atividades...</p>
                </div>
              ) : upcomingActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Zap size={24} className="mx-auto mb-2 text-green-500" />
                  <h4 className="font-bold text-lg text-gray-800">Tudo em dia!</h4>
                  <p>Você não possui nenhuma atividade pendente no momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingActivities.map(activity => {
                    const colors = getUrgencyClasses(activity.urgencyColor);
                    return (
                      <div 
                        key={activity.id}
                        className={`${colors.bg} rounded-xl p-5 border-l-4 ${colors.border} hover:shadow-md transition-all cursor-pointer group`}
                        onClick={() => navigate(`/student/simulated/view/${activity.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <FileText className={colors.iconBg} size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`${colors.badge} text-white rounded-lg text-xs font-bold uppercase tracking-wide px-3 py-1`}>
                                  {activity.urgencyLabel}
                                </span>
                              </div>
                              <h4 className="text-gray-900 font-bold text-lg mb-2">
                                {activity.title}
                              </h4>
                              <p className="text-gray-600 text-sm mb-3">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                  <Clock size={16} />
                                  {activity.daysRemaining <= 0 ? "Entrega hoje" : `${activity.daysRemaining} dias restantes`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight 
                            className={`text-gray-400 group-hover:translate-x-2 ${colors.groupHover} transition-all`} 
                            size={24} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

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


            {upcomingActivities.length > 0 && (
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
              <button  onClick={() => navigate(`/student/activities/view/${class_id}`)} className="relative w-full bg-white hover:bg-gray-50 text-amber-600 font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 hover:-translate-y-1">
                <span className="flex items-center justify-center gap-2">
                  Realizar Simulado
                  <ChevronRight size={20} />
                </span>
              </button>
            </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}