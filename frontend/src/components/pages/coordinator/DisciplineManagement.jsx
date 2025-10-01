import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiAlertCircle, FiLoader, FiBookOpen, FiUser, FiCheck } from "react-icons/fi";

/**
 * Componente com formulário para cadastrar uma nova disciplina.
 */
function DisciplineManagement() {
    const [nome, setNome] = useState("");
    const [professor, setProfessor] = useState("");
    const [professores, setProfessores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setLoading(true);
                setError(null);
                const responseProfessores = await fetch("/api/users/professores");

                if (!responseProfessores.ok) throw new Error("Falha ao carregar professores.");

                const professoresData = await responseProfessores.json();
                
                if (professoresData.status && Array.isArray(professoresData.professores)) {
                    setProfessores(professoresData.professores);
                } else {
                    setProfessores([]);
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!nome.trim() || !professor) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const response = await fetch("/api/subjects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nome,
                    professional_id: parseInt(professor),
                    course_valid_id: 2
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
        return (
            <div className="min-h-screen bg-[#060060] flex items-center justify-center">
                <div className="inline-flex items-center gap-3 text-white/80 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl">
                    <FiLoader className="animate-spin w-5 h-5" />
                    <span className="font-medium">Carregando dados...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#060060] flex items-center justify-center p-6">
                <div className="max-w-lg w-full mx-auto bg-white/95 backdrop-blur-sm ring-1 ring-red-200/50 rounded-3xl p-6 text-red-700 shadow-2xl">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <FiAlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Não foi possível carregar os dados</p>
                            <p className="text-sm mt-1 text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060060] p-6">
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-2xl">
                    <div className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl ring-1 ring-white/20">
                        <div className="px-8 pt-8 pb-6 border-b border-slate-200/50">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 transition-all duration-200 font-medium"
                                    type="button"
                                >
                                    <FiArrowLeft className="w-4 h-4" /> Voltar
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 flex items-center justify-center shadow-lg">
                                    <FiBookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Cadastro de Disciplinas</h2>
                                    <p className="text-slate-600 mt-1">Preencha os campos abaixo para registrar uma nova disciplina.</p>
                                </div>
                            </div>
                        </div>

                        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">Nome da disciplina</label>
                                <input
                                    type="text"
                                    placeholder="Ex.: Cálculo Diferencial e Integral I"
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all duration-200"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    required
                                />
                                <p className="mt-2 text-xs text-slate-500">Use um nome claro e padronizado.</p>
                            </div>


                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">Professor</label>
                                <div className="relative">
                                    <select
                                        className="appearance-none w-full px-4 py-3.5 rounded-xl bg-slate-50/80 text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all duration-200"
                                        value={professor}
                                        onChange={e => setProfessor(e.target.value)}
                                        required
                                    >
                                        <option value="">Selecione o professor</option>
                                        {professores.map(prof => (
                                            <option key={prof.id} value={prof.id}>
                                                {prof.username} ({prof.institution})
                                            </option>
                                        ))}
                                    </select>
                                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">▾</span>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">Somente professores ativos aparecem na lista.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-500 hover:to-yellow-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <FiCheck className="w-5 h-5" /> Cadastrar disciplina
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DisciplineManagement;
