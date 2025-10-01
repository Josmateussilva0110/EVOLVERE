import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ✅ CORREÇÃO: O caminho de importação foi ajustado para a estrutura de pastas correta.
import requestData from "../../../utils/requestApi";

function DisciplineManagement() {
    // ... (os estados continuam os mesmos)
    const [nome, setNome] = useState("");
    const [professorId, setProfessorId] = useState("");
    const [courseId, setCourseId] = useState(null);
    const [professores, setProfessores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const carregarDadosContextuais = async () => {
            try {
                const sessionRes = await requestData("/user/session", "GET", {}, true);
                if (!sessionRes.success || !sessionRes.data.user?.id) {
                    throw new Error("Sua sessão expirou. Faça login novamente.");
                }
                const userId = sessionRes.data.user.id;

                const coordinatorRes = await requestData(`/user/coordinator/${userId}`, "GET", {}, true);
                if (!coordinatorRes.success || !coordinatorRes.data.user?.course_id) {
                    throw new Error("O coordenador não está associado a nenhum curso.");
                }
                const coordinatorCourseId = coordinatorRes.data.user.course_id;
                setCourseId(coordinatorCourseId);

                const professorsRes = await requestData(`/courses/${coordinatorCourseId}/professors`, "GET", {}, true);
                // ✅ Acessa os dados corretamente (response.data.professores)
                if (professorsRes.success && Array.isArray(professorsRes.data.professores)) {
                    setProfessores(professorsRes.data.professores);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        carregarDadosContextuais();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome.trim() || !courseId || !professorId) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const result = await requestData("/subjects", "POST", {
            name: nome,
            professional_id: parseInt(professorId),
            course_valid_id: courseId
        }, true);
        
        if (result.success) {
            alert("Disciplina cadastrada com sucesso!");
            navigate("/coordinator/discipline/list");
        } else {
            // ✅ Usa a mensagem de erro padronizada da sua função
            alert("Erro ao cadastrar: " + (result.message || "Erro desconhecido"));
        }
    };

    // O JSX (a parte visual) continua exatamente o mesmo
    if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando dados do coordenador...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500"><strong>Erro:</strong> {error}</div>;

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 p-4 relative">
            <button onClick={() => navigate(-1)} className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition">
                <span className="text-lg">←</span> Voltar
            </button>
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Cadastro de Disciplinas</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nome da Disciplina" className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" value={nome} onChange={e => setNome(e.target.value)} required />
                    <select className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={professorId} onChange={e => setProfessorId(e.target.value)} required>
                        <option value="">Selecione o Professor</option>
                        {professores.length === 0 && <option value="" disabled>Nenhum professor encontrado para seu curso</option>}
                        {professores.map(prof => <option key={prof.id} value={prof.id}>{prof.username} ({prof.institution})</option>)}
                    </select>
                    <div className="pt-4">
                        <button type="submit" className="w-full px-16 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">Cadastrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DisciplineManagement;
