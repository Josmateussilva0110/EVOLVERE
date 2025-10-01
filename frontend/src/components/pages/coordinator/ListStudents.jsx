import React, { useState, useEffect, useMemo } from "react";
// import { FaEye, FaTrash, FaArrowLeft } from "react-icons/fa"; // Removido para evitar erro de dependência
import { useNavigate } from "react-router-dom";
// ✅ CORREÇÃO: O caminho foi ajustado para a estrutura de pastas correta e o nome do ficheiro corrigido.
import requestData from "../../../utils/requestApi.js";

/**
 * Calcula a turma (ex: 2025.1) com base na data de criação do utilizador.
 * @param {string} dateString - A data de criação (ex: '2025-09-30T14:20:00.000Z')
 * @returns {string} A turma formatada.
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
    // Estados para os dados e UI
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para os filtros
    const [busca, setBusca] = useState("");
    const [turmaFiltro, setTurmaFiltro] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");
    
    // Estado da paginação
    const [pagina, setPagina] = useState(1);
    const itensPorPagina = 5;

    const navigate = useNavigate();

    // Busca os dados dos alunos da API quando o componente é montado
    useEffect(() => {
        const fetchAlunos = async () => {
            const response = await requestData("/users/students", "GET", {}, true);
            if (response.success) {
              console.log(response.data);
                // Adiciona a propriedade 'turma' a cada aluno
                const alunosComTurma = response.data.data.map(aluno => ({
                    ...aluno,
                    turma: getTurmaFromDate(aluno.created_at),
                    statusLabel: aluno.status === 1 ? "Ativo" : "Inativo" // Converte status numérico para texto
                }));
                setAlunos(alunosComTurma);
            } else {
                setError(response.message || "Falha ao buscar alunos.");
            }
            setLoading(false);
        };
        fetchAlunos();
    }, []);

    // Gera a lista de turmas únicas para o dropdown de filtro
    const turmasDisponiveis = useMemo(() => {
        const turmas = alunos.map(aluno => aluno.turma);
        return [...new Set(turmas)].sort().reverse(); // Ordena da mais recente para a mais antiga
    }, [alunos]);

    // Aplica os filtros à lista de alunos
    const alunosFiltrados = useMemo(() => {
        return alunos.filter(aluno => {
            const buscaLower = busca.toLowerCase();
            const matchBusca = busca ?
                aluno.username.toLowerCase().includes(buscaLower) ||
                aluno.email.toLowerCase().includes(buscaLower) : true;
            
            const matchTurma = turmaFiltro ? aluno.turma === turmaFiltro : true;
            const matchStatus = statusFiltro ? aluno.statusLabel === statusFiltro : true;

            return matchBusca && matchTurma && matchStatus;
        });
    }, [alunos, busca, turmaFiltro, statusFiltro]);

    // Lógica da paginação
    const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);
    const inicioIndex = (pagina - 1) * itensPorPagina;
    const alunosPagina = alunosFiltrados.slice(inicioIndex, inicioIndex + itensPorPagina);

    // Funções de manipulação de eventos
    const handleLimparFiltros = () => {
        setBusca("");
        setTurmaFiltro("");
        setStatusFiltro("");
        setPagina(1);
    };

    const handleExcluir = async (id) => {
        if (window.confirm("Deseja realmente excluir este aluno? Esta ação não pode ser desfeita.")) {
            const response = await requestData(`/users/students/${id}`, "DELETE", {}, true);
            if (response.success) {
                setAlunos(alunos.filter(a => a.id !== id));
            } else {
                alert(response.message || "Erro ao excluir aluno.");
            }
        }
    };
    
    if (loading) return <div className="p-4 text-center">A carregar alunos...</div>;
    if (error) return <div className="p-4 text-center text-red-600">Erro: {error}</div>;

    return (
        <div className="relative flex flex-col items-center min-h-full bg-gray-50 py-8 px-6">
            <button onClick={() => navigate(-1)} className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium">
                <span className="text-lg">←</span> Voltar
            </button>

            <div className="w-full max-w-6xl mt-12">
                <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <select
                        className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={turmaFiltro}
                        onChange={e => setTurmaFiltro(e.target.value)}
                    >
                        <option value="">Todas as Turmas</option>
                        {turmasDisponiveis.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    <select
                        className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={statusFiltro}
                        onChange={e => setStatusFiltro(e.target.value)}
                    >
                        <option value="">Todos os Status</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>

                    <button
                        onClick={handleLimparFiltros}
                        className="md:col-start-4 px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
                    >
                        Limpar filtros
                    </button>
                </div>

                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full border-collapse text-gray-700">
                        <thead className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase">
                            <tr>
                                <th className="p-4">Nome</th>
                                <th className="p-4">E-mail</th>
                                <th className="p-4">Início</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunosPagina.length > 0 ? alunosPagina.map(aluno => (
                                <tr key={aluno.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{aluno.username}</td>
                                    <td className="p-4">{aluno.email}</td>
                                    <td className="p-4">{aluno.turma}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${aluno.statusLabel === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {aluno.statusLabel}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-4">
                                        <button className="text-gray-500 hover:text-indigo-600 text-lg">👁️</button>
                                        <button onClick={() => handleExcluir(aluno.id)} className="text-gray-500 hover:text-red-600 text-lg">🗑️</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-8 text-gray-500">Nenhum aluno encontrado com os filtros aplicados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-end items-center border-t px-4 py-2 gap-2 text-sm">
                        <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)} className="px-2 py-1 disabled:text-gray-300 disabled:cursor-not-allowed">◀ Anterior</button>
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-md font-semibold">{pagina}</span>
                        <button disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)} className="px-2 py-1 disabled:text-gray-300 disabled:cursor-not-allowed">Próximo ▶</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListStudents;

