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
  ChevronLeft,
  Search,
  ChevronDown,
  User,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function SistemasInformacao() {
  const [activeSection, setActiveSection] = useState("curso");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Semestre");
  const usuario = "Lucas Emanuel";

  const menuItems = [
    { icon: BookOpen, label: "Meu curso", id: "curso" },
    { icon: Users, label: "Turmas", id: "turmas" },
    { icon: Folder, label: "Materiais", id: "materiais" },
    { icon: ClipboardList, label: "Atividades/Simulados", id: "atividades" },
    { icon: BarChart3, label: "Desempenho", id: "desempenho" },
    { icon: Award, label: "Medalhas", id: "medalhas" },
  ];

  const disciplinas = [
    {
      codigo: "ED1",
      nome: "Professor(es): ÓSEAS",
      alunos: "Qnt. alunos matriculados: 25",
      semestre: "3º Semestre",
      status: "Concluída",
      statusColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      codigo: "ED2",
      nome: "Professor(es): ÓSEAS",
      alunos: "Qnt. alunos matriculados: 25",
      semestre: "4º Semestre",
      status: "Concluída",
      statusColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      codigo: "IHC",
      nome: "Professor(es): ÓSEAS",
      alunos: "Qnt. alunos matriculados: 25",
      semestre: "5º Semestre",
      status: "Em processo",
      statusColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      codigo: "POO1",
      nome: "Professor(es): ÓSEAS",
      alunos: "Qnt. alunos matriculados: 25",
      semestre: "2º Semestre",
      status: "Concluída",
      statusColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      codigo: "POO2",
      nome: "Professor(es): ÓSEAS",
      alunos: "Qnt. alunos matriculados: 25",
      semestre: "3º Semestre",
      status: "Concluída",
      statusColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      codigo: "PWEB1",
      nome: "Professor(es): ÓSEAS",
      alunos: "Qnt. alunos matriculados: 25",
      semestre: "4º Semestre",
      status: "Concluída",
      statusColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  ];

  const filteredDisciplinas = disciplinas.filter((disc) =>
    disc.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content */}
      <main className="w-full min-h-screen">
        {/* Header com breadcrumb - Responsivo */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group">
              <ChevronLeft size={22} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-lg sm:text-xl">Sistemas de Informação</span>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pb-16 sm:pb-20 lg:pb-24">
          {/* Stats Cards - Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-white" size={24} />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total disciplina</p>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">6</p>
              </div>
            </div>

            <div className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Progresso</p>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">76%</p>
              </div>
            </div>

            <div className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-amber-100 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <Award className="text-white" size={24} />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Média</p>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent">8.0157</p>
              </div>
            </div>
          </div>

          {/* Filtros - Responsivo */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Pesquisar disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base text-gray-700 placeholder-gray-400 shadow-sm"
              />
            </div>
            <div className="relative group sm:min-w-[180px]">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="appearance-none w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-sm sm:text-base text-gray-700 shadow-sm font-medium"
              >
                <option>Semestre</option>
                <option>1º Semestre</option>
                <option>2º Semestre</option>
                <option>3º Semestre</option>
                <option>Todos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Grid de Disciplinas - Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredDisciplinas.map((disciplina, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer hover:-translate-y-2 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{disciplina.codigo}</h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="text-gray-400 flex-shrink-0" size={16} />
                      <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">{disciplina.nome}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-400 flex-shrink-0" size={16} />
                      <p className="text-gray-600 text-xs sm:text-sm truncate">{disciplina.alunos}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-400 flex-shrink-0" size={16} />
                      <p className="text-gray-600 text-xs sm:text-sm font-semibold truncate">{disciplina.semestre}</p>
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${disciplina.bgColor} ${disciplina.borderColor} group-hover:scale-105 transition-transform`}>
                    <div className={`w-2 h-2 rounded-full ${disciplina.status === 'Concluída' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                    <span className={`text-xs sm:text-sm font-bold ${disciplina.statusColor}`}>
                      {disciplina.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDisciplinas.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Nenhuma disciplina encontrada</h3>
              <p className="text-sm sm:text-base text-gray-600">Tente buscar por outro termo</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}