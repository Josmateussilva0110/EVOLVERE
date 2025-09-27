import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import useFlashMessage from "../../../hooks/useFlashMessage";

/**
 * Tela de listagem de disciplinas com busca, edição e exclusão,
 * conectada à API do backend.
 */
function DisciplineList() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDisciplines() {
            const response = await requestData('/subjects', 'GET', {}, true)
            console.log(response)
            if(response.success) {
                setLoading(false)
                setDisciplinas(response.data.subjects)
            }
            else {
                setDisciplinas([])
            }
        }
        fetchDisciplines()
    }, [])

    /**
     * Exclui uma disciplina via API e atualiza a lista no estado.
     */
    async function handleDelete(id) {
        const response = await requestData(`/subjects/${id}`, 'DELETE', {}, true)
        if(response.success) {
            setDisciplinas(disciplinas.filter(d => d.id !== id));
            setFlashMessage(response.data.message, 'success')
        }
        else {
            setFlashMessage(response.message, 'error')
        }
    }


    const handleEditar = (id) => {
        navigate(`/coordinator/discipline/edit/${id}`); // Ajuste a rota se necessário
    };

    // Filtra disciplinas com base na busca (usando useMemo para otimização)
    const disciplinasFiltradas = useMemo(() => 
        disciplinas.filter(d =>
            (d.name && d.name.toLowerCase().includes(busca.toLowerCase())) ||
            d.id.toString().includes(busca) ||
            (d.professor_nome && d.professor_nome.toLowerCase().includes(busca.toLowerCase()))
        ), 
        [disciplinas, busca]
    );


    if (error) {
        return <div className="p-4 text-center text-red-600"><strong>Erro:</strong> {error}</div>;
    }

    return (
        <div className="p-4 bg-white min-h-[500px] rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Gerenciar Disciplinas</h1>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
                <input
                    type="text"
                    placeholder="Pesquisar por nome, id ou professor"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                />
                <span className="text-gray-500">🔍</span>
            </div>

            <div className="space-y-3">
                {disciplinasFiltradas.length > 0 ? (
                    disciplinasFiltradas.map(d => (
                        <div key={d.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm transition hover:shadow-md">
                            <div>
                                <p className="font-semibold text-gray-800">{d.name}</p>
                                <p className="text-sm text-gray-600">
                                    Responsável: <span className="font-medium">{d.professor_nome || 'Não atribuído'}</span>
                                </p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                                <button
                                    onClick={() => handleEditar(d.id)}
                                    className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 transition"
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(d.id)}
                                    className="flex items-center gap-1 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition"
                                >
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        <p className="font-semibold">Nenhuma disciplina encontrada.</p>
                        <p className="text-sm mt-1">Clique no botão abaixo para adicionar a primeira disciplina.</p>
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate("/coordinator/discipline/register")}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1"
            >
                ➕ Adicionar Disciplina
            </button>
        </div>
    );
}

export default DisciplineList;

