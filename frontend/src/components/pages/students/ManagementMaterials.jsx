import { 
  Folder, 
  FileText, 
  Download,
  Search,
  Filter,
  File,
  Archive,
  Image,
  Video,
  Music,
  ChevronRight,
  Calendar,
  Eye,
  Share2,
  ArrowLeft,
  FolderOpen,
  Clock,
  HardDrive
} from "lucide-react";
import { useState } from "react";

/**
 * ManagementMaterials
 *
 * Componente React que exibe e gerencia materiais de aula de diferentes disciplinas,
 * permitindo busca, filtros por tipo de arquivo e download direto.
 *
 * Funcionalidades principais:
 * - Header com botão de voltar, título do módulo e ícone animado.
 * - Estatísticas resumidas sobre os materiais (ex.: total de materiais disponíveis).
 * - Barra de busca para pesquisar por título ou disciplina.
 * - Filtros por categoria de material (Todos, PDFs, Arquivos ZIP, etc.).
 * - Lista de materiais renderizada em cards com:
 *   - Tipo de arquivo e ícone correspondente.
 *   - Tamanho, data, disciplina e título do material.
 *   - Botão para baixar o material.
 * - Feedback visual quando nenhum resultado é encontrado.
 * - Animações em fade-in e slide-up para cards e seções.
 *
 * Entrada:
 * - Estado interno controlado por useState:
 *   @state {string} searchQuery - Texto da busca para filtrar títulos e disciplinas.
 *   @state {string} filterActive - Categoria ativa do filtro ("todos", "pdf", "arquivo").
 *
 * - Dados simulados internos:
 *   @var {Array} materiais - Lista de materiais com campos:
 *     - id: number
 *     - titulo: string
 *     - tipo: string (ex.: "PDF", "ZIP", "PPTX")
 *     - tamanho: string (ex.: "2.1 MB")
 *     - data: string (ex.: "15 Out 2024")
 *     - disciplina: string (ex.: "Estruturas de Dados")
 *     - cor: string (gradiente para o header do card)
 *     - corClara: string (gradiente claro para fundos)
 *     - icon: componente React do lucide-react (ex.: FileText, Archive)
 *     - categoria: string ("pdf" | "arquivo" | etc.)
 *   @var {Array} estatisticas - Lista de estatísticas com campos:
 *     - label: string (ex.: "Total de Materiais")
 *     - valor: string (ex.: "24")
 *     - sublabel: string (ex.: "Arquivos disponíveis")
 *     - icon: componente React do lucide-react (ex.: FolderOpen)
 *     - cor: string (gradiente do ícone)
 *     - corFundo: string (gradiente de fundo do card)
 *   @var {Array} filtros - Lista de filtros de categoria com campos:
 *     - id: string ("todos", "pdf", "arquivo")
 *     - label: string ("Todos", "PDFs", "Arquivos")
 *
 * Saída:
 * - JSX que renderiza:
 *   - Header com botão voltar, título e ícone animado.
 *   - Cards de estatísticas.
 *   - Barra de busca e filtros de categoria.
 *   - Grid de cards de materiais filtrados com informações e botão de download.
 *   - Mensagem de feedback quando nenhum material corresponde aos filtros.
 *
 * Observações:
 * - Cards e estatísticas possuem animações (fade-in, slide-up e transformações ao hover).
 * - Gradientes e cores são usadas para diferenciar tipos de materiais e destacar elementos.
 * - Busca e filtros podem ser combinados.
 * - Responsivo e compatível com diferentes tamanhos de tela.
 */

export default function ManagementMaterials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("todos");

  const materiais = [
    { 
      id: 1,
      titulo: "Aula 1 - Estruturas de Dados", 
      tipo: "PDF", 
      tamanho: "2.1 MB",
      data: "15 Out 2024",
      disciplina: "Estruturas de Dados",
      cor: "from-red-500 to-rose-500",
      corClara: "from-red-50 to-rose-50",
      icon: FileText,
      categoria: "pdf"
    },
    { 
      id: 2,
      titulo: "Projeto Banco de Dados", 
      tipo: "ZIP", 
      tamanho: "5.4 MB",
      data: "12 Out 2024",
      disciplina: "Banco de Dados",
      cor: "from-purple-500 to-pink-500",
      corClara: "from-purple-50 to-pink-50",
      icon: Archive,
      categoria: "arquivo"
    },
    { 
      id: 3,
      titulo: "Slides - Engenharia de Software", 
      tipo: "PPTX", 
      tamanho: "8.7 MB",
      data: "10 Out 2024",
      disciplina: "Engenharia de Software",
      cor: "from-orange-500 to-amber-500",
      corClara: "from-orange-50 to-amber-50",
      icon: FileText,
      categoria: "pdf"
    },
    { 
      id: 4,
      titulo: "Exercícios Resolvidos - Redes", 
      tipo: "PDF", 
      tamanho: "1.8 MB",
      data: "08 Out 2024",
      disciplina: "Redes de Computadores",
      cor: "from-blue-500 to-cyan-500",
      corClara: "from-blue-50 to-cyan-50",
      icon: FileText,
      categoria: "pdf"
    },
    { 
      id: 5,
      titulo: "Código Fonte - Sistema Web", 
      tipo: "ZIP", 
      tamanho: "12.3 MB",
      data: "05 Out 2024",
      disciplina: "Desenvolvimento Web",
      cor: "from-green-500 to-emerald-500",
      corClara: "from-green-50 to-emerald-50",
      icon: Archive,
      categoria: "arquivo"
    },
    { 
      id: 6,
      titulo: "Apostila Completa - SO", 
      tipo: "PDF", 
      tamanho: "15.6 MB",
      data: "03 Out 2024",
      disciplina: "Sistemas Operacionais",
      cor: "from-indigo-500 to-blue-500",
      corClara: "from-indigo-50 to-blue-50",
      icon: FileText,
      categoria: "pdf"
    }
  ];

  const estatisticas = [
    {
      label: "Total de Materiais",
      valor: "24",
      sublabel: "Arquivos disponíveis",
      icon: FolderOpen,
      cor: "from-blue-500 to-cyan-500",
      corFundo: "from-blue-50 to-cyan-50"
    },
  ];

  const filtros = [
    { id: "todos", label: "Todos" },
    { id: "pdf", label: "PDFs" },
    { id: "arquivo", label: "Arquivos" }
  ];

  const materiaisFiltrados = materiais.filter((material) => {
    const matchFiltro = filterActive === "todos" || material.categoria === filterActive;
    const matchBusca = material.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      material.disciplina.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFiltro && matchBusca;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 pb-20">
      {/* Header com animação */}
      <div className="mb-8 animate-fadeIn">
        {/* Botão Voltar */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-6 px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-gray-200 hover:border-green-300"
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Folder className="text-white" size={36} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900">
              Materiais de Aula
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Acesse e baixe todos os materiais das suas disciplinas</p>
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
              className="bg-white rounded-3xl p-7 shadow-xl border-2 border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300 hover:-translate-y-2 cursor-pointer group animate-slideUp"
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
              placeholder="Buscar materiais ou disciplinas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-300 focus:border-green-400 transition-all duration-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-300/50"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Materiais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {materiaisFiltrados.map((material, index) => {
          const Icon = material.icon;
          return (
            <div
              key={material.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-green-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer group animate-slideUp"
            >
              {/* Header do Card */}
              <div className={`bg-gradient-to-br ${material.cor} p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={24} strokeWidth={2.5} />
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg">
                      <span className="text-white font-bold text-sm">{material.tipo}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/90 text-xs font-medium mb-1">Tamanho</div>
                    <div className="text-white font-bold text-sm">{material.tamanho}</div>
                  </div>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                {/* Informações do Material */}
                <div className="mb-4">
                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {material.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mb-3">{material.disciplina}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} strokeWidth={2.5} />
                      <span>{material.data}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <button className={`flex-1 bg-gradient-to-r ${material.cor} text-white py-3 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn`}>
                    <Download size={18} strokeWidth={2.5} className="group-hover/btn:animate-bounce" />
                    Baixar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há resultados */}
      {materiaisFiltrados.length === 0 && (
        <div className="bg-white rounded-3xl p-16 shadow-2xl border-2 border-gray-100 text-center animate-fadeIn">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Search className="text-gray-400" size={40} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum material encontrado</h3>
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