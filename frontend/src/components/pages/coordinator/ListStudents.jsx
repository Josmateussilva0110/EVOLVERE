import { useNavigate } from "react-router-dom";
import requestData from "../../../utils/requestApi.js";
import { useMemo, useState, useEffect, useContext} from "react";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { FiSearch, FiUsers, FiUserCheck, FiPause, FiX } from "react-icons/fi";
import { Context } from "../../../context/UserContext"

/**
 * ListStudents
 *
 * Componente responsável por **listar e gerenciar estudantes cadastrados** na plataforma.
 *
 * Funcionalidades:
 * - Exibe uma tabela com estudantes cadastrados.
 * - Permite filtrar por nome, e-mail, turma e status (Ativo/Inativo).
 * - Busca dinâmica com input e filtros combinados.
 * - Exibe chips de filtros ativos.
 * - Paginação configurável com visualização de número de registros por página.
 * - Métricas de total de alunos, alunos ativos e inativos.
 * - Permite excluir um estudante com confirmação.
 * - Visualizar detalhes básicos do aluno (ícone de olho, ainda sem detalhe expandido).
 *
 * Entradas:
 * - Não recebe props diretamente.
 * - Usa dados da API de estudantes via `requestData`.
 *
 * Estados locais:
 * - `alunos` → lista completa de alunos carregados.
 * - `loading` → indica que os dados estão sendo carregados.
 * - `error` → mensagem de erro caso a API falhe.
 * - `busca` → texto digitado para busca.
 * - `turmaFiltro` → filtro por turma.
 * - `statusFiltro` → filtro por status.
 * - `pagina` → página atual da tabela.
 * - `itensPorPagina` → quantidade de itens por página.
 *
 * Navegação:
 * - Botão Voltar → retorna à página anterior (`window.history.back()`).
 *
 * Utilitários internos:
 * - `getTurmaFromDate(dateString)` → calcula a turma com base na data de criação do aluno.
 * - `getInitials(fullName)` → gera iniciais do aluno para avatar.
 * - `colorFromName(name)` → gera cor do avatar baseado no nome do aluno.
 * - `handleLimparFiltros()` → limpa todos os filtros e reseta a página.
 * - `handleExcluir(id)` → exclui aluno via API após confirmação.
 *
 * Filtros:
 * - Nome ou e-mail → busca textual.
 * - Turma → dropdown com turmas únicas presentes nos alunos.
 * - Status → Ativo ou Inativo.
 *
 * Paginação:
 * - Calcula início e fim dos itens com base na página atual e itens por página.
 * - Renderiza botões de página dinamicamente.
 *
 * Métricas:
 * - Total de alunos filtrados.
 * - Total de alunos ativos.
 * - Total de alunos inativos.
 *
 * Saída:
 * - JSX completo com:
 *   - Cabeçalho com título e botão voltar.
 *   - Métricas.
 *   - Barra de busca e filtros.
 *   - Chips de filtros ativos.
 *   - Tabela de alunos com avatar, nome, e-mail, turma, status e ações.
 *   - Paginação.
 *
 * Exemplo de uso:
 * ```jsx
 * <ListStudents />
 *
 * // Interações do usuário:
 * setBusca("João");
 * setTurmaFiltro("2025.1");
 * setStatusFiltro("Ativo");
 * handleExcluir(12);
 * ```
 *
 * @component
 * @returns {JSX.Element} Tela de listagem e gerenciamento de estudantes.
 */
const getTurmaFromDate = (dateString) => {
  if (!dateString) return "N/D";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() é 0-indexed (0-11)
  const semester = month >= 1 && month <= 6 ? 1 : 2; // Jan-Jun = .1, Jul-Dez = .2
  return `${year}.${semester}`;
};

function ListStudents() {
  // Estados
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(Context)

  // Filtros
  const [busca, setBusca] = useState("");
  const [turmaFiltro, setTurmaFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  // Paginação
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  const navigate = useNavigate();

  // Busca os dados da API
  useEffect(() => {
    const fetchAlunos = async () => {
      const response = await requestData(`/users/students/${user.id}`, "GET", {}, true);
      console.log(response)
      if (response.success) {
        
        const alunosComTurma = response.data.data.map((aluno) => ({
          ...aluno,
          turma: getTurmaFromDate(aluno.created_at),
          statusLabel: aluno.status === 1 ? "Ativo" : "Inativo",
        }));
        setAlunos(alunosComTurma);
      }
      setLoading(false);
    };
    fetchAlunos();
  }, [user]);

  // Turmas únicas para dropdown
  const turmasDisponiveis = useMemo(() => {
    const turmas = alunos.map((aluno) => aluno.turma);
    return [...new Set(turmas)].sort().reverse();
  }, [alunos]);

  // Alunos filtrados
  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) => {
      const buscaLower = busca.toLowerCase();
      const matchBusca = busca
        ? aluno.username.toLowerCase().includes(buscaLower) ||
          aluno.email.toLowerCase().includes(buscaLower)
        : true;
      const matchTurma = turmaFiltro ? aluno.turma === turmaFiltro : true;
      const matchStatus = statusFiltro
        ? aluno.statusLabel === statusFiltro
        : true;

      return matchBusca && matchTurma && matchStatus;
    });
  }, [alunos, busca, turmaFiltro, statusFiltro]);

  // Paginação
  const inicioIndex = (pagina - 1) * itensPorPagina;
  const alunosPagina = alunosFiltrados.slice(
    inicioIndex,
    inicioIndex + itensPorPagina
  );
  const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);

  // Métricas
  const { totalRegistros, totalAtivos, totalInativos } = useMemo(() => {
    const total = alunosFiltrados.length;
    const ativos = alunosFiltrados.filter((u) => u.statusLabel === "Ativo")
      .length;
    return {
      totalRegistros: total,
      totalAtivos: ativos,
      totalInativos: total - ativos,
    };
  }, [alunosFiltrados]);

  // Funções utilitárias
  const getInitials = (fullName) => {
    if (!fullName) return "??";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const colorFromName = (name) => {
    const colors = [
      "bg-indigo-100 text-indigo-700 ring-indigo-200",
      "bg-blue-100 text-blue-700 ring-blue-200",
      "bg-emerald-100 text-emerald-700 ring-emerald-200",
      "bg-amber-100 text-amber-700 ring-amber-200",
      "bg-rose-100 text-rose-700 ring-rose-200",
      "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  const handleLimparFiltros = () => {
    setBusca("");
    setTurmaFiltro("");
    setStatusFiltro("");
    setPagina(1);
  };

  const handleExcluir = async (id) => {
    if (
      window.confirm(
        "Deseja realmente excluir este aluno? Esta ação não pode ser desfeita."
      )
    ) {
      const response = await requestData(
        `/users/students/${id}`,
        "DELETE",
        {},
        true
      );
      if (response.success) {
        setAlunos(alunos.filter((a) => a.id !== id));
      } else {
        alert(response.message || "Erro ao excluir aluno.");
      }
    }
  };

  const handleVoltar = () => {
    window.history.back();
  };

  if (loading) return <div className="p-4 text-center">A carregar alunos...</div>;
  if (error)
    return (
      <div className="p-4 text-center text-red-600">Erro: {error}</div>
    );

  return (
    <div className="min-h-screen bg-[#060060] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl ring-1 ring-white/20 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={handleVoltar}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-[#060060] font-medium"
            >
              <FaArrowLeft /> Voltar
            </button>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-[#060060]/80 font-semibold">
                Administração
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                Lista de Estudantes
              </h1>
              <p className="text-sm text-slate-600">
                Gerencie e visualize estudantes cadastrados.
              </p>
            </div>
          </div>

          {/* Métricas */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Total</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {totalRegistros}
                </p>
              </div>
              <div className="text-[#060060] text-2xl">
                <FiUsers />
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Ativos</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {totalAtivos}
                </p>
              </div>
              <div className="text-slate-600 text-2xl">
                <FiUserCheck />
              </div>
            </div>
            <div className="rounded-2xl bg-amber-50/80 ring-1 ring-amber-200/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-700">Inativos</p>
                <p className="text-2xl font-extrabold text-amber-800">
                  {totalInativos}
                </p>
              </div>
              <div className="text-amber-600 text-2xl">
                <FiPause />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto mt-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl ring-1 ring-white/20 p-6 md:p-8">
          {/* Barra de busca */}
          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm">
            <span className="mr-2 text-slate-500">
              <FiSearch />
              Ver
            </span>
            <input
              type="text"
              placeholder="Buscar nome, e-mail ou turma"
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
            />
            {busca && (
              <button
                onClick={() => setBusca("")}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
              >
                <FiX /> Limpar
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select
              className="flex-1 min-w-[180px] rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700"
              value={turmaFiltro}
              onChange={(e) => {
                setTurmaFiltro(e.target.value);
                setPagina(1);
              }}
            >
              <option value="">Turma</option>
              {turmasDisponiveis.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              className="flex-1 min-w-[180px] rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700"
              value={statusFiltro}
              onChange={(e) => {
                setStatusFiltro(e.target.value);
                setPagina(1);
              }}
            >
              <option value="">Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <button
              onClick={handleLimparFiltros}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-400 to-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg hover:from-amber-500 hover:to-yellow-600 transition transform hover:scale-105"
            >
              Limpar filtros
            </button>
          </div>

          {/* Chips de filtros ativos */}
          {(busca || turmaFiltro || statusFiltro) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {busca && (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 text-xs px-3 py-1">
                  Busca: "{busca}"
                  <button
                    onClick={() => {
                      setBusca("");
                      setPagina(1);
                    }}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    <FiX />
                  </button>
                </span>
              )}
              {turmaFiltro && (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 text-xs px-3 py-1">
                  Turma: {turmaFiltro}
                  <button
                    onClick={() => {
                      setTurmaFiltro("");
                      setPagina(1);
                    }}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    <FiX />
                  </button>
                </span>
              )}
              {statusFiltro && (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-xs px-3 py-1">
                  Status: {statusFiltro}
                  <button
                    onClick={() => {
                      setStatusFiltro("");
                      setPagina(1);
                    }}
                    className="text-amber-700 hover:text-amber-900"
                  >
                    <FiX />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Tabela */}
          <div className="mt-6 overflow-x-auto bg-white shadow rounded-2xl ring-1 ring-slate-200">
            {alunosFiltrados.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center ring-1 ring-slate-200 text-slate-500">
                  <FiSearch />
                </div>
                <p className="text-slate-900 font-semibold">
                  Nenhum resultado encontrado
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  Ajuste os filtros ou tente outra busca.
                </p>
                <div className="mt-4">
                  <button
                    onClick={handleLimparFiltros}
                    className="rounded-xl bg-linear-to-r from-amber-400 to-yellow-500 text-slate-900 px-4 py-2 text-sm font-semibold shadow-lg hover:from-amber-500 hover:to-yellow-600 transition transform hover:scale-105"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            ) : (
              <>
                <table className="w-full border-separate border-spacing-y-1 text-slate-700">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">
                        Matrícula
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">
                        Aluno
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">
                        E-mail
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">
                        Turma
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-600 text-center">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosPagina.map((u, i) => (
                      <tr
                        key={u.id}
                        className="bg-white hover:bg-slate-50 transition"
                      >
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {u.registration}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ${colorFromName(
                                u.username
                              )}`}
                            >
                              <span className="text-xs font-bold">
                                {getInitials(u.username)}
                              </span>
                            </span>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">
                                {u.username}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {u.email}
                        </td>
                        <td className="px-4 py-3 text-sm">{u.turma}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${
                              u.statusLabel === "Ativo"
                                ? "bg-slate-50 text-green-700 ring-slate-200"
                                : "bg-amber-50 text-amber-700 ring-amber-200"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                u.statusLabel === "Ativo"
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                              }`}
                            ></span>
                            {u.statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleExcluir(u.id)}
                              className="text-slate-500 hover:text-red-600 text-base"
                              title="Excluir"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginação */}
                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-600">
                    Exibindo {inicioIndex + 1}–{Math.min(inicioIndex + itensPorPagina, alunosFiltrados.length)} de {alunosFiltrados.length}
                  </p>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPaginas }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPagina(i + 1)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          pagina === i + 1
                            ? "bg-[#060060] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListStudents;
