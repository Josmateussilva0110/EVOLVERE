import { 
  ClipboardList, 
  FileText, 
  Clock,
  Search,
  Filter,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Play,
  BookOpen
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import formatDateRequests from "../../../utils/formatDateRequests";
import { Context } from "../../../context/UserContext"

/**
 * ActivitySimulated
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

export default function ActivitySimulated() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("todas");
  const { user } = useContext(Context)
  const [form, setForm] = useState([]);
  const { class_id } = useParams();
  const [class_name, setClassName] = useState(null)
  const navigate = useNavigate()

  // 🔹 Função para definir cor e ícone baseados no tipo/nome
  function getVisualAttributes(title) {
    const lower = title.toLowerCase();

    if (lower.includes("prova") || lower.includes("simulado")) {
      return {
        cor: "from-blue-500 to-cyan-500",
        corClara: "from-blue-50 to-cyan-50",
        icon: FileText
      };
    }
    if (lower.includes("trabalho") || lower.includes("projeto")) {
      return {
        cor: "from-green-500 to-emerald-500",
        corClara: "from-green-50 to-emerald-50",
        icon: ClipboardList
      };
    }
    if (lower.includes("exercicio") || lower.includes("atividade")) {
      return {
        cor: "from-orange-500 to-red-500",
        corClara: "from-orange-50 to-red-50",
        icon: ClipboardList
      };
    }
    return {
      cor: "from-gray-400 to-gray-500",
      corClara: "from-gray-50 to-gray-100",
      icon: FileText
    };
  }

  // 🔹 Buscar formulários da turma
  useEffect(() => {
    const data = {
      user_id: user.id
    }
    async function fetchForm() {
      const response = await requestData(`/form/class/${class_id}`, "POST", data, true);
      setClassName(response.data?.class_name)

      if (response.success && response.data?.forms) {
        const data = response.data.forms.map((item) => {
          const { cor, corClara, icon } = getVisualAttributes(item.title);

          // Calcular dias restantes
          const deadlineDate = new Date(item.deadline);
          const hoje = new Date();
          const diff = Math.ceil((deadlineDate - hoje) / (1000 * 60 * 60 * 24));
          const urgente = diff <= 5;

          return {
            id: item.id,
            title: item.title,
            deadline: formatDateRequests(item.deadline),
            diasRestantes: diff,
            urgente,
            disciplina: item.name || "Sem disciplina",
            cor,
            corClara,
            icon,
          };
        });
        setForm(data);
      }
    }
    fetchForm();
  }, [class_id, user]);

  // 🔹 Filtragem dinâmica
  const atividadesFiltradas = form.filter((atividade) => {
    let matchFiltro = true;

    if (filterActive === "urgentes") matchFiltro = atividade.urgente;
    else if (filterActive === "simulados")
      matchFiltro = atividade.title.toLowerCase().includes("simulado");

    const matchBusca =
      atividade.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atividade.disciplina.toLowerCase().includes(searchQuery.toLowerCase());

    return matchFiltro && matchBusca;
  });

  // 🔹 Estatísticas dinâmicas
  const estatisticas = [
    {
      label: "Simulados Pendentes",
      valor: form.length.toString(),
      sublabel: "Para completar",
      icon: ClipboardList,
      cor: "from-blue-500 to-cyan-500",
      corFundo: "from-blue-50 to-cyan-50",
    },
    {
      label: "Simulados Urgentes",
      valor: form.filter((f) => f.urgente).length.toString(),
      sublabel: "Menos de 5 dias",
      icon: AlertCircle,
      cor: "from-red-500 to-rose-500",
      corFundo: "from-red-50 to-rose-50",
    },
  ];

  const filtros = [
    { id: "todas", label: "Todas" },
    { id: "urgentes", label: "Urgentes" },
    { id: "simulados", label: "Simulados" },
  ];


  return (
  <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 pb-20">
    {/* Header */}
    <div className="mb-8 animate-fadeIn">
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
          <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
          <div className="relative p-4 bg-linear-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-2xl">
            <ClipboardList className="text-white" size={36} strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-gray-900 via-blue-800 to-indigo-900">
            Simulados Turma {class_name ? class_name : "Carregando..."}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Acompanhe suas tarefas e prazos de entrega
          </p>
        </div>
      </div>
    </div>

    {/* Estatísticas */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {estatisticas.map((stat, index) => {
        const Icon = stat.icon;
        // escolhe cor sólida do ícone baseada na string stat.cor (gradiente)
        const statIconColorClass = stat.cor.includes("red")
          ? "text-red-600"
          : stat.cor.includes("green")
          ? "text-emerald-600"
          : stat.cor.includes("orange")
          ? "text-orange-500"
          : "text-blue-600";

        return (
          <div
            key={index}
            style={{ animationDelay: `${index * 100}ms` }}
            className="bg-white rounded-3xl p-7 shadow-xl border-2 border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 cursor-pointer group animate-slideUp"
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className={`p-4 bg-linear-to-br ${stat.corFundo} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                {/* ícone com cor sólida (não usa bg-clip-text) */}
                <Icon
                  size={28}
                  strokeWidth={2.5}
                  className={statIconColorClass}
                />
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">
              {stat.valor}
            </div>
            <div className="text-sm font-bold text-gray-700 mb-1">{stat.label}</div>
            <div className="text-xs text-gray-500">{stat.sublabel}</div>
          </div>
        );
      })}
    </div>

    {/* Filtros e busca */}
    <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Buscar simulados ou disciplinas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 text-gray-900 font-medium placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {filtros.map((filtro) => (
            <button
              key={filtro.id}
              onClick={() => setFilterActive(filtro.id)}
              className={`flex-1 md:flex-none px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                filterActive === filtro.id
                  ? "bg-linear-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Lista de atividades */}
    <div className="space-y-6">
      {atividadesFiltradas.map((atividade, index) => {
        const Icon = atividade.icon;

        // escolhe cor sólida do ícone baseada na string atividade.cor (gradiente)
        const atividadeIconColorClass = atividade.cor.includes("blue")
          ? "text-blue-600"
          : atividade.cor.includes("green")
          ? "text-emerald-600"
          : atividade.cor.includes("orange") || atividade.cor.includes("red")
          ? "text-orange-500"
          : "text-gray-600";

        return (
          <div
            key={atividade.id}
            style={{ animationDelay: `${index * 100}ms` }}
            className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer group animate-slideUp"
          >
            <div className="flex flex-col lg:flex-row">
              <div className={`bg-linear-to-br ${atividade.cor} lg:w-2 w-full h-2 lg:h-auto`} />
              <div className="flex-1 p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-4 bg-linear-to-br ${atividade.corClara} rounded-2xl shadow-lg border-2 ${
                        atividade.urgente ? "border-red-200" : "border-gray-100"
                      }`}
                    >
                      {/* ícone do Lucide com cor sólida (visível) */}
                      <Icon
                        size={28}
                        strokeWidth={2.5}
                        className={atividadeIconColorClass}
                      />
                    </div>

                    <div className="flex-1">
                      {atividade.urgente && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold uppercase animate-pulse">
                          Urgente
                        </span>
                      )}

                      <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600">
                        {atividade.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} strokeWidth={2.5} className="text-blue-500" />
                          <span className="font-medium">
                            Prazo: {atividade.deadline ? atividade.deadline : "Sem prazo"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} strokeWidth={2.5} className="text-orange-500" />
                          <span className="font-medium">
                            {atividade.diasRestantes} dias restantes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                        onClick={() => navigate(`/student/simulated/view/${atividade.id}`)}
                        className="w-full bg-linear-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-2xl font-black hover:scale-105 hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                      >
                        <Play size={20} strokeWidth={3} />
                        Iniciar
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {atividadesFiltradas.length === 0 && (
      <div className="bg-white rounded-3xl p-16 shadow-2xl border-2 border-gray-100 text-center animate-fadeIn">
        <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Search className="text-gray-400" size={40} strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Nenhum simulado encontrado
        </h3>
        <p className="text-gray-600 text-lg">Tente ajustar sua busca ou filtros</p>
      </div>
    )}
  </div>
);

}