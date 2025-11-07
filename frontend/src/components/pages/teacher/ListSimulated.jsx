import { Eye, ChevronLeft, ChevronRight, BookOpen, Search, XCircle } from "lucide-react"
import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"

/**
 * SimuladosList
 *
 * Componente React que exibe uma lista de simulados acadêmicos,
 * permitindo filtrar por disciplina e status, paginar os resultados e visualizar detalhes.
 *
 * Funcionalidades principais:
 * - Header com título e ícone
 * - Filtros:
 *   - Input para disciplina
 *   - Select para status (Corrigido, Pendente)
 *   - Botão para limpar filtros
 * - Cards de simulados:
 *   - Nome do simulado
 *   - Disciplina
 *   - Status com badge visual (Corrigido/Pendente)
 *   - Botão de visualização
 * - Paginação:
 *   - Navegação entre páginas com botões de anterior/próximo
 *   - Exibição do número da página atual
 * - Layout responsivo com animações nos cards e interações
 *
 * Estados internos:
 * - simulados: lista de simulados (mock inicial)
 * - filtroDisciplina: string para filtrar disciplina
 * - filtroStatus: string para filtrar status
 * - page: número da página atual
 *
 * Constantes:
 * - ITEMS_PER_PAGE: quantidade de simulados exibidos por página
 *
 * Funcionalidades derivadas:
 * - simuladosFiltrados: lista de simulados após aplicação de filtros
 * - totalPages: número total de páginas
 * - pageSimulados: simulados exibidos na página atual
 *
 * Entrada:
 * - Dados simulados (simuladosMock) com campos:
 *   - nome: string (nome do simulado)
 *   - disciplina: string (nome da disciplina)
 *   - status: string ("Corrigido" ou "Pendente")
 *
 * Saída:
 * - JSX que renderiza:
 *   - Header com título
 *   - Filtros e botão limpar
 *   - Lista de cards de simulados paginados
 *   - Paginação interativa
 *   - Mensagem quando nenhum simulado é encontrado
 *
 * Observações:
 * - Layout inclui elementos decorativos e gradientes
 * - Badge de status muda de cor e ícone conforme o estado
 * - Paginação desativa botões quando não há mais páginas
 */



/**
 * @component StatusBadge
 * @description
 * Um componente de UI reutilizável que renderiza um selo (badge) visualmente distinto
 * para representar o status de um item, como "Corrigido" ou "Pendente".
 * A cor e o estilo do selo mudam de acordo com o status fornecido.
 *
 * @param {object} props - As propriedades do componente.
 * @param {'Corrigido' | 'Pendente'} props.status - O status a ser exibido. Determina a estilização do badge.
 * @returns {JSX.Element} Um elemento <span> estilizado que representa o status.
 *
 * @example
 * <StatusBadge status="Corrigido" />
 * <StatusBadge status="Pendente" />
 */
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5";
  if (status === true) {
    return (
      <span className={`${baseClasses} bg-green-500/10 text-green-400`}>
        <span className="w-2 h-2 rounded-full bg-green-400"></span>
        Corrigido
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-amber-500/10 text-amber-400`}>
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
      Pendente
    </span>
  );
};

/**
 * @component SimuladosList
 * @description
 * Componente de página principal que exibe uma lista de simulados.
 * Inclui funcionalidades como busca por disciplina, filtro por status e paginação.
 * O componente gerencia seu próprio estado para filtros e dados da página atual.
 *
 * @returns {JSX.Element} A página completa de listagem de simulados.
 *
 * @feature Cabeçalho com título e botão para criar novo simulado.
 * @feature Barra de filtros interativa para refinar os resultados.
 * @feature Tabela de dados que exibe os simulados de forma organizada.
 * @feature Paginação para navegar por grandes conjuntos de dados.
 * @feature Mensagem de "nenhum resultado" quando os filtros não retornam dados.
 */
export default function SimuladosList() {
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const navigate = useNavigate()
  const { user } = useContext(Context)
  const [form, setForm] = useState([])
  const { subject_id } = useParams()



  useEffect(() => {
    async function fetchForm() {
      const response = await requestData(`/form/correction/${subject_id}`, 'GET', {}, true)
      console.log(response)

      if (response && response.success) {
        const rawData = response.data;
        const data = Array.isArray(rawData) ? rawData : Object.values(rawData).filter(item => typeof item === "object")
        setForm(data)
      } else {
        setForm([])
      }
    }
    fetchForm()
  }, [user])


  // Lógica de filtro e paginação
  const simuladosFiltrados = form.filter(s =>
    (!filtroDisciplina || s.title.toLowerCase().includes(filtroDisciplina.toLowerCase())) &&
    (!filtroStatus || s.status === filtroStatus)
  );

  const totalPages = Math.max(1, Math.ceil(simuladosFiltrados.length / ITEMS_PER_PAGE));
  const pageSimulados = simuladosFiltrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /**
   * @function limparFiltros
   * @description Reseta os estados de filtro para seus valores iniciais e
   * retorna para a primeira página da lista.
   */
  const limparFiltros = () => {
    setFiltroDisciplina("");
    setFiltroStatus("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Meus Simulados</h1>
            <p className="text-slate-400 mt-1">Visualize, filtre e gerencie suas avaliações.</p>
          </div>
        </header>

        {/* Container da Tabela e Filtros */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">

          {/* Barra de Filtros */}
          <div className="p-5 flex flex-col sm:flex-row gap-4 items-center border-b border-slate-700/50">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Filtrar por disciplina..."
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder:text-slate-400 text-slate-100"
                value={filtroDisciplina}
                onChange={e => { setFiltroDisciplina(e.target.value); setPage(1); }}
              />
            </div>

            <select
              className="w-full sm:w-56 bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition text-slate-100"
              value={filtroStatus}
              onChange={e => { setFiltroStatus(e.target.value); setPage(1); }}
            >
              <option value="" className="bg-slate-800 text-slate-300">Todos os Status</option>
              <option value="Corrigido" className="bg-slate-800 text-slate-300">Corrigido</option>
              <option value="Pendente" className="bg-slate-800 text-slate-300">Pendente</option>
            </select>

            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
              onClick={limparFiltros}
            >
              <XCircle className="w-4 h-4 text-blue-400" />
              Limpar Filtros
            </button>
          </div>  

          {/* Tabela de Dados */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-700/50">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold text-slate-300">Nome do Simulado</th>
                  <th className="px-5 py-4 text-sm font-semibold text-slate-300">Turma</th>
                  <th className="px-5 py-4 text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-5 py-4 text-sm font-semibold text-slate-300 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageSimulados.length > 0 ? (
                  pageSimulados.map((sim, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/50 transition-colors border-b border-slate-800 last:border-b-0">
                      <td className="px-5 py-4">
                        <div onClick={() => navigate(`/teacher/simulated/response/list/${sim.form_id}`)} className="font-medium text-white">{sim.title}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{sim.name}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={sim.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          className="p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors"
                          title="Visualizar detalhes"
                        >
                          <Eye className="w-5 h-5 text-blue-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-16 px-5 text-slate-400">
                      <BookOpen className="w-10 h-10 mx-auto mb-4 text-blue-400 opacity-40" />
                      Nenhum simulado encontrado com os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Rodapé com Paginação */}
          {totalPages > 1 && (
            <div className="p-5 flex flex-col sm:flex-row justify-between items-center border-t border-slate-700/50">
              <span className="text-sm text-slate-400 mb-4 sm:mb-0">
                Página {page} de {totalPages}
              </span>
              <div className="flex gap-2 items-center">
                <button
                  className="p-2 rounded-md hover:bg-slate-700 transition disabled:opacity-40 disabled:hover:bg-transparent"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5 text-blue-400" />
                </button>
                <button
                  className="p-2 rounded-md hover:bg-slate-700 transition disabled:opacity-40 disabled:hover:bg-transparent"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Próxima página"
                >
                  <ChevronRight className="w-5 h-5 text-blue-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
