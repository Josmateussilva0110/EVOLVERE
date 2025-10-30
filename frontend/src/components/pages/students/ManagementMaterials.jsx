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
// 1. Importar hooks e utils
import { useState, useEffect } from "react";
// (Ajuste os caminhos se forem diferentes)
import requestData from "../../../utils/requestApi"; 
import formatDateRequests from "../../../utils/formatDateRequests"; 

// 2. Função de ícone (movida para fora do componente)
// (Baseada no seu mock data e no seu exemplo 'MaterialsClass.jsx')
const getFileIcon = (type) => {
  const tipoLower = type?.toLowerCase();
  switch (tipoLower) {
    case "pdf":
      return FileText;
    case "zip":
    case "rar":
    case "arquivo":
      return Archive;
    case "doc":
    case "docx":
      return FileText;
    case "ppt":
    case "pptx":
      return FileText;
    case "png":
    case "jpg":
    case "jpeg":
      return Image;
    case "mp4":
    case "mov":
      return Video;
    case "mp3":
      return Music;
    default:
      return File; // Ícone padrão
  }
};

// 3. Função de cor (movida para fora)
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

export default function ManagementMaterials() {
  // 4. Estados para filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("todos");

  // 5. Estados para dados da API
  const [materials, setMaterials] = useState([]);
  const [estatisticas, setEstatisticas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 6. REMOVER os arrays estáticos 'materiais' e 'estatisticas'

  // 7. useEffect para buscar dados da API
useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await requestData(
          '/materials/student', 
          "GET",   
          {},      
          true     
        );
        

        if (response.success === true && response.data && response.data.status === true && response.data.data) {
          
          // Acessamos o 'data' aninhado
          const backendData = response.data.data;

          const formattedMaterials = backendData.materials.map((mat) => {
            const Icon = getFileIcon(mat.tipo);
            const randomColor = generateRandomColor();
            return {
              ...mat,
              icon: Icon,
              cor: randomColor.cor,
              corClara: randomColor.corClara,
            };
          });
          
          const formattedStats = backendData.stats.map((stat) => ({
              ...stat,
              icon: FolderOpen, 
          }));

          setMaterials(formattedMaterials);
          setEstatisticas(formattedStats);

        } else {
          const errorMessage = response.message || (response.data && response.data.message) || "Erro ao formatar dados";
          throw new Error(errorMessage);
        }

      } catch (error) {
        console.error("Erro no bloco try/catch do fetchData:", error.message);
        setMaterials([]); 
        // Definir como array vazio para evitar crash no .map()
        setEstatisticas([]); 
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, []); // <-- Dependência vazia, pois os filtros são feitos no frontend

  // 10. Filtros (O array de filtros permanece estático)
  const filtros = [
    { id: "todos", label: "Todos" },
    { id: "pdf", label: "PDFs" },
    { id: "arquivo", label: "Arquivos" } // 'arquivo'
  ];

  const materiaisFiltrados = materials.filter((material) => {
    // Lógica de filtro baseada no 'tipo' vindo do backend
    const tipoLower = material.tipo?.toLowerCase();
    let matchFiltro = false;

    if (filterActive === "todos") {
      matchFiltro = true;
    } else if (filterActive === "pdf") {
      matchFiltro = tipoLower === "pdf";
    } else if (filterActive === "arquivo") {
      // 'arquivo' no filtro corresponde a 'zip' ou 'rar'
      matchFiltro = (tipoLower === "zip" || tipoLower === "rar");
    } else {
      // Filtro para outros tipos, caso você adicione (ex: 'doc', 'ppt')
      matchFiltro = tipoLower === filterActive;
    }
    
    // Lógica de busca (igual ao seu mock)
    const matchBusca = material.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       material.disciplina.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFiltro && matchBusca;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 pb-20">
      {/* Header (sem mudanças) */}
      <div className="mb-8 animate-fadeIn">
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
           {/* ... (Seu header animado) ... */}
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

      {/* Estatísticas (agora usa o estado 'estatisticas') */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icon; // Ícone vem do map no 'useEffect'
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

      {/* Filtros e Busca (sem mudanças) */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* ... (Input de Busca) ... */}
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
          {/* ... (Botões de Filtro) ... */}
           <div className="hidden md:block w-px h-10 bg-gray-200"></div>
           <div className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
             <Filter className="text-gray-500" size={20} strokeWidth={2.5} />
           </div>
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

      {/* Lista de Materiais (agora usa dados reais) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="text-center lg:col-span-2 py-12">
            <p className="text-lg font-medium text-gray-600">Carregando materiais...</p>
          </div>
        ) : materiaisFiltrados.length > 0 ? (
          materiaisFiltrados.map((material, index) => {
            const Icon = material.icon; // Ícone vem do 'useEffect'
            return (
              <div
                key={material.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-green-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer group animate-slideUp"
              >
                {/* Header do Card */}
                <div className={`bg-gradient-to-br ${material.cor} p-6 relative overflow-hidden`}>
                   {/* ... (efeitos de fundo) ... */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="text-white" size={24} strokeWidth={2.5} />
                      </div>
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg">
                        <span className="text-white font-bold text-sm capitalize">{material.tipo}</span>
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
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {material.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium mb-3">{material.disciplina}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} strokeWidth={2.5} />
                        {/* Formata a data vinda do banco */}
                        <span>{formatDateRequests(material.data)}</span> 
                      </div>
                    </div>
                  </div>

                  {/* Ações (Link de Download) */}
                  <div className="flex gap-3">
                    <a
                      // Link de download agora usa o 'archive' vindo da API
                      href={`${import.meta.env.VITE_BASE_URL}/${material.archive}?download=true`}
                      download
                      className={`flex-1 bg-gradient-to-r ${material.cor} text-white py-3 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn`}
                    >
                      <Download size={18} strokeWidth={2.5} className="group-hover/btn:animate-bounce" />
                      Baixar
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Mensagem quando não há resultados (agora checa isLoading) */
          <div className="bg-white rounded-3xl p-16 shadow-2xl border-2 border-gray-100 text-center animate-fadeIn lg:col-span-2">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Search className="text-gray-400" size={40} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum material encontrado</h3>
            <p className="text-gray-600 text-lg">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}