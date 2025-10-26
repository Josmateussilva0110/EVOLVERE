import { 
  Folder, 
  FileText, 
  Download,
  Search,
  Filter,
  Archive,
  Calendar,
  ArrowLeft,
  FolderOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import requestData from "../../../utils/requestApi";
import { useNavigate, useParams } from "react-router-dom";
import formatDateRequests from "../../../utils/formatDateRequests"


/**
 * MaterialsClass
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

export default function MaterialsClass() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("todos");
  const navigate = useNavigate()
  const { class_id } = useParams()
  const [materials, setMaterials] = useState([])
  const [total_materials, setTotalMaterials] = useState(0)

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

    const getFileIcon = (type) => {
      switch (type?.toLowerCase()) {
        case "pdf":
          return <FileText size={16} className="text-white" />;
        case "zip":
        case "rar":
          return <Archive size={16} className="text-white" />;
        case "doc":
        case "docx":
          return <FileText size={16} className="text-white" />;
        case "ppt":
        case "pptx":
          return <Folder size={16} className="text-white" />;
        default:
          return <FolderOpen size={16} className="text-white" />;
      }
    };



  useEffect(() => {
    async function fetchMaterials() {
      const response = await requestData(`/material/class/${class_id}`, "GET", {}, true);
      console.log(response)

      if (response.success && response.data?.materials) {
        const total = response.data.total_materials;

        const MaterialsWithColors = response.data.materials.map((material) => {
          const randomColor = generateRandomColor();
          return {
            id: material.id,
            nome: material.title,
            type_file: material.type_file,
            archive: material.archive,
            class_name: material.class_name, 
            date: material.updated_at,
            cor: randomColor.cor,
            corClara: randomColor.corClara,
          };
        });

        setMaterials(MaterialsWithColors);
        setTotalMaterials(total);
      }
    }

    if (class_id) fetchMaterials()
  }, [class_id])



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

  const materiaisFiltrados = materials.filter((material) => {
    const matchFiltro = filterActive === "todos" || material.type_file === filterActive;
    const matchBusca = material?.nome.toLowerCase().includes(searchQuery.toLowerCase())
    return matchFiltro && matchBusca;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 pb-20">
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
            <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative p-4 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Folder className="text-white" size={36} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-green-800 to-emerald-900">
              Turma {materials.length > 0 ? materials[0].class_name : "Carregando..."}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Acesse e baixe todos os materiais das suas disciplinas</p>
          </div>
        </div>
      </div>

      {/* Estatística de Materiais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="bg-white rounded-3xl p-7 shadow-xl border-2 border-gray-100 
          hover:shadow-2xl hover:border-green-200 transition-all duration-300 
          hover:-translate-y-2 cursor-pointer group animate-slideUp"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Archive size={28} strokeWidth={2.5} className="text-white" />
            </div>
          </div>

          <div className="text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">
            {total_materials}
          </div>
          <div className="text-sm font-bold text-gray-700 mb-1">Total de Materiais</div>
          <div className="text-xs text-gray-500">Arquivos disponíveis</div>
        </div>
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
                    ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-300/50"
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
          return (
            <div
              key={material.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-green-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer group animate-slideUp"
            >
              {/* Header do Card */}
              <div className={`bg-linear-to-br ${material.cor} p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/30 backdrop-blur-md rounded-lg shadow-sm">
                      {getFileIcon(material.type_file)}
                      <span className="text-white font-semibold text-sm tracking-wide capitalize">
                        {material.type_file}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                {/* Informações do Material */}
                <div className="mb-4">
                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {material.nome}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} strokeWidth={2.5} />
                      <span>{formatDateRequests(material.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <a
                    href={`${import.meta.env.VITE_BASE_URL}/${material.archive}?download=true`}
                    download
                    className={`flex-1 bg-linear-to-r ${material.cor} text-white py-3 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn`}
                  >
                    <Download size={18} strokeWidth={2.5} className="group-hover/btn:animate-bounce" />
                    Baixar
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há resultados */}
      {materiaisFiltrados.length === 0 && (
        <div className="bg-white rounded-3xl p-16 shadow-2xl border-2 border-gray-100 text-center animate-fadeIn">
          <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Search className="text-gray-400" size={40} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum material encontrado</h3>
          <p className="text-gray-600 text-lg">Tente ajustar sua busca ou filtros</p>
        </div>
      )}
    </div>
  );
}