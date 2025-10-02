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
  User,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useState } from "react";

export default function EstruturaDados() {
  const [activeSection, setActiveSection] = useState("materiais");
  const [filtroTipo, setFiltroTipo] = useState({ atividade: false, prova: false, material: false });
  const [filtroPeriodo, setFiltroPeriodo] = useState({ "2025.2": false, "2024.1": false, "2023.2": false });
  const [filtroStatus, setFiltroStatus] = useState({ concluido: false, pendente: false, todos: true });
  const [tipoAberto, setTipoAberto] = useState(true);
  const [periodoAberto, setPeriodoAberto] = useState(true);
  const [statusAberto, setStatusAberto] = useState(false);
  const [modalTurmasAberto, setModalTurmasAberto] = useState(false);

  const turmas = [
    { nome: "Turma A - Manhã", horario: "08:00 - 10:00", alunos: 35, professor: "Prof. Silva" },
    { nome: "Turma B - Tarde", horario: "14:00 - 16:00", alunos: 28, professor: "Prof. Silva" },
    { nome: "Turma C - Noite", horario: "19:00 - 21:00", alunos: 32, professor: "Prof. Santos" },
  ];

  const menuItems = [
    { icon: BookOpen, label: "Meu curso", id: "curso" },
    { icon: Users, label: "Turmas", id: "turmas" },
    { icon: Folder, label: "Materiais", id: "materiais" },
    { icon: ClipboardList, label: "Atividades/Simulados", id: "atividades" },
    { icon: BarChart3, label: "Desempenho", id: "desempenho" },
    { icon: Award, label: "Medalhas", id: "medalhas" },
  ];

  const todasAtividades = [
    { titulo: "Introdução a ponteiros", tipo: "Material", periodo: "2025.2", data: "Criada em 10/09", status: "pendente" },
    { titulo: "Exercício de ponteiros", tipo: "Atividade", periodo: "2025.2", data: "Criada em 11/09", status: "pendente" },
    { titulo: "Exercício de ponteiros", tipo: "Atividade", periodo: "2024.1", data: "Criada em 11/04", status: "concluido" },
    { titulo: "Exercício de ponteiros", tipo: "Atividade", periodo: "2024.1", data: "Criada em 11/03", status: "concluido" },
    { titulo: "Prova de estruturas", tipo: "Prova", periodo: "2023.2", data: "Criada em 05/12", status: "concluido" },
  ];

  const atividadesFiltradas = todasAtividades.filter(ativ => {
    const tipoSelecionado = Object.values(filtroTipo).some(v => v);
    const periodoSelecionado = Object.values(filtroPeriodo).some(v => v);
    
    const tipoMatch = !tipoSelecionado || filtroTipo[ativ.tipo.toLowerCase()];
    const periodoMatch = !periodoSelecionado || filtroPeriodo[ativ.periodo];
    const statusMatch = filtroStatus.todos || filtroStatus[ativ.status];
    
    return tipoMatch && periodoMatch && statusMatch;
  });

  const filtrosAtivos = [
    ...Object.keys(filtroTipo).filter(k => filtroTipo[k]).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
    ...Object.keys(filtroPeriodo).filter(k => filtroPeriodo[k]),
    ...(filtroStatus.concluido ? ['Concluído'] : []),
    ...(filtroStatus.pendente ? ['Pendente'] : [])
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950">
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-gradient-to-b from-slate-900/95 to-blue-950/95 backdrop-blur-xl border-r border-blue-700/30 flex flex-col shadow-2xl">
          <div className="p-6 border-b border-blue-700/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Filter className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Filtros</h2>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-blue-900/30 rounded-xl border border-blue-700/40">
              <span className="text-blue-200 text-sm font-medium">Resultados</span>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-xs font-bold text-white shadow-md">{atividadesFiltradas.length}</span>
            </div>
          </div>

          {filtrosAtivos.length > 0 && (
            <div className="p-4 border-b border-blue-700/30">
              <p className="text-xs font-semibold text-blue-300 mb-3 uppercase tracking-wide">Ativos</p>
              <div className="flex flex-wrap gap-2">
                {filtrosAtivos.map((filtro, idx) => (
                  <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 font-bold text-xs shadow-lg hover:shadow-xl transition-all">
                    <span>{filtro}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-blue-700/30">
              <button
                onClick={() => setTipoAberto(!tipoAberto)}
                className="w-full flex items-center justify-between p-5 text-white hover:bg-blue-900/20 transition-all group"
              >
                <span className="font-bold text-base flex items-center gap-2">
                  <FileText size={18} className="text-blue-400" />
                  TIPO
                </span>
                {tipoAberto ? <ChevronUp size={20} className="text-blue-400 group-hover:text-white transition-colors" /> : <ChevronDown size={20} className="text-blue-400 group-hover:text-white transition-colors" />}
              </button>
              {tipoAberto && (
                <div className="px-5 pb-5 space-y-3 bg-blue-950/20">
                  {Object.keys(filtroTipo).map(tipo => (
                    <label key={tipo} className="flex items-center gap-3 text-blue-100 hover:text-white cursor-pointer transition-colors group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-2 border-blue-600 bg-blue-950/50 checked:bg-gradient-to-br checked:from-blue-500 checked:to-indigo-600 cursor-pointer transition-all"
                          checked={filtroTipo[tipo]}
                          onChange={(e) => setFiltroTipo({...filtroTipo, [tipo]: e.target.checked})}
                        />
                      </div>
                      <span className="text-sm font-medium capitalize">{tipo}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-blue-700/30">
              <button
                onClick={() => setPeriodoAberto(!periodoAberto)}
                className="w-full flex items-center justify-between p-5 text-white hover:bg-blue-900/20 transition-all group"
              >
                <span className="font-bold text-base flex items-center gap-2">
                  <Calendar size={18} className="text-blue-400" />
                  PERÍODO
                </span>
                {periodoAberto ? <ChevronUp size={20} className="text-blue-400 group-hover:text-white transition-colors" /> : <ChevronDown size={20} className="text-blue-400 group-hover:text-white transition-colors" />}
              </button>
              {periodoAberto && (
                <div className="px-5 pb-5 space-y-3 bg-blue-950/20">
                  {Object.keys(filtroPeriodo).map(periodo => (
                    <label key={periodo} className="flex items-center gap-3 text-blue-100 hover:text-white cursor-pointer transition-colors group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-2 border-blue-600 bg-blue-950/50 checked:bg-gradient-to-br checked:from-blue-500 checked:to-indigo-600 cursor-pointer transition-all"
                        checked={filtroPeriodo[periodo]}
                        onChange={(e) => setFiltroPeriodo({...filtroPeriodo, [periodo]: e.target.checked})}
                      />
                      <span className="text-sm font-medium">{periodo}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-blue-700/30">
              <button
                onClick={() => setStatusAberto(!statusAberto)}
                className="w-full flex items-center justify-between p-5 text-white hover:bg-blue-900/20 transition-all group"
              >
                <span className="font-bold text-base flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-400" />
                  STATUS
                </span>
                {statusAberto ? <ChevronUp size={20} className="text-blue-400 group-hover:text-white transition-colors" /> : <ChevronDown size={20} className="text-blue-400 group-hover:text-white transition-colors" />}
              </button>
              {statusAberto && (
                <div className="px-5 pb-5 space-y-3 bg-purple-950/20">
                  <label className="flex items-center gap-3 text-purple-100 hover:text-white cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      name="status"
                      className="w-5 h-5"
                      checked={filtroStatus.todos}
                      onChange={() => setFiltroStatus({concluido: false, pendente: false, todos: true})}
                    />
                    <span className="text-sm font-medium">Todos</span>
                  </label>
                  <label className="flex items-center gap-3 text-purple-100 hover:text-white cursor-pointer transition-colors">
                    <input 
                      type="radio"
                      name="status" 
                      className="w-5 h-5"
                      checked={filtroStatus.concluido}
                      onChange={() => setFiltroStatus({concluido: true, pendente: false, todos: false})}
                    />
                    <span className="text-sm font-medium">Concluído</span>
                  </label>
                  <label className="flex items-center gap-3 text-purple-100 hover:text-white cursor-pointer transition-colors">
                    <input 
                      type="radio"
                      name="status" 
                      className="w-5 h-5"
                      checked={filtroStatus.pendente}
                      onChange={() => setFiltroStatus({concluido: false, pendente: true, todos: false})}
                    />
                    <span className="text-sm font-medium">Pendente</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-purple-50">
          <div className="max-w-7xl mx-auto p-8 sm:p-10 lg:p-12">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#060060] to-purple-900 bg-clip-text text-transparent mb-2">Estrutura de dados 1</h1>
                <p className="text-gray-600">Gerencie seus materiais e atividades</p>
              </div>
              <button 
                onClick={() => setModalTurmasAberto(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#060060] to-purple-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1">
                <Users size={22} />
                Turmas
              </button>
            </div>

            <div className="space-y-5">
              {atividadesFiltradas.map((atividade, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-purple-200 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl ${
                          atividade.tipo === "Material" ? "bg-gray-200" : 
                          atividade.tipo === "Prova" ? "bg-red-100" : "bg-blue-100"
                        }`}>
                          {atividade.tipo === "Material" ? <Folder size={20} className="text-gray-700" /> :
                           atividade.tipo === "Prova" ? <FileText size={20} className="text-red-700" /> :
                           <ClipboardList size={20} className="text-blue-700" />}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {atividade.titulo}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-md ${
                          atividade.tipo === "Material" ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800" : 
                          atividade.tipo === "Prova" ? "bg-gradient-to-r from-red-500 to-pink-600 text-white" :
                          "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                        }`}>
                          {atividade.tipo}
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-200 rounded-xl font-bold text-amber-700">
                          <Calendar size={16} />
                          {atividade.periodo}
                        </span>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                          atividade.status === "concluido" 
                            ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700" 
                            : "bg-orange-50 border-2 border-orange-200 text-orange-700"
                        }`}>
                          {atividade.status === "concluido" ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          {atividade.status === "concluido" ? "Concluído" : "Pendente"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-xl">{atividade.data}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {atividadesFiltradas.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-4">
                    <Filter className="text-purple-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-gray-600">Ajuste os filtros para ver mais conteúdo</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Turmas */}
      {modalTurmasAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
                  <Users className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Turmas Disponíveis</h2>
                  <p className="text-blue-100 text-sm">Estrutura de dados 1</p>
                </div>
              </div>
              <button 
                onClick={() => setModalTurmasAberto(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="text-white" size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid gap-4">
                {turmas.map((turma, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                            <Users className="text-white" size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {turma.nome}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-gray-500" size={16} />
                            <span className="text-sm text-gray-700 font-medium">{turma.horario}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="text-gray-500" size={16} />
                            <span className="text-sm text-gray-700 font-medium">{turma.alunos} alunos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="text-gray-500" size={16} />
                            <span className="text-sm text-gray-700 font-medium">{turma.professor}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all hover:scale-105">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}