import { 
  ClipboardList, 
  FileText, 
  Clock,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Trophy,
  Target,
  ChevronRight,
  Play,
  BookOpen,
  Award
} from "lucide-react";
import { useState } from "react";

/**
 * ManagementActivity
 *
 * Componente React que exibe uma interface de gerenciamento de atividades e simulados
 * de um estudante. Permite visualizar estatísticas, filtrar por urgência ou tipo,
 * buscar atividades pelo nome ou disciplina, e acessar detalhes ou iniciar atividades.
 *
 * Funcionalidades principais:
 * - Exibe estatísticas de atividades (pendentes, urgentes, etc.).
 * - Permite busca por nome da atividade ou disciplina.
 * - Permite filtragem por tipo de atividade (todas, urgentes, simulados).
 * - Lista atividades com informações detalhadas: prazo, dias restantes, disciplina, urgência, tipo.
 * - Botões para iniciar atividade ou ver detalhes.
 * - Feedback visual quando não há atividades correspondentes à busca ou filtros.
 *
 * Entrada:
 * - Nenhuma entrada externa (o componente usa dados internos simulados `atividades` e `estatisticas`).
 *
 * Saída:
 * - JSX que renderiza o dashboard de atividades, filtros, estatísticas e lista de atividades.
 *
 * Estados internos:
 * @state {string} searchQuery - Texto da busca digitado pelo usuário.
 * @state {string} filterActive - Filtro ativo ("todas", "urgentes" ou "simulados").
 *
 * Observações:
 * - Componentes do pacote `lucide-react` são usados como ícones.
 * - Estilos com Tailwind CSS + animações definidas via JSX `<style>` embutido.
 */

export default function ManagementActivity() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("todas");

  const atividades = [
    { 
      id: 1,
      nome: "Prova 1 - Estruturas de Dados", 
      tipo: "Simulado", 
      prazo: "20/05/2025",
      diasRestantes: 5,
      urgente: true,
      disciplina: "Estruturas de Dados",
      cor: "from-red-500 to-rose-500",
      corClara: "from-red-50 to-rose-50",
      icon: FileText,
      status: "pendente"
    },
    { 
      id: 2,
      nome: "Trabalho - Banco de Dados", 
      tipo: "Atividade", 
      prazo: "22/05/2025",
      diasRestantes: 7,
      urgente: false,
      disciplina: "Banco de Dados",
      duracao: "Livre",
      cor: "from-amber-500 to-yellow-500",
      corClara: "from-amber-50 to-yellow-50",
      icon: ClipboardList,
      status: "pendente"
    },
    { 
      id: 3,
      nome: "Quiz - Engenharia de Software", 
      tipo: "Simulado", 
      prazo: "25/05/2025",
      diasRestantes: 10,
      urgente: false,
      disciplina: "Engenharia de Software",
      duracao: "30 minutos",
      cor: "from-blue-500 to-cyan-500",
      corClara: "from-blue-50 to-cyan-50",
      icon: FileText,
      status: "pendente"
    },
    { 
      id: 4,
      nome: "Projeto Final - Desenvolvimento Web", 
      tipo: "Atividade", 
      prazo: "30/05/2025",
      diasRestantes: 15,
      urgente: false,
      disciplina: "Desenvolvimento Web",
      duracao: "Livre",
      cor: "from-green-500 to-emerald-500",
      corClara: "from-green-50 to-emerald-50",
      icon: ClipboardList,
      status: "pendente"
    },
    { 
      id: 5,
      nome: "Exercícios - Redes de Computadores", 
      tipo: "Atividade", 
      prazo: "18/05/2025",
      diasRestantes: 3,
      urgente: true,
      disciplina: "Redes de Computadores",
      duracao: "Livre",
      cor: "from-orange-500 to-red-500",
      corClara: "from-orange-50 to-red-50",
      icon: ClipboardList,
      status: "pendente"
    }
  ];

  const estatisticas = [
    {
      label: "Atividades Pendentes",
      valor: "5",
      sublabel: "Para completar",
      icon: ClipboardList,
      cor: "from-blue-500 to-cyan-500",
      corFundo: "from-blue-50 to-cyan-50"
    },
    {
      label: "Atividades Urgentes",
      valor: "2",
      sublabel: "Menos de 5 dias",
      icon: AlertCircle,
      cor: "from-red-500 to-rose-500",
      corFundo: "from-red-50 to-rose-50"
    },
  ];

  const filtros = [
    { id: "todas", label: "Todas" },
    { id: "urgentes", label: "Urgentes" },
    { id: "simulados", label: "Simulados" }
  ];

  const atividadesFiltradas = atividades.filter((atividade) => {
    let matchFiltro = true;
    
    if (filterActive === "urgentes") {
      matchFiltro = atividade.urgente;
    } else if (filterActive === "simulados") {
      matchFiltro = atividade.tipo === "Simulado";
    }
    
    const matchBusca = atividade.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      atividade.disciplina.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFiltro && matchBusca;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 pb-20">
      {/* Header com animação */}
      <div className="mb-8 animate-fadeIn">
        {/* Botão Voltar */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-6 px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-gray-200 hover:border-blue-300"
        >
          <ArrowLeft 
            size={20} 
            strokeWidth={2.5} 
            className="group-hover:-translate-x-1 transition-transform duration-300" 
          />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <ClipboardList className="text-white" size={36} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900">
              Atividades e Simulados
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Acompanhe suas tarefas e prazos de entrega</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{ animationDelay: `${index * 100}ms` }}
              className="bg-white rounded-3xl p-7 shadow-xl border-2 border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 cursor-pointer group animate-slideUp"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`p-4 bg-gradient-to-br ${stat.corFundo} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className={`bg-gradient-to-br ${stat.cor} bg-clip-text text-transparent`} size={28} strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">{stat.valor}</div>
              <div className="text-sm font-bold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.sublabel}</div>
            </div>
          );
        })}
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Busca */}
          <div className="relative flex-1 w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Buscar atividades ou disciplinas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 text-gray-900 font-medium placeholder:text-gray-400"
            />
          </div>

          {/* Divisor */}
          <div className="hidden md:block w-px h-10 bg-gray-200"></div>

          {/* Ícone de Filtro */}
          <div className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
            <Filter className="text-gray-500" size={20} strokeWidth={2.5} />
          </div>

          {/* Filtros */}
          <div className="flex gap-2 w-full md:w-auto">
            {filtros.map((filtro) => (
              <button
                key={filtro.id}
                onClick={() => setFilterActive(filtro.id)}
                className={`flex-1 md:flex-none px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                  filterActive === filtro.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-300/50"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="space-y-6">
        {atividadesFiltradas.map((atividade, index) => {
          const Icon = atividade.icon;
          return (
            <div
              key={atividade.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer group animate-slideUp"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Header Lateral Colorido */}
                <div className={`bg-gradient-to-br ${atividade.cor} lg:w-2 w-full h-2 lg:h-auto relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 group-hover:scale-150 transition-transform duration-700"></div>
                </div>

                {/* Conteúdo Principal */}
                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Informações da Atividade */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Ícone */}
                      <div className={`p-4 bg-gradient-to-br ${atividade.corClara} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg border-2 ${atividade.urgente ? 'border-red-200' : 'border-gray-100'}`}>
                        <Icon className={`bg-gradient-to-br ${atividade.cor} bg-clip-text text-transparent`} size={28} strokeWidth={2.5} />
                      </div>

                      {/* Detalhes */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {atividade.urgente && (
                            <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold uppercase animate-pulse">
                              Urgente
                            </span>
                          )}
                          <span className={`px-3 py-1 bg-gradient-to-r ${atividade.corClara} rounded-lg text-xs font-bold`}>
                            {atividade.tipo}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {atividade.nome}
                        </h3>
                        
                        <p className="text-sm text-gray-600 font-medium mb-3">{atividade.disciplina}</p>

                        {/* Informações Adicionais */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={16} strokeWidth={2.5} className="text-blue-500" />
                            <span className="font-medium">Prazo: {atividade.prazo}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} strokeWidth={2.5} className="text-orange-500" />
                            <span className="font-medium">{atividade.diasRestantes} dias restantes</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botão de Ação */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      <button className={`w-full bg-gradient-to-r ${atividade.cor} text-white py-4 rounded-2xl font-black text-base hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 group/btn shadow-xl`}>
                        <Play size={20} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                        Iniciar
                      </button>
                      
                      <button className="w-full bg-gray-50 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2">
                        <BookOpen size={18} strokeWidth={2.5} />
                        Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há resultados */}
      {atividadesFiltradas.length === 0 && (
        <div className="bg-white rounded-3xl p-16 shadow-2xl border-2 border-gray-100 text-center animate-fadeIn">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Search className="text-gray-400" size={40} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhuma atividade encontrada</h3>
          <p className="text-gray-600 text-lg">Tente ajustar sua busca ou filtros</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}