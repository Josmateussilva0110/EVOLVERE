import { useState, useEffect, useMemo, useContext } from "react";
import { FiArrowLeft, FiSearch, FiSliders, FiBook, FiUserCheck, FiAlertTriangle, FiEdit, FiTrash, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import useFlashMessage from "../../../hooks/useFlashMessage";
import { Context } from "../../../context/UserContext";

function DisciplineList() {
    // 3. Obter o usuário do contexto
    const { user } = useContext(Context);

    const [disciplinas, setDisciplinas] = useState([]);
    const [busca, setBusca] = useState("");
    const [professorFiltro, setProfessorFiltro] = useState("todos");
    const [ordenacao, setOrdenacao] = useState("nome");
    const [direcao, setDirecao] = useState('asc');
    const [pagina, setPagina] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(8);
    const [modoVisao, setModoVisao] = useState('tabela'); // 'tabela' | 'cartoes'
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSubjects() {
            const response = await requestData(`/courses/${user.id}/subjects`, 'GET', {}, true)
            console.log(response)
            if (response.success) {
                setDisciplinas(response.data.subjects)
            }
        }
        fetchSubjects()
    }, [user])


    /**
     * Exclui uma disciplina via API e atualiza a lista no estado.
     */
    async function handleDelete(id) {
        const response = await requestData(`/subjects/${id}`, 'DELETE', {}, true)
        if (response.success) {
            setDisciplinas(disciplinas.filter(d => d.id !== id));
            setFlashMessage(response.data.message, 'success')
        }
        else {
            setFlashMessage(response.message, 'error')
        }
    }

    const handleEditar = (id) => {
        navigate(`/coordinator/discipline/edit/${id}`);
    };

    // Filtra disciplinas com base na busca (usando useMemo para otimização)
    const disciplinasFiltradas = useMemo(() => {
        // Adicionado um fallback para o caso de disciplinas ser undefined momentaneamente
        const listaInicial = Array.isArray(disciplinas) ? disciplinas : [];

        let lista = listaInicial.filter(d =>
            (d.name && d.name.toLowerCase().includes(busca.toLowerCase())) ||
            d.id?.toString().includes(busca) ||
            (d.professor_nome && d.professor_nome.toLowerCase().includes(busca.toLowerCase()))
        )

        if (professorFiltro !== 'todos') {
            lista = lista.filter(d => (d.professor_nome || 'Nao atribuido') === professorFiltro)
        }

        const factor = direcao === 'asc' ? 1 : -1
        if (ordenacao === 'nome') {
            lista = lista.slice().sort((a, b) => factor * (a.name || '').localeCompare(b.name || ''))
        } else if (ordenacao === 'professor') {
            lista = lista.slice().sort((a, b) => factor * (a.professor_nome || '').localeCompare(b.professor_nome || ''))
        } else if (ordenacao === 'id') {
            lista = lista.slice().sort((a, b) => factor * ((a.id || 0) - (b.id || 0)))
        }

        return lista
    }, [disciplinas, busca, professorFiltro, ordenacao, direcao]);

    const totalPaginas = Math.max(1, Math.ceil(disciplinasFiltradas.length / itensPorPagina))
    const inicio = (pagina - 1) * itensPorPagina
    const paginaAtual = disciplinasFiltradas.slice(inicio, inicio + itensPorPagina)

    // Métricas para cards de resumo
    const { total, atribuídas, semProfessor } = useMemo(() => {
        const t = Array.isArray(disciplinas) ? disciplinas.length : 0;
        const a = Array.isArray(disciplinas) ? disciplinas.filter(d => Boolean(d.professor_nome)).length : 0;
        return { total: t, atribuídas: a, semProfessor: t - a }
    }, [disciplinas])

    // Utilitários visuais (sem alterações)
    const getInitials = (text = '') => {
        const cleaned = String(text).trim()
        if (!cleaned) return 'NA'
        const parts = cleaned.split(' ')
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    const colorFromString = (str = '') => {
        const palette = [
            'bg-indigo-100 text-indigo-700 ring-indigo-200',
            'bg-sky-100 text-sky-700 ring-sky-200',
            'bg-emerald-100 text-emerald-700 ring-emerald-200',
            'bg-amber-100 text-amber-700 ring-amber-200',
            'bg-rose-100 text-rose-700 ring-rose-200',
            'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200',
        ]
        let hash = 0
        for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i)
        const idx = Math.abs(hash) % palette.length
        return palette[idx]
    }

    const showRoleColumn = user?.id >= 1 && user?.id <= 4

    // O JSX (parte visual) continua exatamente o mesmo
    return (
        <div className="min-h-screen bg-[#060060] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl ring-1 ring-white/20 p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <p className="text-[11px] uppercase tracking-widest text-[#060060]/80 font-semibold">Administração</p>
                            <h1 className="mt-1 text-[34px] leading-8 font-black text-gray-900">Gerenciar Disciplinas</h1>
                            <p className="text-sm text-gray-600 mt-1">Aqui você pode cadastrar, editar e visualizar as disciplinas do seu curso.</p>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200/50 p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-600">Total</p>
                                        <p className="text-2xl font-extrabold text-slate-900">{total}</p>
                                    </div>
                                    <div className="text-[#060060] text-2xl"><FiBook /></div>
                                </div>
                                <div className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200/50 p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-600">Com professor</p>
                                        <p className="text-2xl font-extrabold text-slate-900">{atribuídas}</p>
                                    </div>
                                    <div className="text-slate-600 text-2xl"><FiUserCheck /></div>
                                </div>
                                <div className="rounded-2xl bg-amber-50/80 ring-1 ring-amber-200/50 p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-amber-700">Sem professor</p>
                                        <p className="text-2xl font-extrabold text-amber-800">{semProfessor}</p>
                                    </div>
                                    <div className="text-amber-600 text-2xl"><FiAlertTriangle /></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={() => navigate('/coordinator')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100/80 transition">
                                <FiArrowLeft /> Voltar
                            </button>
                            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50/80 p-1">
                                <button onClick={() => setModoVisao('tabela')} className={`px-3 py-2 text-sm rounded-lg transition ${modoVisao === 'tabela' ? 'bg-[#060060] text-white' : 'text-slate-700 hover:bg-slate-100/80'}`}>▦ Tabela</button>
                                <button onClick={() => setModoVisao('cartoes')} className={`px-3 py-2 text-sm rounded-lg transition ${modoVisao === 'cartoes' ? 'bg-[#060060] text-white' : 'text-slate-700 hover:bg-slate-100/80'}`}>▢ Cartões</button>
                            </div>
                            <button onClick={() => navigate('/coordinator/discipline/register')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg hover:from-amber-500 hover:to-yellow-600 transition transform hover:scale-105">
                                + Nova
                            </button>
                        </div>
                    </div>

                    {/* Barra de busca e filtros */}
                    <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-3">
                        <div className="xl:col-span-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm">
                            <span className="mr-2 text-slate-500"><FiSearch /></span>
                            <input
                                type="text"
                                placeholder="Pesquisar por nome, professor ou ID..."
                                value={busca}
                                onChange={e => { setBusca(e.target.value); setPagina(1); }}
                                className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
                            />
                            {busca && (
                                <button onClick={() => setBusca('')} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"><FiX /> Limpar</button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Dropdown compacto de filtros */}
                            <div className="relative">
                                <details className="group">
                                    <summary className="cursor-pointer list-none inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100/80 shadow-sm">
                                        <FiSliders /> Filtros
                                        <span className="text-slate-400 group-open:rotate-180 transition">▾</span>
                                    </summary>
                                    <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl p-3 z-10">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-slate-600 mb-1">Ordenar por</p>
                                                <div className="flex items-center gap-2">
                                                    <select value={ordenacao} onChange={(e) => { setOrdenacao(e.target.value); setPagina(1); }} className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700">
                                                        <option value="nome">Nome</option>
                                                        <option value="professor">Professor</option>
                                                        <option value="id">ID</option>
                                                    </select>
                                                    <select value={direcao} onChange={(e) => { setDirecao(e.target.value); setPagina(1); }} className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700">
                                                        <option value="asc">Asc</option>
                                                        <option value="desc">Desc</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-600 mb-1">Professor</p>
                                                <select value={professorFiltro} onChange={(e) => { setProfessorFiltro(e.target.value); setPagina(1); }} className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700">
                                                    <option value="todos">Todos</option>
                                                    {Array.from(new Set(disciplinas.map(d => d.professor_nome || 'Nao atribuido'))).map((p) => (
                                                        <option key={p} value={p}>{p === 'Nao atribuido' ? 'Não atribuído' : p}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                <button onMouseDown={() => { setBusca(''); setProfessorFiltro('todos'); setOrdenacao('nome'); setDirecao('asc'); setPagina(1); }} className="flex-1 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100/80">Limpar</button>
                                                <button onMouseDown={() => { /* somente fecha o dropdown */ }} className="flex-1 rounded-xl bg-[#060060] px-3 py-2 text-sm text-white hover:bg-[#0c0cb0]">Aplicar</button>
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* Chips de filtros ativos */}
                    {(busca || professorFiltro !== 'todos' || ordenacao !== 'nome' || direcao !== 'asc') && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {busca && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 text-xs px-3 py-1">
                                    Busca: "{busca}"
                                    <button onClick={() => { setBusca(''); setPagina(1); }} className="text-slate-500 hover:text-slate-800"><FiX /></button>
                                </span>
                            )}
                            {professorFiltro !== 'todos' && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 text-xs px-3 py-1">
                                    Professor: {professorFiltro === 'Nao atribuido' ? 'Não atribuído' : professorFiltro}
                                    <button onClick={() => { setProfessorFiltro('todos'); setPagina(1); }} className="text-slate-600 hover:text-slate-800"><FiX /></button>
                                </span>
                            )}
                            {(ordenacao !== 'nome' || direcao !== 'asc') && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-xs px-3 py-1">
                                    Ordenação: {ordenacao} {direcao}
                                    <button onClick={() => { setOrdenacao('nome'); setDirecao('asc'); setPagina(1); }} className="text-amber-700 hover:text-amber-900"><FiX /></button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Conteúdo */}
                    <div className="mt-6">
                        {/* Tabela de disciplinas */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-separate border-spacing-y-3">
                                <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur">
                                    <tr>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-3 py-2">ID</th>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-3 py-2">Nome</th>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-3 py-2">Professor</th>
                                        {/* Coluna condicional */}
                                        {showRoleColumn && (
                                            <th className="text-left text-xs font-semibold text-slate-600 px-3 py-2">Curso</th>
                                        )}
                                        <th className="text-right text-xs font-semibold text-slate-600 px-3 py-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginaAtual.length > 0 ? (
                                        paginaAtual.map((d) => (
                                            <tr
                                                key={d.id}
                                                className="bg-white ring-1 ring-slate-200 rounded-2xl shadow-sm hover:shadow transition"
                                            >
                                                <td className="px-3 py-4 text-sm text-slate-700">{d.id}</td>
                                                <td className="px-3 py-4 text-sm font-medium text-slate-900">{d.name}</td>

                                                <td className="px-3 py-4 text-sm text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ${colorFromString(
                                                                d.professor_nome || "NA"
                                                            )}`}
                                                        >
                                                            <span className="text-[10px] font-bold">
                                                                {d.professor_nome ? getInitials(d.professor_nome) : "NA"}
                                                            </span>
                                                        </span>
                                                        <span>{d.professor_nome || "Não atribuído"}</span>
                                                        <span
                                                            className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${d.professor_nome
                                                                    ? "bg-slate-50 text-slate-700 ring-slate-200"
                                                                    : "bg-amber-50 text-amber-700 ring-amber-200"
                                                                }`}
                                                        >
                                                            {d.professor_nome ? "Atribuída" : "Sem professor"}
                                                        </span>
                                                    </div>
                                                </td>
                                                {/* Coluna Curso condicional */}
                                                {showRoleColumn && (
                                                    <td className="px-3 py-4 text-sm text-slate-700">
                                                        {d.course_name || "Não informado"}
                                                    </td>
                                                )}
                                                <td className="px-3 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditar(d.id)}
                                                            className="inline-flex items-center gap-2 rounded-lg bg-amber-50 text-amber-800 px-3 py-2 text-xs font-medium ring-1 ring-amber-200 hover:bg-amber-100 transition"
                                                        >
                                                            <FiEdit /> Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(d.id)}
                                                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-xs font-medium ring-1 ring-red-200 hover:bg-red-100 transition"
                                                        >
                                                            <FiTrash /> Excluir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={showRoleColumn ? 5 : 4} // ajustar colSpan dinamicamente
                                                className="text-center py-10 text-slate-500 text-sm"
                                            >
                                                Nenhuma disciplina encontrada para este curso.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default DisciplineList;

