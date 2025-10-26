import { 
  Users, 
  MessageSquare, 
  FileText,
  Search,
  Filter,
  ChevronRight,
  Bell,
  ArrowLeft
} from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../context/UserContext";
import requestData from "../../../utils/requestApi";


/**
 * ManagementClasses
 *
 * Componente React que exibe e gerencia as turmas de um usuário (professor ou estudante),
 * permitindo visualizar estatísticas, buscar turmas, filtrar por período e acessar detalhes
 * ou ações rápidas de cada turma.
 *
 * Funcionalidades principais:
 * - Exibe estatísticas das turmas e atividades (turmas ativas, notificações).
 * - Permite busca por nome da turma ou professor.
 * - Permite filtragem por período (todas, hoje, esta semana).
 * - Lista turmas com informações detalhadas: professor, quantidade de alunos, progresso,
 *   próxima aula, notificações.
 * - Botões de ação rápida para acessar atividades ou materiais.
 * - Botão principal para acessar a turma.
 * - Feedback visual quando não há turmas correspondentes à busca ou filtros.
 *
 * Entrada:
 * - Nenhuma entrada externa (dados simulados de `turmas` e `estatisticas` são usados internamente).
 *
 * Saída:
 * - JSX que renderiza o dashboard de turmas, filtros, estatísticas e lista de cards de turmas.
 *
 * Estados internos:
 * @state {string} searchQuery - Texto da busca digitado pelo usuário.
 * @state {string} filterActive - Filtro ativo ("todas", "hoje" ou "semana").
 *
 * Dependências:
 * - `lucide-react` para ícones.
 * - `react-router-dom` para navegação com `useNavigate`.
 * - Tailwind CSS para estilização e animações.
 *
 * Observações:
 * - O componente contém animações CSS via `<style jsx>` embutido.
 * - Cards de turmas têm efeitos visuais avançados, incluindo gradientes, sombras e hover.
 */

export default function ManagementClasses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("todas");
  const navigate = useNavigate();
  const { user } = useContext(Context)
  const [classes, setClasses] = useState([])

  const generateRandomColor = () => {
    const colors = [
      { cor: "from-blue-500 to-cyan-500", corClara: "from-blue-50 to-cyan-50" },
      { cor: "from-purple-500 to-pink-500", corClara: "from-purple-50 to-pink-50" },
      { cor: "from-green-500 to-emerald-500", corClara: "from-green-50 to-emerald-50" },
      { cor: "from-orange-500 to-amber-500", corClara: "from-orange-50 to-amber-50" },
      { cor: "from-red-500 to-rose-500", corClara: "from-red-50 to-rose-50" },
      { cor: "from-indigo-500 to-blue-500", corClara: "from-indigo-50 to-blue-50" },
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    async function fetchClasses() {
      const response = await requestData(`/classes/student/${user.id}`, "GET", {}, true);
      console.log("turmas:", response);

      if (response.success && response.data?.classes) {
        const classesWithColors = response.data.classes.map((turma) => {
          const randomColor = generateRandomColor();
          return {
            id: turma.class_id,
            nome: turma.class_name,
            professor: turma.teacher_name,
            alunos: 0, // caso não venha no retorno
            notificacoes: 0,
            cor: randomColor.cor,
            corClara: randomColor.corClara,
          };
        });
        setClasses(classesWithColors);
      }
    }
    if (user?.id) fetchClasses();
  }, [user]);


  const estatisticas = [
    {
      label: "Turmas Ativas",
      valor: "6",
      sublabel: "Este semestre",
      icon: Users,
      cor: "from-blue-500 to-cyan-500",
      corFundo: "from-blue-50 to-cyan-50"
    },
    {
      label: "Atividades",
      valor: "15",
      sublabel: "Notificações novas",
      icon: Bell,
      cor: "from-purple-500 to-pink-500",
      corFundo: "from-purple-50 to-pink-50"
    }
  ];

  const filtros = [
    { id: "todas", label: "Todas" },
    { id: "hoje", label: "Hoje" },
    { id: "semana", label: "Esta Semana" }
  ];

  const turmasFiltradas = classes.filter((turma) => {
    const matchBusca = turma.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      turma.professor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBusca;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 pb-20">
      {/* Header com animação */}
      <div className="mb-8 animate-fadeIn">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
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
            <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-cyan-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative p-4 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Users className="text-white" size={36} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-blue-800 to-indigo-900">
              Minhas Turmas
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Gerencie suas turmas e interaja com colegas e professores</p>
          </div>
        </div>
      </div>

      {/* Estatísticas com efeitos melhorados */}
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
                <div className={`p-4 bg-linear-to-br ${stat.corFundo} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className={`bg-linear-to-br ${stat.cor} bg-clip-text text-transparent`} size={28} strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">{stat.valor}</div>
              <div className="text-sm font-bold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.sublabel}</div>
            </div>
          );
        })}
      </div>

      {/* Filtros e Busca aprimorados */}
      <div className="bg-white rounded-3xl p-7 shadow-xl border-2 border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Buscar turmas ou professores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-linear-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 text-gray-900 font-medium placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl">
              <Filter className="text-gray-500" size={22} strokeWidth={2.5} />
            </div>
            {filtros.map((filtro) => (
              <button
                key={filtro.id}
                onClick={() => setFilterActive(filtro.id)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                  filterActive === filtro.id
                    ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Turmas aprimorada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {turmasFiltradas.map((turma, index) => (
          <div
            key={turma.id}
            style={{ animationDelay: `${index * 100}ms` }}
            className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden hover:shadow-3xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-3 cursor-pointer group animate-slideUp"
          >
            {/* Header do Card aprimorado */}
            <div className={`bg-linear-to-br ${turma.cor} p-8 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-[3] transition-transform duration-700"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="text-white" size={22} strokeWidth={2.5} />
                    </div>
                    {turma.notificacoes > 0 && (
                      <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg animate-bounce">
                        <Bell size={14} strokeWidth={3} />
                        {turma.notificacoes}
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-white mb-3 group-hover:scale-105 transition-transform duration-300">{turma.nome}</h3>
                <p className="text-white/95 text-base font-medium mb-4">Professor: {turma.professor}</p>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                    <Users size={18} strokeWidth={2.5} className="text-white" />
                    <span className="text-white font-bold">{turma.alunos} alunos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo do Card aprimorado */}
            <div className="p-8">
              {/* Ações Rápidas aprimoradas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => navigate(`/student/activities/view/${turma.id}`)}  className="flex flex-col items-center gap-3 p-5 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group/btn transform hover:scale-105 hover:shadow-xl border-2 border-blue-100 hover:border-blue-200">
                  <MessageSquare className="text-blue-600 group-hover/btn:scale-110 transition-transform duration-300" size={26} strokeWidth={2.5} />
                  <span className="text-sm font-bold text-blue-700">Atividades</span>
                </button>
                
                <button onClick={() => navigate(`/student/materials/view/${turma.id}`)} className="flex flex-col items-center gap-3 p-5 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group/btn transform hover:scale-105 hover:shadow-xl border-2 border-green-100 hover:border-green-200">
                  <FileText className="text-green-600 group-hover/btn:scale-110 transition-transform duration-300" size={26} strokeWidth={2.5} />
                  <span className="text-sm font-bold text-green-700">Material</span>
                </button>
              </div>

              {/* Botão Principal aprimorado */}
              <button className={`w-full bg-linear-to-r ${turma.cor} text-white py-4 rounded-2xl font-black text-base hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 group/main shadow-xl`}>
                Acessar Turma
                <ChevronRight size={20} strokeWidth={3} className="group-hover/main:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem quando não há resultados aprimorada */}
      {turmasFiltradas.length === 0 && (
        <div className="bg-white rounded-3xl p-16 shadow-2xl border-2 border-gray-100 text-center animate-fadeIn">
          <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Search className="text-gray-400" size={40} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhuma turma encontrada</h3>
          <p className="text-gray-600 text-lg">Tente ajustar sua busca</p>
        </div>
      )}
    </div>
  );
}