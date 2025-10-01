import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
// ✅ CORREÇÃO: O caminho de importação foi ajustado para a estrutura de pastas correta.
import requestData from "../../../utils/requestApi";

function DisciplineManagement() {
    // ... (os estados continuam os mesmos)
    const [nome, setNome] = useState("");
    const [professorId, setProfessorId] = useState("");
    const [courseId, setCourseId] = useState(null);
=======

/**
 * Componente com formulário para cadastrar uma nova disciplina.
 */
function DisciplineManagement() {
    const [nome, setNome] = useState("");
    const [curso, setCurso] = useState("");
    const [professor, setProfessor] = useState("");
    const [cursos, setCursos] = useState([]);
>>>>>>> fad5b1a15e362f1cd58b209d2afc62ff701d91e9
    const [professores, setProfessores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
<<<<<<< HEAD
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
=======
        const carregarDados = async () => {
            try {
                setLoading(true);
                setError(null);
                const responseCursos = fetch("/api/courses");
                const responseProfessores = fetch("/api/users/professores");

                const [cursosRes, professoresRes] = await Promise.all([responseCursos, responseProfessores]);

                if (!cursosRes.ok) throw new Error("Falha ao carregar cursos.");

                const cursosData = await cursosRes.json();
                const professoresData = await professoresRes.json();
                
                if (cursosData.status) setCursos(cursosData.courses);
                
                if (professoresData.status && Array.isArray(professoresData.professores)) {
                    setProfessores(professoresData.professores);
                } else {
                    setProfessores([]);
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
>>>>>>> fad5b1a15e362f1cd58b209d2afc62ff701d91e9
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

<<<<<<< HEAD
        carregarDadosContextuais();
=======
        carregarDados();
>>>>>>> fad5b1a15e362f1cd58b209d2afc62ff701d91e9
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD
        if (!nome.trim() || !courseId || !professorId) {
=======
        
        if (!nome.trim() || !curso || !professor) {
>>>>>>> fad5b1a15e362f1cd58b209d2afc62ff701d91e9
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

<<<<<<< HEAD
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
=======
        try {
            const response = await fetch("/api/subjects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nome,
                    professional_id: parseInt(professor),
                    course_valid_id: parseInt(curso)
                })
            });
            
            const result = await response.json();
            
            if (result.status) {
                alert("Disciplina cadastrada com sucesso!");
                navigate("/coordinator/discipline/list"); // Volta para a lista
            } else {
                alert("Erro ao cadastrar: " + (result.message || "Erro desconhecido"));
            }
        } catch (err) {
            alert("Erro de conexão: " + err.message);
            console.error(err);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }
    
    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">Erro: {error}</div>;
    }

    return (
        // ✅ CORREÇÃO APLICADA AQUI
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 p-4 relative">
            <button 
                onClick={() => navigate(-1)} // Usar navigate(-1) é mais seguro que history.back()
                className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
                <span className="text-lg">←</span>
                Voltar
            </button>

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Cadastro de Disciplinas
                </h2>

                {/* Bloco de Debug Info (opcional, pode remover se não precisar mais) */}
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                    <p className="text-sm text-yellow-800">
                        <strong>Debug Info:</strong><br/>
                        Cursos carregados: {cursos.length} | Professores carregados: {professores.length}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome da Disciplina"
                        className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />

                    <select
                        className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={curso}
                        onChange={e => setCurso(e.target.value)}
                        required
                    >
                        <option value="">Selecione o Curso</option>
                        {cursos.map(cursoItem => (
                            <option key={cursoItem.id} value={cursoItem.id}>
                                {cursoItem.name} - {cursoItem.acronym_IES}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={professor}
                        onChange={e => setProfessor(e.target.value)}
                        required
                    >
                        <option value="">Selecione o Professor</option>
                        {professores.map(prof => (
                            <option key={prof.id} value={prof.id}>
                                {prof.username} ({prof.institution})
                            </option>
                        ))}
                    </select>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full px-16 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                        >
                            Cadastrar
                        </button>
>>>>>>> fad5b1a15e362f1cd58b209d2afc62ff701d91e9
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DisciplineManagement;
<<<<<<< HEAD

=======
>>>>>>> fad5b1a15e362f1cd58b209d2afc62ff701d91e9
