import {
  BookOpen,
  Users,
  Folder,
  FileText,
  BarChart3,
  Award,
  Settings,
  HelpCircle,
  LogOut,
  ClipboardList,
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Star,
  Flame,
  ChevronRight,
  Bell,
  User,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const usuario = "Lucas Emanuel";
  const nivel = 12;
  const xpAtual = 2450;
  const xpProximoNivel = 3000;
  const sequencia = 7;
  const pontos = 8750;

  const progressoXP = (xpAtual / xpProximoNivel) * 100;

  const menuItems = [
    { icon: BookOpen, label: "Meu curso", id: "curso" },
    { icon: Users, label: "Turmas", id: "turmas" },
    { icon: Folder, label: "Materiais", id: "materiais" },
    { icon: ClipboardList, label: "Atividades/Simulados", id: "atividades" },
    { icon: BarChart3, label: "Desempenho", id: "desempenho" },
    { icon: Award, label: "Medalhas", id: "medalhas" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b border-blue-800">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-blue-500/50">
              <User className="text-white transform -rotate-12" size={32} strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {nivel}
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
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 scale-105"
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm hover:scale-105">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Bem vindo, <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{usuario}</span>
              </h2>
              <p className="text-gray-600">Continue sua jornada de aprendizado hoje! 🚀</p>
            </div>

          </div>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
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
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
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
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border-l-4 border-red-500 hover:shadow-md transition-all cursor-pointer group">
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

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border-l-4 border-amber-500 hover:shadow-md transition-all cursor-pointer group">
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
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all cursor-pointer group border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                      <Folder className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">Professor adicionou um novo material</p>
                      <p className="text-gray-500 text-sm">Química Orgânica - Prof. Silva</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:translate-x-2 group-hover:text-blue-600 transition-all" size={24} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all cursor-pointer group border border-green-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
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

            <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl p-6 shadow-xl flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Simulado Disponível!</h3>
                <p className="text-amber-50 mb-6">Teste seus conhecimentos🎯</p>
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