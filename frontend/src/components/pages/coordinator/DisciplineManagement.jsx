import { useState, useEffect, useContext } from "react";
// NOVO: Importamos o useParams para ler o ID da URL
import { useNavigate, useParams } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import { FiArrowLeft, FiBookOpen, FiCheck } from "react-icons/fi";
import { Context } from "../../../context/UserContext";
import useFlashMessage from "../../../hooks/useFlashMessage";

function DisciplineManagement() {
    // NOVO: Pegamos o 'id' da URL. Se não houver, será undefined.
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useContext(Context);
    const { setFlashMessage } = useFlashMessage();

    // Os estados continuam os mesmos
    const [nome, setNome] = useState("");
    const [professor, setProfessor] = useState(""); // Usando 'professor' como no seu código original
    const [professores, setProfessores] = useState([]);
    const [coordinator, setCoordinator] = useState({});
    
    // MODIFICADO: Juntamos os useEffects em um só para carregar todos os dados de forma mais eficiente
    useEffect(() => {
        // Só executa se tivermos um usuário logado
        if (user.id) { 
            const carregarDados = async () => {
                try {
                    // 1. Carrega informações do coordenador (como antes)
                    const coordinatorRes = await requestData(`/user/coordinator/${user.id}`, "GET", {}, true);
                    if (!coordinatorRes.success) throw new Error("Falha ao carregar dados do coordenador.");
                    setCoordinator(coordinatorRes.data.user);
                    
                    // 2. Carrega professores do curso do coordenador (como antes)
                    const courseId = coordinatorRes.data.user.course_id;
                    const professorsRes = await requestData(`/courses/${courseId}/professors`, "GET", {}, true);
                    if (professorsRes.success) {
                        setProfessores(professorsRes.data.professores);
                    }

                    // 3. busca os dados da disciplina e edita eles
                    if (id) {
                        const disciplineRes = await requestData(`/subjects/${id}`, "GET", {}, true);
                        
                        if (disciplineRes.success) {
                            const disciplina = disciplineRes.data.data;
                            setNome(disciplina.name);
                            setProfessor(String(disciplina.professional_id)); 
                        } else {
                            throw new Error(disciplineRes.message || "Disciplina não encontrada.");
                        }
                    }
                } catch (error) {
                    setFlashMessage(error.message, "error");
                    navigate(-1); // Volta para a página anterior em caso de erro
                }
            };
            carregarDados();
        }
    }, [id, user.id, navigate, setFlashMessage]); // Adicionamos 'id' e outras dependências

    // MODIFICADO: O handleSubmit agora sabe se deve criar (POST) ou atualizar (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const disciplineData = {
            name: nome,
            professional_id: parseInt(professor),
            course_valid_id: parseInt(coordinator.course_id),
        };
        
        let result;
        if (id) {
            // Modo de Edição: Requisição PUT
            result = await requestData(`/subjects/${id}`, "PUT", disciplineData, true);
        } else {
            // Modo de Criação: Requisição POST
            result = await requestData("/subjects", "POST", disciplineData, true);
        }

        if (result.success) {
            const successMessage = id ? result.data.message : "Disciplina cadastrada com sucesso!";
            setFlashMessage(successMessage, "success");
            navigate("/coordinator/discipline/list");
        } else {
            setFlashMessage(result.message, "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#060060] p-6">
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-2xl">
                    <div className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl ring-1 ring-white/20">
                        {/* Cabeçalho */}
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
                                    {/* MODIFICADO: Título e descrição dinâmicos */}
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {id ? "Editar Disciplina" : "Cadastro de Disciplinas"}
                                    </h2>
                                    <p className="text-slate-600 mt-1">
                                        {id ? "Altere os dados da disciplina abaixo." : "Preencha os campos abaixo para registrar uma nova disciplina."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Formulário */}
                        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                            {/* Nome da disciplina */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    Nome da disciplina
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex.: Cálculo Diferencial e Integral I"
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all duration-200"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Professor */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">Professor</label>
                                <div className="relative">
                                    <select
                                        className="appearance-none w-full px-4 py-3.5 rounded-xl bg-slate-50/80 text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all duration-200"
                                        value={professor}
                                        onChange={(e) => setProfessor(e.target.value)}
                                        required
                                    >
                                        <option value="">Selecione o professor</option>
                                        {professores.map((prof) => (
                                            <option key={prof.id} value={prof.id}>
                                                {prof.username} ({prof.institution})
                                            </option>
                                        ))}
                                    </select>
                                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                                        ▾
                                    </span>
                                </div>
                            </div>

                            {/* Botão cadastrar/salvar */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-500 hover:to-yellow-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <FiCheck className="w-5 h-5" />
                                    {/* MODIFICADO: Texto do botão dinâmico */}
                                    {id ? "Salvar Alterações" : "Cadastrar disciplina"}
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